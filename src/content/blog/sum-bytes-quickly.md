---
title: Add This List of Numbers, But Fast
description: Increasingly optimized and illegible array summing techniques for the Cortex-M0+ core.
pubDate: 2026-10-19
tags: ["embedded", "simd", "performance"]
---

Problem: calculate the sum of an array of unsigned 8 bit integers as quickly as possible on a Cortex-M0+ CPU[^1].
# Solution 0: The Sane Way
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	uint32_t total = 0;
	for (uint32_t i = 0; i < size; ++i) total += arr[i];
	return total;
}
```
Hopefully this is how you'd solve this problem. It's fast enough for any real scenario and the most readable of any approach we'll implement. Despite how boring it is, its assembly is a bit verbose, so we'll skip to an equivalent version that assembles more concisely.
# Solution 1: The Compact Way
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	const uint8_t *end = arr + size;
	uint32_t total = 0;
	for (; arr < end; ++arr) total += *arr;
	return total;
}
```
Although this is less legible, it makes for cleaner assembly[^2],[^3]:
```armasm
sum: // r0 holds arr, and r1 holds size
	adds r1, r0, r1 // set r1 to end = arr + size
	movs r3, r0 // set r3 = arr
	movs r0, #0 // clear r0 so we can store total in it (r0 needs to hold the return value)
	cmp r3, r1
	bcs.n end // if the array is empty then bail immediately
loop: // r0 holds total, r3 holds arr, r1 holds end
	ldrb r2, [r3, #0] // load the current byte at arr into r2
	adds r3, #1 // increment arr
	adds r0, r0, r2 // add the current byte into total
	cmp r3, r1
	bne.n loop
end:
	bx lr // return
```

Critically, let's look at the loop body:
```armasm
loop: // r0 holds total, r3 holds arr, r1 holds end
	ldrb r2, [r3, #0] // load the current byte at arr into r2
	adds r3, #1 // increment arr
	adds r0, r0, r2 // add the current byte into total
	cmp r3, r1
	bne.n loop
```
Arithmetic instructions (such as `adds` and `cmp`) take 1 cycle to execute, while most memory accesses and branches take 2 cycles[^4]. This puts our loop body at 7 clock cycles to process a single byte, and a big part of that is the loop overhead of needing to increment arr, check for the for loop end condition, and goto the start of the loop.

