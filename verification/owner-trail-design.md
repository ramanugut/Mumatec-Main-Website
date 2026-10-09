# Owner trail design verification — 9 October 2026

Implemented Marven’s uploaded design as the homepage and shared design language for the separate service pages. Retained the current catalogue, complete service guide, enquiry-only behaviour and personal-phone removal.

## Checks performed

- Rebuilt 17 pages plus 404; all 18 HTML documents passed local route, asset, anchor, unique-ID, heading and review isolation checks.
- 63 standard interaction assertions passed.
- 64 service-guide and privacy assertions passed, including domain/hosting dependencies and the R300 external-host website setup fee.
- 10 service-motion assertions passed, including reduced-motion preference changes and no-observer fallback.
- 34 trail-specific assertions passed for homepage catalogue prices, monthly/yearly links, full-guide routing, separate-page navigation and removal of concept-only actions.
- Chromium ran 159 checks: all 18 pages at 320, 390, 768 and 1440 px for document overflow and phone links, plus desktop/mobile navigation, homepage yearly billing, local fonts, the guide’s first mobile choice, unobstructed Continue controls, globe drawing while visible, offscreen pause, reduced motion and resuming after the preference changes. No page errors or failed asset responses were observed.
- Inspected desktop screenshots of the homepage and all main service heroes, hosting pricing and guided setup. Inspected mobile screenshots of homepage, hosting, domains, websites, contact and setup. Corrected mobile header width, illustration arrangement, heading contrast and excessive guide introduction height during this review.

Homepage HTML, CSS, JavaScript and fonts total 205,770 bytes before compression, excluding the favicon. Globe drawing is capped at 30 fps and pauses offscreen; no runtime animation dependency or large homepage raster image was added. This does not establish production loading speed or conversion results.

Changes target the existing review branch. Production, the client-area project, WHMCS and payments remain outside this update.
