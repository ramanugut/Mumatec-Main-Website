// Service pages progressively reveal content and respect live preference changes.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('public/hosting.html','utf8');
const script=fs.readFileSync('public/assets/site.js','utf8');
let checks=0;const check=value=>{assert.ok(value);checks++};
for(const reduce of [true,false]){
 const dom=new JSDOM(html,{url:'https://preview.example/hosting',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,changes={},observers=[];
 const preference={matches:reduce,addEventListener:(type,fn)=>changes.reduce=fn};
 w.matchMedia=q=>q.includes('reduced-motion')?preference:{matches:true,addEventListener:()=>{}};
 let disconnected=false;
 w.IntersectionObserver=class{
  constructor(cb,options){this.cb=cb;this.options=options;this.targets=[];observers.push(this);}
  observe(el){this.targets.push(el);}
  unobserve(el){el.dataset.revealed='true';}
  disconnect(){disconnected=true;}
 };
 w.document.querySelectorAll('.section-heading,.cards .card,.steps').forEach(el=>el.getBoundingClientRect=()=>({top:2000}));
 w.eval(script);
 if(reduce){check(w.document.querySelectorAll('.reveal-ready').length===0);check(observers.length===0);}
 else{
  const observer=observers.find(o=>o.options.threshold===.08);check(observer.targets.length>0);
  const target=observer.targets[0];observer.cb([{target,isIntersecting:true}]);
  check(target.classList.contains('is-visible'));check(target.dataset.revealed==='true');
  preference.matches=true;changes.reduce();check(disconnected);
  check(w.document.querySelectorAll('.reveal-ready').length===0);
  check(w.document.querySelector('[data-tilt]').style.getPropertyValue('--tilt-x')==='');
 }
 dom.window.close();
}
const dom=new JSDOM(html,{url:'https://preview.example/',runScripts:'outside-only'});
dom.window.matchMedia=()=>({matches:false});dom.window.eval(script);
check(dom.window.document.querySelectorAll('.reveal-ready').length===0);
check(dom.window.document.querySelector('h1').textContent.includes('A home for your site.'));
dom.window.close();
console.log(`${checks} motion assertions passed: service reveal, reduced motion, preference change and fallback.`);
