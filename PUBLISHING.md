# Publishing

## New post

1. Add `src/content/blog/<slug>.md` with frontmatter:
   ```md
   ---
   title: "Post title"
   seoKeywords: "Cortex-M0+ Assembly Summing"  # optional, appended to tab/Google title
   description: "One-liner (shown on /blog only)"
   pubDate: 2026-10-19
   tags: ["embedded"]  # optional
   draft: true          # optional, hides the post
   ---
   ```
2. Archive sorts newest-first automatically; homepage shows the latest 3.
3. Preview with `npm run dev`, verify with `npm run build`.

## Code blocks

- ARM/Thumb assembly: ` ```armasm ` fences. Shiki ships no ARM grammar, so this
  repo defines one in `grammars/armasm.tmLanguage.json`, registered under
  `markdown.shikiConfig.langs` in `astro.config.mjs` (additive — bundled
  languages like `c` still work).
- Everything else: standard Shiki fences (`c`, `rust`, …).
- Diffs of assembly: ` ```asmdiff ` fences. Same highlighting as `armasm`
  (`asmdiff` is an alias of that grammar), plus a per-line transformer in
  `astro.config.mjs` that tags lines `diff-add`/`diff-del`/`diff-ctx` from the
  leading `+`/`-`. Colours live in `BaseLayout.astro`; context lines fade via
  opacity. Indent with a single tab and put the marker at column 0 followed by
  three spaces (`+ \t` style gutters work too) so content lines up at column 4.
- Mnemonic rendering uncolored? Add it to the `instruction` alternation in the grammar.

## Colour

The site is black on white; the one exception is lane colours in the summing
post. Coloured spans need real HTML (tags inside backtick spans render
literally), so those lines use `<p class="simd"><code>…<span class="lane-N">`
with `lane-0`…`lane-3` meaning least-to-most significant byte, styled in
`BaseLayout.astro`. Escape `_` as `\_` when it appears inside *inline* HTML
(otherwise `0x0102_0102` becomes emphasis); raw HTML **blocks** (a line starting
with `<p>`) are exempt.

## Math

No LaTeX support. Use inline HTML: `<em>…</em>` for math, `<sup>`/`<sub>` for
exponents/indices, unicode operators (`≤ × ⌊⌋`).

## Deploy

```sh
git add <files> && git commit -m "..." && git push origin main
npm run build
git worktree add /tmp/ghpages gh-pages
rm -rf /tmp/ghpages/_astro && cp -r dist/. /tmp/ghpages/
cd /tmp/ghpages && git add -A && git commit -m "Deploy: ..." && git push origin gh-pages
cd - && git worktree remove --force /tmp/ghpages
```

Only built files are overwritten, so legacy files on `gh-pages` (`Resume.pdf`, …) survive.
