# Main-site review verification — 8 October 2026

The review surface is the website root. The public design-review wrapper has been removed, and generated pages use customer-facing headings and action labels.

Local verification passes: the static checker validates 17 HTML documents, their routes, assets, anchors, headings, noindex metadata and isolated service links. JavaScript syntax passes. The browser-independent interaction suite passes 61 assertions for monthly/annual pricing, totals, domain-name validation, price-guide results, email-request links, enquiry preparation, account messaging, and keyboard menu behavior. The test uses jsdom and blocks fetch / XHR; it creates no orders, payments, accounts, tickets or sent messages.

The domain page shows a price guide, not live availability. The setup page calculates an estimate and prepares an email request that the customer can review before sending. Account and billing systems are not connected. Visual preference and conversion impact have not been measured.
