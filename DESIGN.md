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
Use the original Mumatec logo, deep blue and cyan identity, 14px rounded cards and small glossy highlights from ramanugut/MumatecManager. The public website serves South African business owners; the client area is a working surface for customers managing hosting, domains, invoices and tickets. English; en-ZA; no invented pricing, service limits, testimonials or uptime claims.

The website signature is a dark-blue domain-search panel next to a concise business headline. The client area uses familiar WHMCS controls with the same surfaces, actions and colours. Avoid purple accents, decorative dashboards, phone-width desktop layouts and oversized headings inside the account workspace.

## Colors
Runtime ownership (Model B): public/assets/brand.css in the main website and templates/mumatec/css/brand.css in the client area are identical copies of the portable brand-kit snapshot. These adapt MumatecManager's accepted tokens without importing its admin code. Keep them byte-identical when changing the shared kit. Primary #105479 maps to --ac; background #f0f6f9 to --bg; surface #ffffff to --card-bg; text #12364a to --tx; secondary #4e6777 to --tx2; muted #5e7381 to --tx3; cyan #38a8c8 to --cyan. White --on-ac is the foreground for blue filled controls. Error/success/warning roles use separate semantic variables.

## Typography
Body uses the existing system stack, 16px, with 1.55 line height in the client area and 1.65 for marketing reading. Arial is a display-only companion. Main website headline scale is reserved for marketing; account headings stay between 24px and 30px. Metadata may use 13px; regular controls and labels are at least 14px. Wrap names and long values.

## Layout
Public pages have a 1280px maximum and become one column below 640px; navigation collapses below 900px. Client area uses the Twenty-One Bootstrap layout, expanded to 1440px and 1600px on large displays. The desktop sidebar stays beside content; phones use the parent menu and natural document scrolling. Actions and search controls precede lists in DOM order. Only table containers scroll horizontally. Forms remain natural-height.

## Elevation & Depth
Keep small inset highlights and low-opacity shadows. Use deep blue on navigation and the domain-search panel; white cards sit on a light blue canvas. No decorative illustrations, glass blur, or animation loops. Preserve white space around the logo without redrawing its artwork.

## Shapes
14px cards (--radius), 10px controls (--control-radius), 999px status pills. The public domain panel is a named marketing exception at 24px, reducing to 18px on phones.

## Components
Main website header/footer, domain search, card and FAQ markup are shared by scripts/build.py. site.json owns contact and public catalogue links. site.js owns menu state and domain-input validation; site.css consumes the shared tokens.

WHMCS owns forms, server validation, authentication, authorisation, billing actions, table navigation, dialogs and feedback. templates/mumatec/css/custom.css adapts all parent surfaces. Header, footer and dashboard overrides retain upstream includes, dynamic menus and hook output. The dashboard quick links are navigation only. The public site never stores client information or credentials.

Buttons have hover, focus and pressed states; disabled buttons are visibly inactive. Error copy sits next to the domain field with a live region. All forms link to real service endpoints. Native WHMCS selects and date fields retain their platform popup behavior. Reduced motion and forced colours are supported by brand.css.

## Do's and Don'ts
Keep the exact original logo in both repos. Keep bills, payments, customer permissions and lifecycle decisions inside WHMCS. Keep package prices in the existing catalogue until a verified public feed or product export is supplied. Do not replace a real workflow with a simulated success, expose the Manager admin bridge, or copy staff authentication into the customer site.
