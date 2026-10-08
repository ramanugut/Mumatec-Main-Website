# Main website demo contract

## Scope
Only the main website is under active review; client-area work is paused. No live account, billing, message-submission or payment connection is allowed. No input is persisted. Prices are review values from existing published offers, not a live quote. Call / email links are ordinary device actions.

## Journeys and boundaries
| Journey | Review outcome | Error / truth boundary |
| --- | --- | --- |
| Hosting | Three packages, monthly / full annual billing, local order review | Preserve selection; reject unknown query values; no payment |
| Domains | Empty / sample search, domain-only order preview | Validate input; escape query text; availability is not checked |
| Transfer | Proposed steps and local enquiry | No transfer or ownership check |
| Website design | Two paid offers or custom enquiry | No retired free offer or copied portfolio proof |
| Email / SSL | Service information and local enquiry | No invented dedicated prices / included certificate promise |
| Support | FAQs, enquiry preview, account-entry presentation | No ticket claimed to be sent |
| Contact | Required fields, local feedback, reset | Submit enabled only after local JS loads; nothing sent / saved |
| Account | Sign-in / register / reset presentation | Credential inputs and actions disabled; client rebuild paused |

## Layout and accessibility
Navigation collapses below 900 px. Mobile puts the business decision and domain search before the illustration. Packages stack below 700 px. Controls are labelled and at least 44 px tall. Search errors sit by the field. Escape closes the menu and restores focus. FAQs use native details / summary. Billing changes and totals announce updates; local review completion moves focus to its message. The utility supports 200% text review and embeds same-origin main pages only.

## Verification
Run route / asset / heading / anchor / isolation checks and interaction assertions before a batched push. Then inspect real rendering, font / image loading, keyboard behavior and overflow at 320 / 390 / 768 / 1200 px and 200% text. Record actual results and limitations in the draft PR. Do not infer real-service acceptance or conversion uplift from demo checks.
