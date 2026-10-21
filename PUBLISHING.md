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
- Mnemonic rendering uncolored? Add it to the `instruction` alternation in the grammar.

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
