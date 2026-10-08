# Mumatec public website — launch gates

## Already implemented
- Semantic accessible navigation, mobile menu, responsive homepage and internal page routes
- Hosting, domains, websites, pricing, about, support, FAQ, contact, client-area landing, legal placeholders
- Shared visual system inspired by Mumatec Manager's blue/teal palette
- Starting price messaging, clear calls to action and a non-deceptive domain search form
- Vercel rewrite configuration for clean internal URLs

## Required before production
- Replace the temporary typographic M mark with the **actual approved Mumatec logo asset** from the brand source; never claim this mark is the original logo.
- Connect domain search to a **server-side** WHMCS or registrar API. Never expose API keys to browsers. Display real availability, registration, renewal and transfer prices.
- Confirm actual WHMCS product catalogue, VAT treatment, billing cycles and live order URLs. R99/year domains and R59/month hosting are historic starting prices only.
- Link client-area login to the verified secure portal after that portal is ready; do not implement a fake login.
- Verify Mumatec email, phone, physical/contact address and configure a spam-protected contact form with server-side delivery.
- Publish legally reviewed privacy policy, terms, acceptable-use policy, cancellations and service information.
- Replace conceptual browser mockup with approved brand assets and authentic product imagery if available.
- Run Lighthouse, accessibility, keyboard navigation, screen-reader, 320px/375px/768px/desktop checks, SEO metadata, sitemap, structured data and end-to-end purchase tests.
- Configure hosting, DNS, SSL, redirects from the WordPress URLs, analytics and search console; stage before changing production.
- Check live deployment and user journeys on real devices. No award outcome can be guaranteed.
