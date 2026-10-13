# AS214242 GeoFeed

A Cloudflare Pages site for the [RFC 8805](https://datatracker.ietf.org/doc/html/rfc8805) GeoFeed of AS214242. The CSV is available at [`/geofeed.csv`](https://geofeed.wlms.dev/geofeed.csv).

## Deploy to Cloudflare Pages

Connect this repository to a Pages project. Use **None** for the framework preset, leave the build command empty, and set the output directory to the repository root (`.`). There is no build command or additional Worker to configure: Pages automatically deploys `functions/[[path]].js` alongside the static files.

Pages serves `/`, `/index.html`, `/assets/*`, `/config.json`, and `/geofeed.csv` as static assets. Direct visits to the six language URLs invoke the Pages Function to return translated HTML on the first response; these requests count toward Pages Functions usage. Trailing-slash language URLs redirect to their canonical slashless URL (HTTP 308) through the same Function. `_routes.json` keeps static resources out of Functions. The Function returns 404 for other unmatched paths.

## Languages

Supported URLs: `/en-GB`, `/zh-cn`, `/de-DE`, `/fr-FR`, `/it-IT`, `/es-ES`. The root URL uses the browser's preferred supported language, falling back to `en-GB`. Direct visits receive fully translated HTML from the Pages Function, including localized metadata, even without JavaScript. The language menu switches using translations already fetched from `/assets/locales.json` and updates the URL with the History API: no navigation, server-side render, or new translation request. Back and forward navigation updates the language as well. The root URL has an English HTML fallback if JSON cannot be loaded; a server-rendered language URL keeps its translated HTML if the browser cannot fetch JSON.

Edit `assets/locales.json` to change translated interface copy. Keep the same keys in all six languages. Update `config.json` for factual data (owner, ASN, CSV URL, update date, weekly update frequency, and external links). The page loads both JSON files at startup. English text in `index.html` is the static root template and should be kept in sync with `en-GB`.

The theme menu offers **Follow**, **Light**, and **Dark**. Follow is the default: it uses the operating system’s colour preference when available. On browsers without system theme support, it uses local time (light from 07:00 to 18:59; dark otherwise). Choices are saved in browser local storage when available. Theme and language switches are entirely client-side.

`_headers` controls static cache policies. Avoid immutable caching of unversioned files so content updates reach visitors.

## Files

- `geofeed.csv` — published GeoFeed
- `index.html`, `assets/style.css`, `assets/script.js` — static website
- `assets/locales.json` — six translations
- `config.json` — site facts and links
- `_routes.json`, `_headers` — Pages routing and cache configuration
- `functions/[[path]].js` — first-request language rendering and unmatched-request fallback

Licensed under MIT; see [LICENSE](LICENSE).
