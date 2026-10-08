# Mumatec main website

A WordPress-free, dependency-free public website with the unchanged Mumatec logo and Manager design kit. Twelve generated pages cover hosting, domains, email, website design, SSL, support, contact, about, pricing and FAQ routes. Two original generated images are optimized as responsive WebP assets.

## Develop and preview

Edit `site.json` for contact and WHMCS catalogue links, `scripts/build.py` for content, and `public/assets/site.css` for the layout. Run `python scripts/build.py`. Preview with `python -m http.server 8000 --directory public`. Generated pages are committed, so deployment needs no package installation or build step. Vercel serves `public/` with clean URLs. Apache can serve the same folder; `.htaccess` preserves native billing paths and resolves clean HTML routes.

The website contains working mobile navigation, domain input validation and search clearing, keyboard-accessible FAQs, direct contact actions, and native WHMCS ordering/account/support links. Domain availability and prices come from WHMCS, not simulated website results. SEO titles, descriptions, canonical URLs, social metadata, sitemap, 404 and security headers are included.

## Current integration

WHMCS is published at https://mumatechosting.co.za/billing/. The website hands off to WHMCS for ordering, domain registration/transfer, accounts, invoices and tickets. Domain input uses `cart.php?a=add&domain=register&query=...`. Login and payment never run in website JavaScript.

Product endpoints and contact details were verified against the public Mumatec site on 8 October 2026. Automated access to the live package catalogue is blocked by cPGuard, so this site displays no guessed prices, limits, uptime or response-time promises. Individual plan comparison needs the current product export or an accessible WHMCS feed.

## Install

Upload the contents of `public/` to the website document root on staging, preserving the existing `/billing/` directory. Install the rebuilt client theme from `ramanugut/Mumatec-Client-Area` in the existing WHMCS installation. Native client links replace the WordPress bridge.

If moving the root domain to Vercel, first move WHMCS to an independently reachable billing hostname and update `site.json`, or configure a verified reverse proxy. Merely changing DNS to Vercel will not move PHP/WHMCS. Do not switch the root domain while links still depend on its former server.

The existing legal documents remain linked at `/refund_returns/`; `/terms`, `/privacy` and `/acceptable-use` redirect to that published policy page. Export that exact content into the static site before retiring WordPress. Also migrate existing articles/free-website applications and map historical `/whmcs-bridge/` query routes. These are cutover requirements, not new marketing promises.

Back up the current files/database, validate native checkout/domain lookup/contact links and existing routes, then release after review. Restore the former document root/theme to roll back. See `LAUNCH_CHECKLIST.md` for outstanding live checks.

## Provenance

Original PNG and Manager colours: `ramanugut/MumatecManager` tree `d9f538fa6e2f53a2c05e53e9c0157db8c310566e`. The logo is unchanged; CSS crops its existing transparent canvas using Manager's crop. Shared `brand.css` matches the client theme byte for byte. Images are original generated artwork: a conceptual hosting sculpture and an illustrative business workspace, not photographs of Mumatec infrastructure or customers. Manager itself is untouched.
