# Mumatec Hosting — owner-supplied trail design

The visual source is Marven’s `Mumatec Hosting Trail.html`. Use its deep blue atmosphere, cyan light, warm orange actions, physical server layers, rounded glass cards and connected scroll trail. The website remains multi-page: the trail is the homepage, while each service has a dedicated page and its own customer decision.

## Shared design system

| Role | Value |
| --- | --- |
| Deep background | #061f33 |
| Blue background | #0a3a5e |
| Logo blue | #0e4f7c |
| Cyan accent | #27a5cd |
| Light cyan | #5cc9ea |
| Primary action | #d4511f |
| Action highlight | #ff8a50 |
| Light page | #f6fafc |
| Pale blue section | #e3f2f9 |
| Main text | #08263d |
| Supporting text | #496479 |

Headings use Bricolage Grotesque at 88% width; body text uses Figtree. Both are local WOFF2 files, with their OFL licenses included. The display font retains variable weight but fixes optical size and width to reduce the file from 131,548 to 40,928 bytes. The Montserrat wordmark remains separate and consistent on every page.

## Page structure

- The homepage follows the supplied seven-part composition: business launch, hosting plans, included tools, domain/website/email explanation, Pretoria contact, questions and final action.
- Navigation opens dedicated hosting, domains, email, websites, SSL, support and about pages. Contact, guided setup, quick setup, domain results, service details and the account status page remain separate.
- Service heroes share the homepage’s dotted blue background, cyan heading accent, orange actions and 3D depth. Illustrations show the service being discussed.
- Hosting uses the supplied physical slab treatment both in the hero and in package cards.
- The full guided setup remains the destination of “Help me choose” and the homepage guide callout. It explains services visually and preserves owner-confirmed service rules.
- Small screens keep native document scrolling. The homepage’s connected scene becomes a normal block; the guide explanation becomes compact so the first choice remains visible. Continue controls follow the choices and do not cover them.

## Motion and performance

`trail.js` updates the trail and progress on scroll through a queued animation frame; it does not intercept scrolling. The globe is drawn only while its hero is visible, with a 30 fps cap and fewer points on phones. Section animations pause when offscreen. Hidden documents stop the draw scheduler. Reduced motion disables animation and keeps the full content visible, including after the preference changes while the page is open.

The homepage has no large raster hero image, animation library, WebGL engine or framework. Homepage HTML, CSS, JavaScript and fonts total approximately 206 KB before compression, excluding the favicon. This is a bundle measurement, not a loading-time claim. Other pages reuse the existing responsive images, shared styles and native controls.

## Source ownership

| Concern | Source |
| --- | --- |
| Catalogue, contact and fee | site.json |
| Homepage composition | templates/trail-home.html and scripts/trail_page.py |
| Shared typography, colours, header, footer and page styling | public/assets/trail-theme.css and trail-fonts.css |
| Homepage composition styling | public/assets/trail.css |
| Trail, visibility, pointer and progress behaviour | public/assets/trail.js |
| Decorative globe and server skyline | public/assets/trail-canvas.js |
| Dedicated service content and illustrations | scripts/service_pages.py |
| Guide branching and service validation | scripts/setup_page.py and public/assets/setup.js |
| Billing, domain input and enquiry preparation | public/assets/site.js |

Build with `python scripts/build.py`. Public outputs must stay reproducible; edit the generator/template together with styling, rather than editing generated HTML alone.

The client-area rebuild remains paused. Domain availability, order creation, payments and WHMCS are disconnected. Prices are guides confirmed before setup. Do not add fake status, testimonials, availability results, scarcity or uptime claims.
