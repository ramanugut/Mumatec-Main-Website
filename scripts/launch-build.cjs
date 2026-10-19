/* Mumatec public launch transformation. No third-party dependencies. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'public');
const bill = "https://mumatechosting.co.za/billing/";
const seo = new Set(['index.html','hosting.html','domains.html','websites.html','email.html','ssl.html','about.html','contact.html','support.html','policies.html']);
const journeys = `<section class="quick-journeys" aria-label="Choose a Mumatec service"><div class="wrap quick-journeys-inner">
<a class="quick-journey" href="hosting.html"><span class="journey-index">01 / WEB HOSTING</span><strong>Get your business online <span aria-hidden="true">↗</span></strong><small>Your website and professional email, together.</small></a>
<a class="quick-journey" href="websites.html"><span class="journey-index">02 / WEBSITES</span><strong>Show your business beautifully <span aria-hidden="true">↗</span></strong><small>A mobile-friendly site built for real enquiries.</small></a>
<a class="quick-journey" href="setup.html"><span class="journey-index">03 / GUIDED START</span><strong>Not sure what you need? <span aria-hidden="true">↗</span></strong><small>We help you choose without the jargon.</small></a>
</div></section>`;
let changed=0;
for(const name of fs.readdirSync(root).filter(x=>x.endsWith('.html'))){
 const loc=path.join(root,name); let html=fs.readFileSync(loc,'utf8');
 if(name!=='404.html'){
   html=html.replace('<meta name="robots" content="noindex, nofollow">', `<meta name="robots" content="${seo.has(name)?'index, follow':'noindex, nofollow'}">`);
   if(!html.includes('launch-polish.css')){
     html=html.replace(/(<link rel="stylesheet" href="assets\/site\.css\?v=[^"]+">)/, '$1<link rel="stylesheet" href="assets/launch-polish.css?v=20261019">');
   }
   if(!html.includes('class="header-account"')){
     html=html.replace('<a class="btn btn-primary header-client header-guide" href="setup.html">', `<a class="header-account" href="${bill}clientarea.php">Client login ↗</a><a class="btn btn-primary header-client header-guide" href="setup.html">`);
   }
   if(!html.includes('href="'+bill+'clientarea.php">Client login ↗</a><a class="mobile-contact"')){
     html=html.replace('<a class="mobile-contact" href="contact.html">Talk to us</a>', `<a class="mobile-contact" href="${bill}clientarea.php">Client login ↗</a><a class="mobile-contact" href="contact.html">Talk to us</a>`);
   }
 }
 if(name==='index.html'&&!html.includes('quick-journeys')){
   html=html.replace('</section>\n<section class="ai-promo"', '</section>\n'+journeys+'\n<section class="ai-promo"');
   if(!html.includes('quick-journeys'))throw Error('Homepage section missing');
 }
 if(name==='account.html'){
   html=html.replace('Need help with an existing account or service? Contact Mumatec while the new customer portal is being prepared.', 'Manage your invoices and services in the existing secure Mumatec client area. For anything else, we are here to help.');
   html=html.replace('<a class="btn btn-primary" href="mailto:info@mumatechosting.co.za?subject=Account%20support">Email account support</a>', `<a class="btn btn-primary" href="${bill}clientarea.php">Open my account ↗</a><a class="btn" href="mailto:info@mumatechosting.co.za?subject=Account%20support">Email support</a>`);
 }
 if(name==='checkout.html'){
   html=html.replace('<h2>Ready for the next step?</h2><p>Mumatec will confirm domain availability, the current total and renewal terms before any service is set up.</p><a class="btn btn-primary" data-request-link>Ask Mumatec about this setup <span aria-hidden="true">↗</span></a><p class="input-help">Your email app opens with the details ready to review.</p>',
   `<h2>Ready to get online?</h2><p>Continue to Mumatec’s existing billing portal to place your order. Choose your plan and domain again there; no payment was taken on this page.</p><div class="actions"><a class="btn btn-primary" data-billing-link href="${bill}">Continue to secure ordering ↗</a><a class="btn" data-request-link>Ask Mumatec a question ↗</a></div><p class="input-help">The billing portal confirms availability and final prices. Questions open a prepared email for you to send.</p>`);
   if(!html.includes('data-billing-link'))throw Error('Checkout handoff missing');
 }
 if(name!=='404.html'&&!html.includes('meta name="robots"'))throw Error('Missing SEO tag: '+name);
 fs.writeFileSync(loc,html);changed++;
}
let code=fs.readFileSync(path.join(root,'assets/site.js'),'utf8');
if(!code.includes('const liveBillingLink')){
 code=code.replace('    review.hidden = false; review.focus();',`    const liveBillingLink = document.querySelector('[data-billing-link]');\n    if (liveBillingLink) liveBillingLink.href = 'https://mumatechosting.co.za/billing/' + (yearly ? 'index.php?rp=/store/hosting-packages-yearly' : 'index.php?rp=/store/hosting-packages-monthly');\n    review.hidden = false; review.focus();`);
 if(!code.includes('const liveBillingLink'))throw Error('Live checkout JS handoff missing');
}
fs.writeFileSync(path.join(root,'assets/site.js'),code);
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://mumatechosting.co.za/sitemap.xml\n');
console.log('Prepared',changed,'Mumatec HTML pages; client-area and checkout handoffs ready.');
