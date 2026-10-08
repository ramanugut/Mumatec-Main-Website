---
version: alpha
colors:
  primary: "#105479"
  background: "#f0f6f9"
  surface: "#ffffff"
  text: "#12364a"
  secondaryText: "#4e6777"
  mutedText: "#5e7381"
typography:
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    lineHeight: "1.55"
rounded:
  card: "14px"
omitted:
  - section: spacing
    reason: "Runtime CSS and Tailwind remain the canonical spacing owners."
---

# Mumatec Hosting

## Overview
Preserve the Mumatec navy / cyan identity, 14px cards and glossy highlights from ramanugut/MumatecManager. The user requested a text recreation of the two-line wordmark in locally served Montserrat. The public website serves South African business owners. The main site is reviewed as a standalone website; the client-area rebuild is separate. Use published offers and avoid invented testimonials or operational guarantees.

The main-site signature is a concise navy hero, warm editorial image of a small business owner, full-width domain search dock and three clear package cards. On phones the business decision comes before the image and domain search. Paid website design uses an illustrative workspace. Avoid purple accents, fake dashboards and excessive badges.

## Colors
Runtime ownership (Model B): public/assets/brand.css in the main website and templates/mumatec/css/brand.css in the client area are identical copies of the portable brand-kit snapshot. These adapt MumatecManager's accepted tokens without importing its admin code. Keep them byte-identical when changing the shared kit. Primary #105479 maps to --ac; background #f0f6f9 to --bg; surface #ffffff to --card-bg; text #12364a to --tx; secondary #4e6777 to --tx2; muted #5e7381 to --tx3; cyan #38a8c8 to --cyan. White --on-ac is the foreground for blue filled controls. Error/success/warning roles use separate semantic variables.

## Typography
Body uses the existing system stack, 16px, with 1.55 line height in the client area and 1.65 for marketing reading. Arial is a display-only companion. Main website headline scale is reserved for marketing; account headings stay between 24px and 30px. Metadata may use 13px; regular controls and labels are at least 14px. Wrap names and long values.

## Layout
Public pages have a 1280px maximum and become one column below 640px; navigation collapses below 900px. Client area uses the Twenty-One Bootstrap layout, expanded to 1440px and 1600px on large displays. The desktop sidebar stays beside content; phones use the parent menu and natural document scrolling. Actions and search controls precede lists in DOM order. Only table containers scroll horizontally. Forms remain natural-height.

## Elevation & Depth
Keep small inset highlights and low-opacity shadows. Use deep blue on navigation and the domain-search panel; white cards sit on a light blue canvas. Original illustrations are allowed in marketing, with no claim to depict Mumatec facilities or clients. Avoid glass blur and animation loops. The Montserrat text wordmark follows the original proportions and colours; retain the original PNG as reference.

## Shapes
14px cards (--radius), 10px controls (--control-radius), 999px status pills. The public domain panel is a named marketing exception at 24px, reducing to 18px on phones.

## Components
Main website header/footer, domain search, card and FAQ markup are shared by scripts/build.py. site.json owns contact and public catalogue links. site.js owns menu state and domain-input validation; site.css consumes the shared tokens.

WHMCS owns forms, server validation, authentication, authorisation, billing actions, table navigation, dialogs and feedback. templates/mumatec/css/custom.css adapts all parent surfaces. Header, footer and dashboard overrides retain upstream includes, dynamic menus and hook output. The dashboard quick links are navigation only. The public site never stores client information or credentials.

Buttons have hover, focus and pressed states; disabled buttons are visibly inactive. Error copy sits next to the domain field with a live region. Demo forms and account actions are isolated locally. Orders, payments and credentials remain disabled. Native WHMCS selects and date fields retain their platform popup behavior. Reduced motion and forced colours are supported by brand.css.

## Do's and Don'ts
Main website: use the approved Montserrat text recreation; client repository remains separate. Keep billing, permissions and account lifecycle actions disconnected during review. Show current published prices with clear billing terms. Never claim a domain is available, an enquiry was sent, or a payment succeeded. Do not expose the Manager admin bridge or staff authentication.

## Main-site attention colours
The user approved relevant supporting colours. The isolated marketing site uses warm coral #b54b2b for principal actions and the selected billing cycle, #94381e for hover, #fff3eb for the middle package surface and #fbf6f0 for the business / email storytelling surface. Navy / cyan remain the wordmark and identity. White action text exceeds 4.5:1 contrast. Colour is paired with labels, borders and input state; it is not the sole indication of selection. These are main-site extensions, not changes to the paused client kit.
