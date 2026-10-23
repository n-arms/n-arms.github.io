# SEO status

Last updated: 2026-10-21. Build verified with `npm run build`.

**Legend:** ✅ done in code · ⏳ built but not deployed · 🔴 P0 · 🟠 P1 · 🟡 P2 · 🌐 off-site / owner action

## ✅ Done in this pass

### 1. Search/tab titles

The `<title>` tag is what appears in browser tabs, bookmarks, and (usually) the
Google result headline. It is intentionally different from the on-page H1.

| Page | `<title>` (tab / Google) | `og:title` (social card) | H1 (unchanged) |
|---|---|---|---|
| `/` | `Nick Armstrong (Embedded Systems & Firmware, Waterloo)` | `Nick Armstrong` | `Nick Armstrong` |
| `/blog/` | `Blog (Embedded Systems, Robotics & tinyML)` | `Blog — Nick Armstrong` | `Blog` |
| `/blog/sum-bytes-quickly/` | `Add This List of Numbers, But Fast (Cortex-M0+ Assembly Summing)` | `Add This List of Numbers, But Fast — Nick Armstrong` | `Add This List of Numbers, But Fast` |

- `src/layouts/BaseLayout.astro`: added optional `ogTitle` prop, separate from `title`.
- `src/content.config.ts`: added optional `seoKeywords` frontmatter field.
- `src/pages/blog/[...slug].astro`: builds tab title as `title (seoKeywords)`.
- `src/pages/blog/index.astro`, `src/pages/index.astro`: keyword tab titles.
- `src/content/blog/sum-bytes-quickly.md`: sets `seoKeywords`.
- `PUBLISHING.md`: documents the new field.

Future posts: add `seoKeywords: "..."` to frontmatter. Omit it and the tab title
is just the creative title.

### 2. Sitemap

- Installed `@astrojs/sitemap` (added to `package.json` / lockfile).
- Enabled in `astro.config.mjs`: `integrations: [alpinejs(), sitemap()]`.
- Generates `dist/sitemap-index.xml` → `dist/sitemap-0.xml`.
- Contains: `/`, `/blog/`, `/blog/sum-bytes-quickly/`. `404.html` is excluded.
- Uses `site: 'https://n-arms.github.io'` from the config.

### 3. `robots.txt`

- `public/robots.txt` → `dist/robots.txt`.
- Allows all crawlers and points to `https://n-arms.github.io/sitemap-index.xml`.

### 4. Canonical URLs

- `src/layouts/BaseLayout.astro`: emits `<link rel="canonical">` from the existing
  `canonicalURL` value (it was computed before but never rendered).
- `src/pages/index.astro`: computes the same value and emits its own canonical,
  since the homepage does not use `BaseLayout`.
- Verified on home, blog index, and the post.

### 5. Person structured data

- New `src/components/PersonJsonLd.astro`, included in `BaseLayout` and the homepage.
- Emits `Person` JSON-LD with name, URL, job title, description, Waterloo,
  `knowsAbout`, and `sameAs` for LinkedIn + GitHub.
- `url` derives from `Astro.site`, so it follows a future custom domain
  automatically once `site` is updated.

### 6. Identity links (`rel="me"`)

- `src/pages/index.astro`: LinkedIn and GitHub links now carry `rel="me"` and
  visible anchor text (`LinkedIn`, `GitHub`).
- Icons are now decorative (`alt=""`) so screen readers and crawlers do not
  duplicate the label.
- GitHub URL normalized to `https://github.com/n-arms`, matching the JSON-LD.
- `sameAs` values must stay in sync with these profile URLs.

### 7. Verification performed

```sh
npm run build
cat dist/robots.txt
cat dist/sitemap-0.xml
grep -o '<link rel="canonical"[^>]*>' dist/index.html
grep -o '<script type="application/ld+json">.*</script>' dist/index.html
grep -o '<a href="[^"]*"[^>]*rel="me"[^>]*>' dist/index.html
```

All passed. Sitemap log: `sitemap-index.xml created at dist`.

## ⏳ Deploy status

The changes are built into `dist/` but **not deployed**. `gh-pages` still serves
the previous version, so live canonical/sitemap/robots are not live yet.

Deploy with the workflow in `PUBLISHING.md`. The `cp -r dist/. /tmp/ghpages/`
step copies the new `robots.txt`, `sitemap-*.xml`, and canonical/JSON-LD HTML.
Do not delete `Resume.pdf` or `google1967e332c6949426.html` from `gh-pages`.

## ✅ Search Console verification

`public/google1967e332c6949426.html` (GSC URL-prefix property
`https://n-arms.github.io/`) is committed on `main` and deployed to `gh-pages`.
Live check: `curl -s https://n-arms.github.io/google1967e332c6949426.html`.