Note that 7 cycles per byte is absolutely atrocious, yet it's the best `gcc -O3` was willing to do on my machine. Let's see how much better we can do.
# Solution 2: Loop Unrolling
This is a classic optimization: have one primary loop that processes several (in this case 4) elements at a time, and then end with a secondary smaller loop that cleans up any remaining elements if `size` isn't divisible by 4.
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	const uint8_t *end = arr + size - size % 4;
	uint32_t total = 0;
	// Main loop: loop size/4 times
	for (; arr < end; arr += 4) {
		total += arr[0];
		total += arr[1];
		total += arr[2];
		total += arr[3];
	}
	// Final cleanup: if size isn't divisible by 4, do the final steps here
	for (size = size % 4; size; --size) total += *arr++;
	return total;
}
```
The assembly for this already starts to get pretty big, but most of it is amortized away as `size` grows, so let's focus on the main loop:
```armasm
loop: // r0 holds total, r3 holds arr, r1 holds end
	ldrb r2, [r3, #0] // load arr[0]
	adds r0, r0, r2   // add arr[0] into total
	ldrb r2, [r3, #1] // repeat for arr[1], arr[2], arr[3]
	adds r0, r0, r2
	ldrb r2, [r3, #2]
	adds r0, r0, r2
	ldrb r2, [r3, #3]
	adds r0, r0, r2
	
	adds r3, #4 // arr += 4
	cmp r3, r1     
	bne.n loop     // if arr != end, continue the loop
```

This totals at 12 cycles for the 4 loads + `total` increments, and 4 cycles for the loop overhead. The fun thing about loop unrolling is that you can unroll by more than 4: if we want we can have 16 `total += arr[X]` statements in the loop body, by which point we'd have 48 cycles of actual work and 4 cycles for loop overhead. The total cost of a loop is <em>work + 4/unroll_factor</em>, which gives us +1 cycle/byte at <em>unroll_factor=4</em>, and only 0.25 cycle/byte at <em>unroll_factor=16</em>. For the rest of the article, we're going to ignore loop overhead entirely, as it largely gets amortized away by sufficient loop unrolling[^5].

This approach gives us 4 processed bytes in 12 cycles + loop overhead, or 3 cycles / byte. More than a 2x speedup from before.
# Solution 3: Fused Loads
Loads are really expensive, but a `ldrb` costs the same number of cycles as a `ldr`, so what if we load a whole word and then use shifting/masking to extract the individual bytes?[^6]
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	const uint8_t *block_end = arr + size - size % 4;
	uint32_t total = 0;
	// Main loop: loop size/4 times
	for (; arr < block_end; arr += 4) {
		uint32_t word = *((const uint32_t *) arr);
		total += word & 0xFF;
		total += (word >> 8) & 0xFF;
		total += (word >> 16) & 0xFF;
		total += (word >> 24) & 0xFF;
	}
	// Final cleanup: if size isn't divisible by 4, do the final steps here
	for (size = size % 4; size; --size) total += *arr++;
	return total;
}
```
The naive translation of the main loop is:[^7]
```armasm
loop: // r0 holds total, r3 holds arr, r1 holds end, r4 holds 0xFF
	ldr r2, [r3, #0] // load word from arr
	
	movs r5, r2 // extract byte 0 (LSB)
	ands r5, r4
	adds r0, r0, r5
	
	lsrs r5, r2, #8 // extract byte 1
	ands r5, r4
	adds r0, r0, r5
	
	lsrs r5, r2, #16 // extract byte 2
	ands r5, r4
	adds r0, r0, r5
	
	lsrs r5, r2, #24 // extract byte 3 (MSB)
	adds r0, r0, r5
	
	adds r3, #4
	cmp r3, r1
	bne.n loop
```
Counting only the main instructions of the loop you get 13 cycles / 4 bytes (worse than our previous version).

It turns out that if you use some specialized instructions you can do better:
- `uxtb` (**U**nsigned e**XT**end **B**yte): grabs the 8 LSB from a source register and zero extends them to the destination: effectively `rDest = rSrc & 0xFF`
- `rev16` (**REV**erse bytes in halfwords): reverses the byte order in each halfword: if `rSrc` holds $[b_0, b_1, b_2, b_3]$, then `rDest` will hold $[b_1, b_0, b_3, b_2]$.
- `ldmia` (**L**oa**D** **M**ultiple **I**ncrement **A**fter): load a word (or actually multiple) from `rPtr`, and then increment `rPtr += 4`.

`rev16` is the most important: extracting the middle two bytes takes two instructions (a shift and a `uxtb` or `ands`), whereas extracting the most significant or least significant byte takes only one (a shift or a `uxtb`). Since `rev16` swaps the two middle bytes with the two outer bytes in 1 cycle, we can write:
```armasm
loop: // r0 holds total, r3 holds arr, r1 holds end
	ldmia r3!, {r2} // load from *arr, then increment arr
	
	uxtb r5, r2 // extract byte 0 (LSB) - notice we don't need to store a mask constant in a register
	adds r0, r0, r5
	
	lsrs r5, r2, 24 // extract byte 3 (MSB)
	adds r0, r0, r5
	
	rev16 r2, r2 // reverse so now the middle bytes are LSB and MSB
	
	uxtb r5, r2 // extract byte 0 (LSB)
	adds r0, r0, r5
	
	lsrs r5, r2, 24 // extract byte 3 (MSB)
	adds r0, r0, r5
	
	cmp r3, r1 // notice we don't need to increment arr anymore thanks to ldmia
	bne.n loop
```
Which gets us down to 11 cycles / 4 bytes, or 2.75 cycles/byte, 2.5 times faster than our original function. On a normal CPU we might use SIMD to get an even bigger speedup, but the Cortex-M0+ doesn't have SIMD, so is that 2.75 cycle / byte implementation as fast as we can go?
# Solution 4: "We Have SIMD At Home"
While we don't have proper SIMD instructions, you can actually use `adds` to do 2 adds in a single cycle, under the right conditions. Consider a word consisting of 2 halfwords <em>[a, b] = a + 2<sup>16</sup>b</em>. If we do a normal `adds` of two such words, you get <em>[a, b] + [c, d] = a + 2<sup>16</sup>b + c + 2<sup>16</sup>d = (a + c) + (b + d)2<sup>16</sup></em>. So long as <em>a + c ≤ 65,535</em>, and <em>b + d ≤ 65,535</em>, you can rearrange to get <em>[a, b] + [c, d] = [a + c, b + d]</em>. More concretely: 1 + 3 = 4, and 2 + 4 = 6, so we can do 0x00010002 + 0x00030004 = 0x00040006.

We use this trick to accelerate `sum()`. Instead of keeping a single 32 bit `total`, we keep two 16 bit totals packed into a single accumulator:
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	const uint8_t *block_end = arr + size - size % 4;
	uint32_t acc = 0; // accumulator with two 16-bit lanes
	// Main loop: loop size/4 times
	for (; arr < block_end; arr += 4) {
		uint32_t word = *((uint32_t *) arr);
		acc += word & 0x00FF00FF;
		acc += (word >> 8) & 0x00FF00FF;
	}
	// turn the accumulator into a single total
	uint32_t total = (acc & 0xFFFF) + (acc >> 16);
	
	// Final cleanup: if size isn't divisible by 4, do the final steps here
	for (size = size % 4; size; --size) total += *arr++;
	return total;
}
```
We extract the 0th and 2nd bytes from the current word, and add them into the dual accumulator, and then do the same with the 1st and 3rd.

There's an issue with this though: after enough loop iterations, one of the lanes in `acc` might eventually exceed <em>65,535</em>. Since each loop iteration adds two bytes to each lane and a single iteration can add at most <em>2 × 255 = 510</em> to a lane, we can only do <em>⌊65,535 / 510⌋ = 128</em> loop iterations without worrying about a lane overflowing. To solve this problem, we iterate 128 times and then clear our accumulator[^8]:
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
   uint32_t acc = 0; // accumulator with two 16-bit lanes
   uint32_t total = 0;
   // Main loop: 128 words = 512 bytes per block
   for (uint32_t nblocks = size / 512; nblocks; --nblocks) {
	   const uint8_t *block_end = arr + 512;
	   for (; arr < block_end; arr += 4) {
		   uint32_t word = *((const uint32_t *)arr);
		   acc += word & 0x00FF00FF;
		   acc += (word >> 8) & 0x00FF00FF;
	   }
	   // fold accumulator into total, then clear it
	   total += (acc & 0xFFFF) + (acc >> 16);
	   acc = 0;
   }

   // Final cleanup: last size % 512 bytes, one at a time
   for (size %= 512; size; --size) total += *arr++;
   return total;
}
```
And looking at the inner loop:
```armasm
loop: // r0 holds acc, r3 holds arr, r1 holds block_end, r4 holds 0x00FF00FF
	ldr r2, [r3, #0]
	
	lsrs r5, r2, #8 // accumulate (word >> 8) & 0x00FF00FF
	ands r5, r4
	adds r0, r0, r5
	
	ands r2, r4     // accumulate word & 0x00FF00FF
	adds r0, r0, r2
	
	adds r3, #4
	cmp r3, r1
	bne.n loop
```
The actual loop body itself is a single load + 5 arithmetic operations: that's 7 cycles for 4 bytes, or 1.75 cycles / byte on the inner loop.
# Wrap-up
We went from 7 to 1.75 cycles/byte + overhead: start with a pointer loop, unroll it, fuse loads with `rev16`/`uxtb`, then fake 2-way SIMD using `adds` and flush every 128 words so the lanes don't carry. Our implementation is big, adds alignment requirements, and is significantly more arcane. Please don't actually use this anywhere.

[^1]: If you're not familiar, the Cortex-M0+ is one of the smallest Arm cores, appearing on a number of cost-effective low-power microcontrollers like the STM32G0 and U0 series, or the RP2040. Although it is a fully fledged 32 bit Arm ISA, it has only 56 instructions.
[^2]: This is roughly what `arm-none-eabi-gcc -O3` produces on my machine.
[^3]: Quick assembly recap: for the purposes of this blog, we have 8 registers r0-r7. `adds r0, r1, r2` sets `r0 = r1 + r2`, `movs r0, XYZ` sets `r0 = XYZ`, `cmp r0, r1` and `bXY.Z target` let you goto `target` if `r0` and `r1` meet some criteria, `ldr r0, [r1, #5]` sets `r0 = *(uint32_t *)&r1[5]`, and `ldrb` does the same but only loads 1 byte instead of a full word.
[^4]: This is all according to the [Cortex-M0+ TRM](https://documentation-service.arm.com/static/60411750ee937942ba301773). On a system with no wait states, `ldr` and its variants take 2 cycles, and a taken branch (every time we hit a `bne` in a for loop) also takes 2.
[^5]: In practice if you're writing normal firmware for a Cortex-M0+ class MCU you probably value code size a lot more than saving a couple cycles on summing a list of numbers, which is why loop unrolling is rarely done on MCUs. We're throwing code size out the window here to see how much we can push performance.
[^6]: This implementation requires `arr` to be word aligned: you can circumvent this by adding a little loop that iterates over the first 0-3 bytes until `arr` is word aligned, but I left it out for clarity.
[^7]: Although this is the most naive transformation possible, it's actually a cycle faster than what `arm-none-eabi-gcc -O3 -mcpu=cortex-m0plus -mthumb` produces on my machine: I'm actively losing faith in compilers while writing this post.
[^8]: The cleanup here is really wasteful (up to 511 iterations of the original scalar loop), but it amortizes out for large enough values of `size`.
