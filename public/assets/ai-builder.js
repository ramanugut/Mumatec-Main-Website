(() => {
  const store = 'mumatec-ai-idea';
  const examples = ['A modern website for a Pretoria catering business with menus and quote requests.','A clean website for a plumbing company with emergency services and contact details.','An elegant beauty salon website with treatments and booking enquiries.'];
  const clean = (v,n=300) => String(v==null?'':v).trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,n);
  const esc = v => clean(v,800).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.querySelectorAll('[data-ai-entry]').forEach(form => {
    const input=form.querySelector('textarea');
    form.querySelectorAll('[data-example]').forEach((b,i)=>b.addEventListener('click',()=>{input.value=examples[i];input.focus();}));
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(input.value.trim().length<12){input.focus();input.setCustomValidity('Please describe your website in more detail.');input.reportValidity();input.setCustomValidity('');return;}
      try{sessionStorage.setItem(store,input.value.slice(0,600));}catch(_){}
      location.assign('ai-website.html');
    });
  });
  const app=document.querySelector('#ai-studio');
  if(!app)return;
  const input=app.querySelector('#ai-prompt'),frame=app.querySelector('#ai-frame'),status=app.querySelector('#ai-message');
  const btn=app.querySelector('#ai-create'),save=app.querySelector('#ai-save');
  let output='';
  try{input.value=sessionStorage.getItem(store)||'';sessionStorage.removeItem(store);}catch(_){}
  app.querySelectorAll('[data-example]').forEach((b,i)=>b.addEventListener('click',()=>{input.value=examples[i];input.focus();}));
  const guess=p=>{
    const t=p.toLowerCase();
    let type='Business',words=['Our services','Our work','Get in touch'],col='#105479';
    if(/cater|food|restaurant|coffee|baker/.test(t)){type='Catering';words=['Our menu','Events','Request a quote'];col='#b54b2b';}
    else if(/plumb|electric|repair|construct/.test(t)){type='Home Services';words=['Repairs','Installations','Get a quote'];}
    else if(/salon|beauty|hair|spa/.test(t)){type='Beauty Studio';words=['Treatments','Our team','Book an enquiry'];col='#9b5672';}
    else if(/farm|garden|landscape/.test(t)){type='Outdoor Services';words=['Our work','Our approach','Contact us'];col='#257b66';}
    const m=p.match(/(?:called|named|my business is)\s+([a-z0-9 '&-]{3,50})/i);
    return {name:clean(m?m[1].split(/[,.;]/)[0]:type,60),headline:'Your business. Your next chapter.',description:clean(p,290),services:words,color:col};
  };
  const palette=['#105479','#b54b2b','#257b66','#9b5672','#333e60'];
  const siteHtml=d=>{
    const name=esc(d.name||'Your Business'),head=esc(d.headline||'Welcome'),desc=esc(d.description||'Discover what we do.');
    const colour=palette.includes(d.color)?d.color:palette[0];
    const cards=(Array.isArray(d.services)?d.services:[]).slice(0,4).map((s,i)=>'<article><small>0'+(i+1)+'</small><h3>'+esc(s)+'</h3><p>Discover more about this service.</p></article>').join('');
    return '<!doctype html><html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+name+'</title>'
      +'<style>*{box-sizing:border-box}body{margin:0;font:16px Arial,sans-serif;color:#193448}a{color:inherit}header{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:22px 7%}header strong{font-size:20px}header a{font-size:13px}.hero{color:#fff;background:linear-gradient(120deg,#08283c,'+colour+');padding:85px 7%}h1{font-size:clamp(36px,6vw,72px);line-height:1.06;letter-spacing:-.05em;max-width:650px}p{line-height:1.65}.hero p{font-size:19px;max-width:590px}.button{display:inline-block;background:#fff;color:#12364a;text-decoration:none;border-radius:10px;padding:14px 20px;font-weight:700;margin-top:20px}section:not(.hero){padding:65px 7%}h2{font-size:38px;letter-spacing:-.04em}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}.cards article{padding:26px;background:#f4f8fa;border:1px solid #d8e8ee;border-radius:16px}small{color:'+colour+';font-weight:800}.about{background:#e8f3f8}.contact{background:#08283c;color:#fff}footer{padding:25px 7%;font-size:12px;color:#657987}@media(max-width:550px){header{padding:18px 5%}.hero{padding:55px 5%}section:not(.hero){padding:45px 5%}h2{font-size:29px}}</style></head><body>'
      +'<header><strong>'+name+'</strong><a href="#contact">Contact us →</a></header><main><section class="hero"><p>WELCOME TO '+name+'</p><h1>'+head+'</h1><p>'+desc+'</p><a class="button" href="#services">Explore our services ↓</a></section>'
      +'<section id="services"><h2>How we can help</h2><div class="cards">'+cards+'</div></section><section class="about"><h2>About us</h2><p>'+desc+'</p></section>'
      +'<section class="contact" id="contact"><h2>Get in touch</h2><p>Add your real business contact details before publishing this draft.</p></section></main><footer>Website draft · Check all details before publishing.</footer></body></html>';
  };
  btn.addEventListener('click',async()=>{
    const p=clean(input.value,600);
    if(p.length<12){status.textContent='Please describe your website in at least 12 characters.';input.focus();return;}
    btn.disabled=true;status.textContent='Creating your website draft…';
    let d=guess(p),powered=false;
    try {
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
      let response;
      try{response=await fetch('/api/generate-website',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({description:p}),signal:controller.signal});}finally{clearTimeout(timer);}
      if(response.ok){const data=await response.json();if(data.site){d={...d,...data.site};powered=true;}}
    }catch(_){}
    output=siteHtml(d);frame.srcdoc=output;frame.hidden=false;
    app.querySelector('#ai-empty').hidden=true;app.querySelector('#ai-actions').hidden=false;
    status.textContent=powered?'AI draft generated. Please review the content.':'Starter preview ready. Live AI generation is not connected yet. You can download and edit this preview.';
    btn.disabled=false;
  });
  app.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{frame.classList.toggle('phone',b.dataset.size==='phone');app.querySelectorAll('[data-size]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
  save.addEventListener('click',()=>{
    if(!output)return;
    const url=URL.createObjectURL(new Blob([output],{type:'text/html;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='mumatec-website-draft.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
  });
})();