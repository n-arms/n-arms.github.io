// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
// NOTE: Alpine.js kept as a dependency for later interactivity.
// Re-enable by re-adding the @astrojs/alpinejs integration below.
// import alpinejs from '@astrojs/alpinejs';

import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
// n-arms.github.io is a user/org pages site, served from the repo root,
// so no `base` path is needed. `site` enables correct sitemap/canonical URLs.
// Custom TextMate grammar for ARM/Thumb assembly (Shiki ships no ARM grammar).
// Loaded as JSON (rather than imported) so the config stays plain Node ESM.
const armasmGrammar = JSON.parse(
  readFileSync(new URL('./grammars/armasm.tmLanguage.json', import.meta.url), 'utf-8')
);

export default defineConfig({
  site: 'https://n-arms.github.io',
  integrations: [alpinejs()],
  markdown: {
    shikiConfig: {
      // Custom grammars are additive: bundled languages (e.g. `c`) still
      // lazy-load on demand, so existing code fences keep working.
      langs: [armasmGrammar],
    },
  },
});
