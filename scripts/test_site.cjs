const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '../public');
const script = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
let checks = 0;
function page(file, query = '') {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), {
    url: 'https://preview.example/' + file + query, runScripts: 'outside-only', pretendToBeVisual: true
  });
  dom.window.fetch = () => { throw Error('The public review must not fetch live data'); };
  dom.window.XMLHttpRequest = class { constructor() { throw Error('The public review must not contact an API'); } };
  dom.window.eval(script);
  return dom.window;
}
const check = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
const truth = value => { assert.ok(value); checks++; };
const fire = (win, node, event) => node.dispatchEvent(new win.Event(event, { bubbles: true, cancelable: true }));

let win = page('hosting.html');
let doc = win.document;
check(Array.from(doc.querySelectorAll('[data-plan-price]'), node => node.textContent), ['59','79','120']);
let yearly = doc.querySelector('[name="billing-cycle"][value="yearly"]');
yearly.checked = true; fire(win, yearly, 'change');
check(Array.from(doc.querySelectorAll('[data-plan-price]'), node => node.textContent.replace(/[^0-9]/g,'')), ['638','854','1296']);
check(Array.from(doc.querySelectorAll('[data-plan-link]'), node => new URL(node.href).searchParams.get('cycle')), ['yearly','yearly','yearly']);
check(doc.querySelector('[data-plan-period]').textContent, '/ year');
let monthly = doc.querySelector('[name="billing-cycle"][value="monthly"]');
monthly.checked = true; fire(win, monthly, 'change');
check(doc.querySelector('[data-plan-price]').textContent, '59');
win.close();

win = page('hosting.html', '?cycle=yearly'); doc = win.document;
check(doc.querySelector('[name="billing-cycle"][value="yearly"]').checked, true);
check(doc.querySelector('[data-plan-price]').textContent, '638'); win.close();

win = page('index.html'); doc = win.document;
const domainForm = doc.querySelector('.domain-form');
let input = domainForm.querySelector('[name="query"]');
check(fire(win, domainForm, 'submit'), false);
check(input.getAttribute('aria-invalid'), 'true');
input.value = 'My-Business.co.za'; fire(win,input,'input');
check(fire(win,domainForm,'submit'), true); check(input.value, 'my-business.co.za');
input.value = 'https://bad.co.za'; check(fire(win,domainForm,'submit'), false);
domainForm.querySelector('.clear-search').click();
check(input.value,''); check(input.hasAttribute('aria-invalid'),false);
const toggle = doc.querySelector('.menu-toggle'); toggle.click();
check(toggle.getAttribute('aria-expanded'),'true');
doc.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
check(toggle.getAttribute('aria-expanded'),'false'); win.close();

win = page('domain-search.html','?query=acme.co.za'); doc = win.document;
check(Array.from(doc.querySelectorAll('.domain-result h2'), node => node.textContent), ['acme.co.za','acme.com','acme.org']);
check(doc.querySelectorAll('.domain-result p').length, 0);
check(doc.querySelector('[data-domain-notice]').hidden, false);
truth(doc.querySelector('[data-domain-notice]').textContent.includes('confirms availability'));
check(doc.querySelector('.domain-result a').textContent.trim(), 'Ask about this domain ↗');
check(new URL(doc.querySelector('.domain-result a').href).searchParams.get('domain'), 'acme.co.za');
check(new URL(doc.querySelector('.domain-result a').href).searchParams.get('plan'), 'domain-only'); win.close();
win = page('domain-search.html'); doc = win.document;
check(doc.querySelector('[data-domain-notice]').hidden, true);
check(doc.querySelectorAll('.domain-result').length, 0); win.close();
win = page('domain-search.html','?query=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E'); doc=win.document;
check(doc.querySelectorAll('.domain-result').length, 0); check(doc.querySelectorAll('img').length, 0); win.close();
win = page('domain-search.html','?mode=transfer'); doc=win.document;
check(doc.querySelector('[data-transfer-panel]').hidden,false); check(doc.querySelector('[data-domain-notice]').hidden,true); win.close();

win=page('checkout.html','?plan=start-up-30&cycle=yearly'); doc=win.document;
let form=doc.querySelector('[data-checkout]');
check(form.elements.plan.value,'start-up-30'); check(form.elements.cycle.value,'yearly');
check(doc.querySelector('[data-summary-total]').textContent,'R854');
form.elements['domain-choice'].value='register'; fire(win,form.elements['domain-choice'],'change');
form.elements.domain.value='acme.co.za'; fire(win,form.elements.domain,'input');
check(doc.querySelector('[data-summary-total]').textContent,'R944,50');
form.elements.domain.value='bad domain'; check(fire(win,form,'submit'),false);
check(form.querySelector('.checkout-error').hidden,false);
form.elements.domain.value='acme.co.za'; fire(win,form.elements.domain,'input');
check(fire(win,form,'submit'),false);
check(doc.querySelector('[data-order-review]').hidden,false);
check(doc.activeElement,doc.querySelector('[data-order-review]'));
const requestHref=doc.querySelector('[data-request-link]').href;
truth(requestHref.startsWith('mailto:info@mumatechosting.co.za?subject='));
truth(decodeURIComponent(requestHref).includes('Start-Up 30'));
truth(decodeURIComponent(requestHref).includes('acme.co.za'));
form.elements.cycle.value='monthly'; fire(win,form.elements.cycle,'change');
check(doc.querySelector('[data-summary-total]').textContent,'R169,50');
check(doc.querySelector('[data-order-review]').hidden,true); win.close();

win=page('checkout.html','?plan=domain-only&domain=acme.com&extension=com'); doc=win.document;
form=doc.querySelector('[data-checkout]');
check(form.elements.cycle.disabled,true); check(form.elements['domain-choice'].disabled,true);
check(doc.querySelector('[data-summary-total]').textContent,'R335');
check(doc.querySelector('[data-summary-hosting]').textContent,'Not added');
check(doc.querySelector('[data-summary-domain]').textContent,'R335 / year'); win.close();
win=page('checkout.html','?plan=not-a-product&cycle=bad&extension=bad'); doc=win.document;
check(doc.querySelector('[data-summary-total]').textContent,'R59'); win.close();

win=page('contact.html','?service=domain-transfer'); doc=win.document; form=doc.querySelector('[data-enquiry]');
check(form.elements.service.value,'domain-transfer');
form.elements.name.value='Ada Example'; form.elements.email.value='ada@example.com'; form.elements.message.value='Please help me move acme.co.za.';
check(fire(win,form,'submit'),false);
check(form.querySelector('.form-feedback').hidden,false);
const enquiryHref=form.querySelector('[data-enquiry-link]').href;
truth(enquiryHref.startsWith('mailto:info@mumatechosting.co.za?subject='));
truth(decodeURIComponent(enquiryHref).includes('Ada Example'));
truth(decodeURIComponent(enquiryHref).includes('Please help me move acme.co.za.'));
form.reset(); check(form.querySelector('.form-feedback').hidden,true); win.close();

win=page('account.html'); doc=win.document;
check(doc.querySelector('h2').textContent,'Your customer portal is being prepared.');
check(doc.querySelectorAll('input').length,0);
check(doc.querySelectorAll('a[href^="mailto:"]').length,3); win.close();

const publicPages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const visibleCopy = publicPages.map(name => fs.readFileSync(path.join(root,name),'utf8')).join(' ');
truth(!/Mumatec design review|Main website demo|Sample data only|order preview|payment unavailable in preview/i.test(visibleCopy));
truth(!fs.existsSync(path.join(root,'design-preview')));
console.log(checks + ' interaction assertions passed. Public pages do not call live services.');
