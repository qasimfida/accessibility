# Editing the Accessiblit logo

The logo is an original layered accessibility mark. Its editable vector paths
live in `src/ui/brand.ts` as `BRAND_PATH_DATA`, separated by `|` in a 24×24 viewBox.
Change that one source to customise the artwork. Paths may contain SVG path
commands, numbers, spaces and commas; URLs and markup are rejected by the helper.

From a source checkout with development dependencies installed:

```sh
npx playwright install chromium
node scripts/sync-brand.mjs
npm run format
npm run build:site
node scripts/capture-toolkit.mjs
npm run build:site
npm run verify
```

`sync-brand.mjs` updates all website header marks and the shared footer partial, the SVG favicon and the
SVG/PNG social image. Launcher and panel marks use the same source directly.
`capture-toolkit.mjs` refreshes the website's 440×760 panel image from the working
local build. Rebuild the site afterward to include that refreshed image.

The SVG favicon and social SVG are also editable vector assets. Regeneration
uses the authoritative paths in `brand.ts`, so copy artwork changes back there
before running the helper. Keep decorative SVGs hidden from assistive technology;
visible product names and launcher accessible names remain available as text.

This is source-level branding for maintainers and forks, rather than a runtime
logo URL option or an in-widget editor. It adds no public JavaScript API field,
font download or network request. Keep the license notices required by MIT.
