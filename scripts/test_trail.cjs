// Catalogue prices, enquiry routes and multi-page navigation in the supplied design.
const assert=require('node:assert/strict');const fs=require('node:fs');const {JSDOM}=require('jsdom');
const config=JSON.parse(fs.readFileSync('site.json','utf8'));
const dom=new JSDOM(fs.readFileSync('public/index.html','utf8'),{url:'https://preview.example/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.eval(fs.readFileSync('public/assets/site.js','utf8'));
let count=0;const check=v=>{assert.ok(v);count++};
for(const cycle of ['yearly','monthly']){
 const radio=w.document.querySelector(`[name="billing-cycle"][value="${cycle}"]`);radio.checked=true;radio.dispatchEvent(new w.Event('change'));
 const cards=[...w.document.querySelectorAll('[data-plan]')];
 cards.forEach((card,i)=>{
  check(+card.querySelector('[data-plan-price]').textContent.replace(/\D/g,'')===config.hostingPlans[i][cycle]);
  const url=new URL(card.querySelector('[data-plan-link]').href);check(url.searchParams.get('plan')===config.hostingPlans[i].id);check(url.searchParams.get('cycle')===cycle);
 });
}
for(const route of ['hosting','domains','email','websites','ssl','support','about'])check(!!w.document.querySelector(`.site-nav a[href="${route}.html"]`));
for(const id of ['guideBtn','talkBtn','moreAns','launchBtn'])check(w.document.querySelector('#'+id).tagName==='A');
check(w.document.querySelector('#guideBtn').getAttribute('href')==='setup.html');
check(w.document.querySelector('#mailAddr').textContent===config.email);
check(!/Concept page|Concept preview|deployed|Your site is live|STOP 1/.test(w.document.body.textContent));
check(!/__PLAN|__DOMAIN|__TRAIL/.test(w.document.body.innerHTML));
check(w.document.querySelectorAll('#hud').length===1);
dom.window.close();console.log(`${count} trail assertions passed: catalogue billing, full guide, page routes and no concept actions.`);
