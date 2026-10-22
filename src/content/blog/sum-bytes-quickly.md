---
title: Add This List of Numbers, But Fast
seoKeywords: Cortex-M0+ Assembly Summing
description: Increasingly optimized and illegible array summing techniques for the Cortex-M0+ core.
pubDate: 2026-10-19
tags: ["embedded", "simd", "performance", "tinyml"]
---

I've recently been working a lot with writing SIMD kernels to accelerate heavy tasks on microcontrollers. There's a huge class of microcontrollers that don't have a DSP instruction in sight though: some of my favorite chips like the STM32G0/U0 series and the RP2040 all have Cortex-M0+ CPUs. This left me wondering: with only 56 instructions and in-order execution, what is the absolute fastest way to sum 8-bit integers?
## Solution 0: The Sane Way
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	uint32_t total = 0;
	for (uint32_t i = 0; i < size; ++i) total += arr[i];
	return total;
}
```
Hopefully this is how you'd solve this problem. It's fast enough for any real scenario and the most readable of any approach we'll implement. Despite how boring it is, its assembly is a bit verbose (I'm not reading more than a page of assembly unless I'm getting paid), so we'll skip to an equivalent version that assembles more concisely.
## Solution 1: The Compact Way
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	const uint8_t *end = arr + size;
	uint32_t total = 0;
	for (; arr < end; ++arr) total += *arr;
	return total;
}
```
Although this is less legible, it makes for cleaner assembly[^1],[^2]:
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
Arithmetic instructions (such as `adds` and `cmp`) take 1 cycle to execute, while most memory accesses and branches take 2 cycles[^3]. This puts our loop body at 7 clock cycles to process a single byte, of which a large portion is the loop overhead of needing to increment `arr`, check for the for loop end condition, and jump to the start of the loop.

Note that 7 cycles per byte is absolutely atrocious, yet it's the best `gcc -O3` was willing to do on my machine. Let's see how much better we can do.
## Solution 2: Loop Unrolling
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
The assembly for this already starts to get pretty big, but most of it doesn't really matter for performance, so let's focus on the main loop:
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

This totals at 12 cycles for the 4 loads/counter increments, and another 4 cycles for the loop overhead: we brought down our loop overhead from 4 cycles/byte to 1 cycle/byte versus solution 1.

The fun part of loop unrolling is that sufficient persistence can kill loop overhead entirely. If you wanted to, you could have 32 `total += arr[X]` statements in the loop body, by which point we'd have 96 cycles of actual work and only 4 cycles of loop overhead. That's a rounding error in my book, so while 32x unrolled loops might be terrible for code space (which frequently matters when you only have 16 KB of flash), for the rest of the article we're going to ignore loop overhead entirely[^4].

Given that, this approach processes 4 bytes in 12 cycles + loop overhead, or 3 cycles / byte. More than a 2x speedup from our first solution.
## Solution 3: Fused Loads
On a more conventional core, one of the first optimizations I'd make in a routine like this would be to minimize the number of memory accesses we need to make. It turns out that this works just as well on the M0+.

