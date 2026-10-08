# Mumatec main website

A standalone, WordPress-free rebuild of the Mumatec Hosting website. This branch is for design review; its homepage opens at / like a normal website. It preserves the two-line Montserrat Mumatec wordmark and blue brand, with coral actions, warm highlights and original responsive imagery.

The public site includes hosting, domain search and transfers, business email, website design, SSL, help, contact, account information and pricing pages, plus compatible legacy URLs and a 404 page. The homepage leads with hosting packages and gives customers direct paths to domain search and support.

## Customer journeys

Hosting packages show monthly charges and full annual amounts. The domain search page presents a price guide without claiming live availability. Package selection calculates an estimated first-term price and prepares a request in the customer's email app. The contact form also prepares an email; the customer reviews and sends it from their own mail client. The customer portal page points existing customers to direct support while the portal is rebuilt.

This review branch is not connected to WHMCS, domain lookup, customer accounts, payments, ticket creation, analytics or form storage. No message is sent until a customer chooses Send in their email app. Hosting and website design prices follow the published Mumatec offers; domain prices are guides and require confirmation. Confirm the current catalogue, tax treatment and renewal terms before enabling live orders.

## Develop and verify

Edit site.json for contact details and published package baselines, scripts/build.py for page content, and public/assets/site.css for layout. brand.css retains the MumatecManager token snapshot. Run:

    python scripts/build.py
    python scripts/check_site.py
    node --check public/assets/site.js
    NODE_PATH=/tmp/mumatec-demo-qa/node_modules node scripts/test_site.cjs

The website is static and has no runtime package or server requirement. Generated pages are committed and Vercel serves public/ with clean URLs. Apache redirects are also provided. The content-fingerprinted CSS and JavaScript URLs prevent browsers from mixing assets between releases.

Batch substantial changes before updating the review branch to limit Vercel deployments. Do not merge this draft or point production at it before design approval and service verification.

## Price and brand provenance

Published hosting prices are R59 / R79 / R120 per month and R638 / R854 / R1 296 per year, for 15 / 30 / 60 GB storage and 2 / 3 / 5 websites. Published website design offers are R2 599 and R3 699. Plan names in this redesign are presentation names, not verified WHMCS product IDs. Preserve the actual annual amounts and calculate savings from them.

The original logo reference, brand colours and token snapshot come from ramanugut/MumatecManager. The user requested the same simple Montserrat text wordmark, retained here in navy and cyan. The portal artwork and workspace images are original generated illustrations, not photographs of Mumatec facilities or customer projects.
