// @ts-check
import { defineConfig } from 'astro/config';
// NOTE: Alpine.js kept as a dependency for later interactivity.
// Re-enable by re-adding the @astrojs/alpinejs integration below.
// import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
// n-arms.github.io is a user/org pages site, served from the repo root,
// so no `base` path is needed. `site` enables correct sitemap/canonical URLs.
export default defineConfig({
  site: 'https://n-arms.github.io',
  integrations: [],
});
