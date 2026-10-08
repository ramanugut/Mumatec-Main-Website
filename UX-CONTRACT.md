# Mumatec main website contract

## Scope
Only the main website is under active review; the client-area rebuild is paused. The pages remain static and are not connected to WHMCS, customer accounts, domain availability, payments, ticket creation, analytics or form storage. Email and phone links open the customer's own applications. A contact or setup request is prepared for review; it is sent only if the customer chooses Send in their email app.

## Journeys and boundaries
| Journey | Customer outcome | Clarity / truth boundary |
| --- | --- | --- |
| Hosting | Compare three plans, monthly versus full annual billing, and package limits | Preserve chosen plan and cycle; show the full annual charge; domains and separate services cost extra |
| Domains | Search a business name and compare published extension price guides | Do not claim availability; confirm current price, transfer requirements and renewals before registration |
| Hosting setup | Select a plan, billing cycle and domain, then request the setup | Show an estimated amount; confirm current total, taxes, availability and renewal before setup; no order or payment is created |
| Website design | Compare paid website packages or ask about a custom scope | Confirm pages, content and scope before work; hosting and domains cost extra |
| Email / SSL | Understand possible coverage and request help | Do not invent separate email prices or imply an SSL certificate is included |
| Support | Find common answers and direct contact routes | Do not imply a ticket was filed |
| Contact | Prepare a service enquiry in the customer's email app | Keep details editable in the app; give a send step the customer controls; do not store form input |
| Customer account | Explain account access and provide direct support contact | Portal is not available until the separate client-area work is complete; collect no credentials |

## Layout and accessibility
Main navigation collapses below 900 px. Domain search, pricing and support remain easy to find. Hosting packages stack on narrow phones. Form controls are labelled and at least 44 px tall. Search errors stay by their field. Escape closes the mobile menu and restores focus. Billing and estimate changes are announced to assistive technology; FAQs use native details/summary controls. Respect reduced-motion preferences and avoid horizontal overflow at 320 px.

## Verification
Run static route / asset / anchor / heading checks and interaction assertions before one batched review update. Inspect the deployed normal homepage and customer journeys at desktop and phone widths, check font and image loading, keyboard use and overflow. Report the exact checks performed. Do not infer production readiness or conversion improvement from this review.

## Copy standard
Every visible line must help a customer understand an offer, choose a service, take a next step or avoid a real surprise. Remove interface narration and repeat warnings. Keep any limit next to the decision it affects, and label buttons for the action they open.