Loads are really expensive, but a `ldrb` costs the same number of cycles as a `ldr`, so what if we load a whole word and then use shifting/masking to extract the individual bytes?[^5]
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
The naive translation of the main loop is:[^6]
```armasm
loop: // r0 holds total, r3 holds arr, r1 holds end, r4 holds 0xFF
	ldr r2, [r3, #0] // load word from arr

	movs r5, r2 // extract and accumulate byte 0 (LSB)
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

We can make this better though!

 There are two pieces we can fix easily: we spend a whole register holding `0xFF`, and we waste an instruction in the loop overhead doing `arr += 4`. The nice part about only having 56 instructions is that you can keep them in your head and pick better ones. `uxtb` (**U**nsigned e**XT**end **B**yte) grabs the 8 LSB from a register, essentially doing `x & 0xFF` without needing to waste a register on the mask, and `ldmia` (**L**oa**D** **M**ultiple **I**ncrement **A**fter) loads a word (or words) from a pointer and then increments it.

Using these doesn't directly reduce the cycles/byte, but it eases up on register pressure and reduces loop overhead:
```asmdiff
loop:
-   ldr r2, [r3, #0] // load word from arr
+   ldmia r3!, {r2} // load from *arr, then increment arr

-   movs r5, r2 // extract and accumulate byte 0 (LSB)
-   ands r5, r4
+   uxtb r5, r2 // extract and accumulate byte 0 (LSB)
	adds r0, r0, r5

+   // do the same for the other 3 byte extractions

-   adds r3, #4
	cmp r3, r1
	bne.n loop
```

This knocks off an instruction by getting rid of an unnecessary `movs`, but there's a more clever win to be had. Extracting the upper and lower byte is really easy: you can either do a shift (`x >> 24` gives you the MSB), or a mask (`x & 0xFF` gives you the LSB). The issue is that extracting the middle bytes is harder, because you need to do both a shift and a mask.

Conveniently, Cortex-M0+ has an instruction that can help! `rev16` swaps the bytes inside each halfword in a register: `0xAABB_CCDD` turns into `0xBBAA_DDCC`. When I first read the 56 instructions I had to work with, I was very skeptical of this specific byte swapping operation being in the top 56 most important instructions Arm could pick. I'm eating my words though! `rev16` takes the middle bytes and makes them LSB and MSB, which makes them trivial to pick off:
```asmdiff
loop: // r0 holds total, r3 holds arr, r1 holds end
	ldmia r3!, {r2} // load from *arr, then increment arr

	uxtb r5, r2 // extract byte 0 (LSB)
	adds r0, r0, r5

	lsrs r5, r2, #24 // extract byte 3 (MSB)
	adds r0, r0, r5

+   rev16 r2, r2 // reverse so now the middle bytes are LSB and MSB

+   uxtb r5, r2 // extract byte 1, which is now the LSB
+   adds r0, r0, r5

+   lsrs r5, r2, #24 // extract byte 2, which is now the MSB
+   adds r0, r0, r5
...
```
These optimizations get us down to 11 cycles / 4 bytes, or 2.75 cycles/byte, 2.5 times faster than our original function. On a normal CPU we might use SIMD to get an even bigger speedup, but the Cortex-M0+ doesn't have SIMD, so is that 2.75 cycle / byte implementation as fast as we can go?
## Solution 4: "We Have SIMD At Home"
We don't have proper SIMD instructions, but let's dream for a second. Think about a simple SIMD add: pack multiple numbers into a register, and add them lane by lane in a single cycle:

<p class="simd"><code>[<span class="lane-3">1</span>, <span class="lane-2">2</span>, <span class="lane-1">1</span>, <span class="lane-0">2</span>] + [<span class="lane-3">1</span>, <span class="lane-2">2</span>, <span class="lane-1">3</span>, <span class="lane-0">4</span>] = [<span class="lane-3">2</span>, <span class="lane-2">4</span>, <span class="lane-1">4</span>, <span class="lane-0">6</span>]</code></p>

What happens if we try to do this with a normal `adds` instruction?

<p class="simd"><code>0x<span class="lane-3">01</span>_<span class="lane-2">02</span>_<span class="lane-1">01</span>_<span class="lane-0">02</span> + 0x<span class="lane-3">01</span>_<span class="lane-2">02</span>_<span class="lane-1">03</span>_<span class="lane-0">04</span> = 0x<span class="lane-3">02</span>_<span class="lane-2">04</span>_<span class="lane-1">04</span>_<span class="lane-0">06</span></code></p>

Every lane added at once, no SIMD instruction required.

So wait we do have SIMD add?

It turns out this breaks in one case. If any one of our "lanes" overflows, it doesn't wrap correctly and instead corrupts adjacent lanes: on a real SIMD add, `0xFF + 0x01` would give `0x00` without carrying into the next lane after it.

So as long as we can guarantee there is never an overflow, we can use `adds` to do SIMD for us. To help with avoid overflows, we'll do 2 16-bit lanes instead of 4 8-bit lanes. Instead of keeping a single 32 bit `total`, we can keep two 16 bit totals packed into a single accumulator:
```c
uint32_t sum(const uint8_t *arr, uint32_t size) {
	const uint8_t *block_end = arr + size - size % 4;
	uint32_t acc = 0; // accumulator with two 16-bit lanes
	// Main loop: loop size/4 times
	for (; arr < block_end; arr += 4) {
		uint32_t word = *((const uint32_t *) arr);
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
We extract the 0th and 2nd bytes from the current word, and add them into the dual accumulator, and then do the same with the 1st and 3rd. This blows my mind every time I look at it, but it mostly works!

There's still the issue of overflows though. Since we have 16-bit lanes, each lane can only grow up to 2<sup>16</sup> before cross-lane corruption. Each byte is at most 255, and each loop iteration adds 2 bytes to a lane, so ⌊2<sup>16</sup> / (2 × 255)⌋ = 128 gives us the number of loop iterations you can do before an overflow could happen, even if all the bytes are `0xFF`. That's big enough that we can loop 128 times, then record our accumulator lane values and reset them.
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

   // Final cleanup: last size % 512 bytes, one at a time[^7]
   for (size %= 512; size; --size) total += *arr++;
   return total;
}
```
And looking at the inner loop:
```armasm
loop: // r0 holds acc, r3 holds arr, r1 holds block_end, r4 holds 0x00FF00FF
	ldmia r3!, {r2}

	lsrs r5, r2, #8 // accumulate (word >> 8) & 0x00FF00FF
	ands r5, r4
	adds r0, r0, r5

	ands r2, r4     // accumulate word & 0x00FF00FF
	adds r0, r0, r2

	cmp r3, r1
	bne.n loop
```
The actual loop body itself is a single load + 5 arithmetic operations: that's 7 cycles for 4 bytes, or 1.75 cycles / byte on the inner loop.
## Wrap-up
We went from 7 to 1.75 cycles/byte + overhead: start with a pointer loop, unroll it, fuse loads with `rev16`/`uxtb`, then fake 2-way SIMD using `adds` and flush every 128 words so the lanes don't carry. Our implementation is big, adds alignment requirements, and is significantly more arcane. Please don't actually use this anywhere.

[^1]: This is roughly what `arm-none-eabi-gcc -O3` produces on my machine.
[^2]: Quick assembly recap: for the purposes of this blog, we have 8 registers r0-r7. `adds r0, r1, r2` sets `r0 = r1 + r2`, `movs r0, XYZ` sets `r0 = XYZ`, `cmp r0, r1` and `bXY.Z target` let you goto `target` if `r0` and `r1` meet some criteria, `ldr r0, [r1, #5]` sets `r0 = *(uint32_t *)&r1[5]`, and `ldrb` does the same but only loads 1 byte instead of a full word.
[^3]: This is all according to the [Cortex-M0+ TRM](https://documentation-service.arm.com/static/60411750ee937942ba301773). On a system with no wait states, `ldr` and its variants take 2 cycles, and a taken branch (every time we hit a `bne` in a for loop) also takes 2.
[^4]: In practice if you're writing normal firmware for a Cortex-M0+ class MCU you probably value code size a lot more than saving a couple cycles on summing a list of numbers, which is why loop unrolling is rarely done on MCUs. We're throwing code size out the window here to see how much we can push performance.
[^5]: This implementation requires `arr` to be word aligned: you can circumvent this by adding a little loop that iterates over the first 0-3 bytes until `arr` is word aligned, but I left it out for clarity.
[^6]: Although this is the most naive transformation possible, it's actually a cycle faster than what `arm-none-eabi-gcc -O3 -mcpu=cortex-m0plus -mthumb` produces on my machine: I'm actively losing faith in compilers while writing this post.
[^7]: The cleanup here is really wasteful (up to 511 iterations of the original scalar loop), but it amortizes out for large enough values of `size`.
