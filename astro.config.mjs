// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// n-arms.github.io is a user/org pages site, served from the repo root,
// so no `base` path is needed. `site` enables correct sitemap/canonical URLs.
// Custom TextMate grammar for ARM/Thumb assembly (Shiki ships no ARM grammar).
// Loaded as JSON (rather than imported) so the config stays plain Node ESM.
const armasmGrammar = JSON.parse(
  readFileSync(new URL('./grammars/armasm.tmLanguage.json', import.meta.url), 'utf-8')
);

// `asmdiff` is an alias of the ARM grammar so ```asmdiff fences highlight just
// like ```asm. The diff treatment (grey context lines, green/red +/- lines) is
// applied per-line by the transformer below; the colours live in BaseLayout.
const asmdiffGrammar = {
  ...armasmGrammar,
  name: 'asmdiff',
  displayName: 'ARM Assembly (diff)',
  scopeName: 'source.asmdiff',
};

// Tags each line of an `asmdiff` block so CSS can grey out unchanged lines and
// colour additions/removals. Shiki has no notion of diff lines, so we look at
// the rendered text for the leading +/-.
const lineText = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(lineText).join('');

const asmdiffLines = {
  name: 'asmdiff-lines',
  line(hast) {
    if (this.options.lang !== 'asmdiff') return;
    const marker = lineText(hast).trimStart()[0];
    const kind = marker === '+' ? 'diff-add' : marker === '-' ? 'diff-del' : 'diff-ctx';
    this.addClassToHast(hast, kind);
  },
};

export default defineConfig({
  site: 'https://n-arms.github.io',
  integrations: [alpinejs(), sitemap()],
  markdown: {
    shikiConfig: {
      // Custom grammars are additive: bundled languages (e.g. `c`) still
      // lazy-load on demand, so existing code fences keep working.
      langs: [armasmGrammar, asmdiffGrammar],
      transformers: [asmdiffLines],
    },
  },
});
