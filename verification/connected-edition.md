# Connected edition — 9 October 2026

Main website only. The customer-facing root opens without a review wrapper. WHMCS, accounts, payment and live domain availability remain disconnected.

## Changes

Published Mumatec offers inform plan fit and benefit copy. The homepage pairs a perspective website illustration with domain and email layers, a direct price and hosting CTA, domain search, package comparison, included tools, a connected business story, local assistance and relevant FAQs. Mint, copper and coral extend the navy/cyan identity. Gloss uses static light-catching gradients and borders. The desktop story has an observer-driven sticky illustration; phones have natural scrolling. Reduced-motion preferences disable effects and restore all visible content. The mobile header now has one row; contact is available in its menu.

## Verification

- `python scripts/build.py`: 16 pages plus 404 and sitemap.
- `python scripts/check_site.py`: 17 HTML documents, local links/assets/anchors, unique IDs, heading structure, noindex and isolation passed.
- `node --check public/assets/site.js`: passed.
- `NODE_PATH=/tmp/mumatec-demo-qa/node_modules node scripts/test_site.cjs`: 61 interaction assertions passed.
- `NODE_PATH=/tmp/mumatec-demo-qa/node_modules node scripts/test_motion.cjs`: 13 motion assertions passed, including observer completion, story selection, preference change and fallback.
- Headless Chromium rendered 13 key routes at 320, 390, 768 and 1440px. All 52 route/width checks passed without page-level overflow or broken loaded images.
- 11 additional browser checks passed for scroll story, reduced-motion changes, mobile menu/Escape, annual pricing and selection handoff, domain validation, and enlarged text on four representative pages. No page JavaScript errors.
- Desktop homepage, connected story and phone homepage screenshots were visually inspected locally.

## Performance boundary

No new runtime dependency, WebGL, video, scroll interception or perpetual JavaScript loop. Hero artwork uses responsive local WebP; other images are lazy-loaded and dimensioned. CSS and JavaScript together are about 22 KB compressed with gzip. This is a transfer-size measurement, not a measured real-device Lighthouse or conversion score. No claim of guaranteed sales or superiority is made.

## Content boundary

Some original pages time out or block retrieval. CONTENT-SOURCES.md distinguishes freshly reconfirmed indexed details from previously gathered published offers. No made-up review, uptime metric, deadline or availability result is displayed. Domain estimates, support hours and launch terms still require confirmation before live service integration.
