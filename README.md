# Mumatec main website — review demo

A self-contained, WordPress-free redesign for review before connecting real data. Client-area work is paused. Thirteen canonical pages, three compatibility aliases and a 404 cover the public site, sample domain search, order review and account entry. Two original illustrations are served as responsive WebP images.

## Review
`/design-preview` offers all main-site screens at 320, 390, 768 and 1200 px, plus 200% text. The normal homepage is `/`. Compare packages, switch monthly / full annual billing, select a package and review a local order. Search for sample domain results; real availability is not claimed. Enquiry forms show local feedback without sending or saving anything. Account credentials and payments remain disabled. Call / email links open the user's device applications.

No free-website promotion, fabricated reviews, customer counts, uptime guarantee or infrastructure photograph is included. All pages are noindex. There are no active billing links, API requests, payment actions, analytics or form-storage endpoints. Inactive former billing configuration is retained for future planning only. Form submit buttons stay disabled if local JavaScript fails to load.

## Develop
Edit `site.json` for demo offers / contact details, `scripts/build.py` for content and `public/assets/site.css` for layout. `brand.css` is the unchanged Manager token snapshot. Run:

```sh
python scripts/build.py
python scripts/check_site.py
node --check public/assets/site.js
npm install --prefix /tmp/mumatec-demo-qa jsdom@22.1.0 --ignore-scripts --no-audit --no-fund
NODE_PATH=/tmp/mumatec-demo-qa/node_modules node scripts/test_demo.cjs
```

The test dependency is outside the website. The deployed site has no package or server requirement; generated pages are committed. Vercel serves `public/` with clean URLs. Apache supports the same folder and provided redirects. This is a review demo; do not upload it over live billing.

Batch substantial changes before pushing. The existing Git integration triggers Vercel on pushes; do not deploy every edit or redeploy unchanged code. Update review results in the PR without another code push.

## Provenance
The existing Mumatec homepage, retrieved on 8 October 2026, publishes monthly R59 / R79 / R120 and annual R638 / R854 / R1 296, for 15 / 30 / 60 GB and 2 / 3 / 5 websites. Paid website offers are R2 599 and R3 699. The user approved those prices as the demo baseline. Preserve the actual annual amounts and calculate savings from them; do not repeat the old rounded 10% claim. Start-Up 15 / 30 / 60 are clarified review labels, not verified WHMCS product IDs. Domain prices are examples from the indexed catalogue; it disagrees with the old homepage on some prices, so approval and live verification are required.

Manager colours and original PNG come from `ramanugut/MumatecManager`, tree `d9f538fa6e2f53a2c05e53e9c0157db8c310566e`. The user requested a text wordmark in Montserrat; its two-line navy / cyan identity is preserved. The local 12 KB Google Fonts subset includes the SIL Open Font License. The original PNG remains for reference and the favicon. The server sculpture and workspace are original generated illustrations, not Mumatec facilities or customer projects. Manager and the client repository are unchanged by this update.

## After approval
Confirm actual products, prices, tax treatment, domain renewals, dedicated email / SSL offers, legal policies and business details. Then connect the approved service / account / enquiry / checkout workflows in staging. Resolve the PHP billing hostname before a root-domain move. See `LAUNCH_CHECKLIST.md` and `UX-CONTRACT.md`.
