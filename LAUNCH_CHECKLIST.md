# Release checks

## Implemented and checked locally

- Static generation, JavaScript syntax, internal page/assets resolution, single h1/unique IDs, form destination/hidden domain registration parameters, image dimensions/srcsets, shared token parity.
- Original logo embedded locally; no inaccessible private raw-GitHub asset dependency.
- All former static routes have generated pages or explicit redirects. Unknown routes return 404 instead of a fake homepage.
- No invented prices, package limits, review counts, uptime or completed domain-availability checks.

## Must be verified in staging before live cutover

- Real domain search and registration/transfer; hosting monthly/yearly catalogue, email/SSL/design product groups; existing-domain checkout and installed payment gateway return.
- WHMCS billing stays reachable after hosting/DNS changes. PHP cannot run on this static deployment.
- Install client-area theme against the actual WHMCS/Twenty-One version, then run its live acceptance checklist.
- Export and preserve exact current privacy/terms/AUP/refund content, free-website application and existing articles; confirm historical redirects. The old policy link is transitional and must remain reachable until exported.
- Confirm published phone/email and business details. No new business/legal guarantees were added.
- Browser check desktop/mobile/keyboard layouts, 200% text enlargement and slow/error cases. See PR validation for checks actually performed.
- Backups and rollback tested; domain cutover reviewed.
