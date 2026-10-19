// Verify progressive motion and the accessibility preference change path.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync('public/index.html','utf8');
const script = fs.readFileSync('public/assets/site.js','utf8');
let assertions = 0;
function verify(value) { assert.ok(value); assertions++; }
for (const reduce of [true,false]) {
  const dom = new JSDOM(html,{url:'https://preview.example/',runScripts:'outside-only',pretendToBeVisual:true});
  const w = dom.window;
  const changes = {};
  const preferences = {matches:reduce,addEventListener:(type,fn)=>{changes.reduce=fn;}};
  w.matchMedia = query => query.includes('reduced-motion') ? preferences : {matches:true,addEventListener:()=>{}};
  const observed=[];
  const observers=[];
  let disconnected=false;
  w.IntersectionObserver = class {
    constructor(cb,options) { this.callback=cb; this.options=options; this.targets=[]; observers.push(this); }
    observe(el) { observed.push(el); this.targets.push(el); }
    unobserve(el) { el.dataset.observedOnce='true'; }
    disconnect() { disconnected=true; }
  };
  w.document.querySelectorAll('.section-heading,.foundation-visual,.foundation-detail,.home-service-cards,.local-card,.portfolio-grid').forEach(el=>{
    el.getBoundingClientRect=()=>({top:2000});
  });
  w.eval(script);
  if (reduce) {
    verify(w.document.querySelectorAll('.reveal-ready').length===0);
    verify(observed.length===0);
  } else {
    verify(observed.length>0);
    const reveals=observers.find(item=>item.options.threshold===.08);
    const journey=observers.find(item=>item.options.threshold===0);
    reveals.callback([{target:reveals.targets[0],isIntersecting:true}]);
    verify(reveals.targets[0].classList.contains('is-visible'));
    verify(reveals.targets[0].dataset.observedOnce==='true');
    const email=w.document.querySelector('[data-stage="email"]');
    journey.callback([{target:email,isIntersecting:true}]);
    verify(w.document.querySelector('[data-journey]').dataset.activeStage==='email');
    verify(email.classList.contains('is-current'));
    preferences.matches=true; changes.reduce();
    verify(disconnected);
    verify(w.document.querySelectorAll('.reveal-ready').length===0);
    verify(w.document.querySelector('[data-tilt]').style.getPropertyValue('--tilt-x')==='');
    verify(!w.document.querySelector('[data-journey]').dataset.activeStage);
  }
  dom.window.close();
}
// No observer means all content remains visible, even on a motion-capable browser.
const dom = new JSDOM(html,{url:'https://preview.example/',runScripts:'outside-only'});
dom.window.matchMedia=()=>({matches:false});
dom.window.eval(script);
verify(dom.window.document.querySelectorAll('.reveal-ready').length===0);
verify(dom.window.document.querySelector('.hero').textContent.includes('R59'));
dom.window.close();
console.log(`${assertions} motion assertions passed: reduced motion, reveal completion, preference changes and safe fallback.`);
