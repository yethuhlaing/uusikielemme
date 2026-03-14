# Uusi kielemme – Static site

Static Next.js site built from the WordPress mirror in `../uusikielemme.fi/` (wp-json + wp-content/uploads).

## Setup

- **Data:** Place the WordPress mirror at `uusikielemme.fi/` next to this `site/` folder (or set `WP_MIRROR_DIR` to point to it).
- **Build:** `npm run build` copies `wp-content/uploads` into `public/wp-content/uploads` and runs `next build`. Output is in `out/`.
- **Dev:** `npm run dev` (uses the same data path; no server needed for production, deploy the `out/` folder anywhere).

## Structure

- `app/page.tsx` – Home (page with link `https://uusikielemme.fi/` from wp-json).
- `app/[...slug]/page.tsx` – All other posts and pages; paths come from the `link` field in each JSON file.
- `lib/wp-json.ts` – Build-time loader: reads `wp-json/wp/v2/posts/*.json` and `wp-json/wp/v2/pages/*.json`, exposes `getAllPaths()` and `getByPath(slug)`.
- Image URLs in content are rewritten from `https://uusikielemme.fi/wp-content/uploads/` to `/wp-content/uploads/`.
