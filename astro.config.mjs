// @ts-check
import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
// n-arms.github.io is a user/org pages site, served from the repo root,
// so no `base` path is needed. `site` enables correct sitemap/canonical URLs.
export default defineConfig({
  site: 'https://n-arms.github.io',
  integrations: [alpinejs()],
});