**This file must never be deleted** — if it 404s, the GSC property silently
lapses. A Domain property is not possible here (no DNS control over
`github.io`), so re-verify with a new file if the property is ever lost.

Remaining owner steps: Sitemaps → submit `sitemap-index.xml`; URL Inspection →
Request Indexing for `/`, `/blog/`, `/blog/sum-bytes-quickly/`.

## 🔴 P0 — outstanding

| Item | Owner | Notes |
|---|---|---|
| Verify site in Bing Webmaster Tools | you | Can import from GSC. Submit the same sitemap. |
| Confirm indexing | you | After deploy/submission, search `site:n-arms.github.io`; check GSC Coverage. |
| Custom domain + `CNAME` | you | Biggest long-term lever. Update `site` in `astro.config.mjs`, add `CNAME` to `gh-pages`, and re-check canonical/sitemap/JSON-LD URLs. |
| Inbound links | you | LinkedIn website field, GitHub profile/README, WARG page, cross-posts. Use anchor text `Nick Armstrong`, not `website`. |

## 🟠 P1 — content and metadata

- **Blog share metadata:** `og:type=article`, `article:published_time`,
  `og:image`, `twitter:card` on post pages. Currently they fall back to
  `og:type=website` and no image.
- **`BlogPosting` JSON-LD + breadcrumbs** on posts, with `author` pointing at the
  `Person` entity.
- **Dedicated 1200×630 OG image.** Current `drone-leds.jpg` is 1999×1113 and
  will be cropped by social cards.
- **Fix duplicate H1s in the post.** `#` headings in
  `src/content/blog/sum-bytes-quickly.md` render as `<h1>`. Change to `##`.
  The page currently has 7 H1s.
- **Project detail pages.** Five projects are only 3 bullets each and have no
  URLs. Best long-tail opportunity:
  `/projects/can-led-network/`, `/projects/semantic-vslam/`, etc.
- **Resume link.** `Resume.pdf` is orphaned on `gh-pages`. Rename to
  `nick-armstrong-resume.pdf` and link it from the homepage with anchor text
  `Nick Armstrong — Résumé`.
- **RSS feed** via `@astrojs/rss`, plus `<link rel="alternate">` in the head.
- **Refactor homepage onto `BaseLayout`.** It currently duplicates the `<head>`
  and all CSS, which is why canonical/JSON-LD had to be added twice.
- **Contextual internal links** from posts to projects and back.
- **Sharpen meta descriptions** once the target keyword set is settled.
- **Optional: `seoKeywords` for every future post**, e.g.
  `Add This List of Numbers, But Fast (Cortex-M0+ Assembly Summing)`.

## 🟡 P2 — polish

- `lang="en-CA"` instead of `en`.
- `og:site_name`, `og:locale`.
- `apple-touch-icon` / web manifest.
- Remove the unused Alpine integration. It ships ~55 KB of JS
  (`dist/_astro/page.*.js`) and there is no `x-data` in `src/`.
- Add `lastmod` to the sitemap and an explicit 404 exclusion.
- Add a visible About paragraph with full name, Waterloo, and specialization
  (the current bullets are thin indexable text).
- Consider `ProfilePage` / `WebSite` structured data in addition to `Person`.

## 🎯 Target queries

| Query | Target | Status |
|---|---|---|
| `n-arms` / `n-arms github` | brand handle | likely already #1 |
| `Nick Armstrong Waterloo` | primary name query | needs indexing + links |
| `Nick Armstrong embedded systems` | job-relevant name | needs indexing + links |
| `Nick Armstrong firmware` | recruiter query | needs indexing + links |
| `Cortex-M0+ sum array assembly` | blog post | winnable; title now matches |
| `STM32 CAN addressable LED drone` | CAN project | needs a project page |
| `Nick Armstrong resume` | resume search | needs PDF linked |
| `Nick Armstrong WARG` | team association | mention WARG by name |

Plain `Nick Armstrong` is crowded by namesakes; qualified queries are the goal.

## 🔍 Inspect after deploy

```sh
curl -s https://n-arms.github.io/robots.txt
curl -s https://n-arms.github.io/sitemap-index.xml
curl -s https://n-arms.github.io/ | grep -E 'canonical|ld\+json|rel="me"'
curl -s https://n-arms.github.io/blog/sum-bytes-quickly/ | grep canonical
```

Then:

1. GSC → URL Inspection → request indexing for `/`, `/blog/`, and the post.
2. Sitemaps → submit `https://n-arms.github.io/sitemap-index.xml`.
3. Bing Webmaster Tools → same sitemap.
4. Search `site:n-arms.github.io` and `Nick Armstrong Waterloo`.
