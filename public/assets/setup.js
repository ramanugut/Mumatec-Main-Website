/* Guided setup: local decisions only. No network, orders, credentials or payments. */
(() => {
  const shell = document.querySelector('[data-setup]');
  if (!shell) return;
  const form = shell.querySelector('[data-setup-form]');
  const catalogue = JSON.parse(document.querySelector('#service-catalogue').textContent);
  const money = window.Mumatec.formatMoney;
  const key = 'mumatec-setup-v1';
  const defaults = () => ({cycle:'monthly', extension:'co.za', ssl:'check', domainAction:'keep'});
  const webGoals = ['start','move','design'];
  const names = {goal:'Your goal',website:'Website',hosting:'Hosting',capacity:'Space',package:'Package',domain:'Domain',email:'Email',ssl:'SSL',review:'Review'};
  const labels = {start:'Get my business online',move:'Move my website',design:'Have a website built',email:'Set up business email',domain:'Get a domain name',ssl:'Check SSL for my website'};
  let state = defaults();
  let current = 'goal';
  try {
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (saved?.version === 1 && saved.answers && typeof saved.answers === 'object') {
      for (const [name,value] of Object.entries(saved.answers)) {
        if (name === 'domain') { if (typeof value === 'string' && value.length <= 253) state.domain=value; continue; }
        const controls = [...form.querySelectorAll('[name="'+name.replace(/[^a-zA-Z]/g,'')+'"]')];
        if (typeof value === 'string' && controls.some(control => control.tagName === 'SELECT' ? [...control.options].some(o => o.value===value) : control.value===value)) state[name]=value;
      }
      if (typeof saved.current==='string') current=saved.current;
    }
  } catch (_) { /* Storage may be unavailable; the guide still works. */ }
  const initialGoal = new URLSearchParams(location.search).get('goal');
  if (Object.hasOwn(labels,initialGoal) && state.goal !== initialGoal) { state={...defaults(),goal:initialGoal}; current='goal'; }
  if (state.goal==='ssl' && !state.domainNeed) state.domainNeed='existing';
  const save = () => { try { sessionStorage.setItem(key,JSON.stringify({version:1,answers:state,current})); } catch (_) {} };
  const hasWebsite = () => webGoals.includes(state.goal);
  const hostRelevant = () => hasWebsite() || state.goal==='email';
  const standardCapacity = () => state.sites!=='6+' && state.storage!=='over';
  const recommended = () => {
    if (!standardCapacity() || !state.sites || !state.storage) return null;
    const requiredStorage = state.storage==='unsure' ? 0 : Number(state.storage);
    return catalogue.hosting.find(plan => plan.websites >= Number(state.sites) && plan.storage >= requiredStorage) || null;
  };
  const selectedPlan = () => hostRelevant() && state.hosting==='mumatec' && standardCapacity() ? catalogue.hosting.find(p=>p.id===state.plan) : null;
  const selectedDesign = () => hasWebsite() && state.website==='build' ? catalogue.design.find(p=>p.id===state.design) : null;
  const steps = () => {
    const list=['goal'];
    if (hasWebsite()) list.push('website');
    if (hostRelevant()) list.push('hosting');
    if (hostRelevant() && state.hosting==='mumatec') { list.push('capacity'); if (standardCapacity()) list.push('package'); }
    if (state.goal) list.push('domain');
    if (hasWebsite()) list.push('email');
    if ((hasWebsite() && state.website!=='later') || state.goal==='ssl') list.push('ssl');
    if (state.goal) list.push('review');
    return list;
  };
  const fullDomain = () => {
    const value=(state.domain || '').trim().toLowerCase();
    return state.domainNeed==='new' && value && !value.includes('.') ? value+'.'+state.extension : value;
  };
  const sslLabels={check:'Check existing coverage first',single:'One website · confirm coverage',wildcard:'Subdomains · confirm wildcard coverage',multi:'Different domains · confirm coverage',existing:'Keep managed SSL coverage'};
  const buildItems = () => {
    const items=[];
    if (hasWebsite() && state.website) {
      const design=selectedDesign();
      const value=design ? design.name : state.website==='build' ? (state.design==='custom'?'Custom website / online shop':'Website package to choose') : {existing:'Keep my existing website',self:'I’ll build my website',later:'Decide on a website later'}[state.website];
      items.push({title:'Website',value,edit:'website',detail:design?`${design.pages} pages · 50% deposit; full package price below. Hosting and maintenance are separate.`:state.design==='custom'&&state.website==='build'?'Scope and price by quote.':'',amount:design?.price,term:design?'once':null});
    }
    if (hostRelevant() && state.hosting) {
      const plan=selectedPlan();
      const value=plan ? `${plan.name} · ${plan.storage} GB` : state.hosting==='existing'?'Keep current hosting':state.hosting==='quote'?'Discuss hosting / email requirements':'Hosting beyond these packages · quote needed';
      items.push({title:'Hosting',value,edit:'hosting',detail:plan?`${plan.websites} websites · storage shared with email. ${state.storage==='unsure'?'Storage still needs confirmation.':''}`:state.hosting==='existing'?'No new Mumatec hosting package added.':'A suitable service and price need confirmation.',amount:plan?.[state.cycle],term:plan?(state.cycle==='yearly'?'year':'month'):null});
    }
    if (state.domainNeed) {
      const extension=catalogue.domains.find(d=>d.extension===state.extension);
      const isNew=state.domainNeed==='new';
      items.push({title:'Domain',value:state.domainNeed==='later'?'Choose my domain later':fullDomain() || 'Domain name to choose',edit:'domain',detail:isNew?'New registration · availability and current price to confirm.':state.domainNeed==='existing'?(state.domainAction==='transfer'?'Request a transfer · eligibility, fees and timing to confirm.':'Keep my registrar; plan the DNS connection. No new registration added.'):'No registration is included yet.',amount:isNew?extension?.price:undefined,term:isNew?'year':null});
    }
    const email = state.goal==='email'?'yes':hasWebsite()?state.email:null;
    if (email) items.push({title:'Email',value:{yes:'Set up email on my business domain',existing:'Keep my current email provider',no:'No email setup for now'}[email],edit:state.goal==='email'?'hosting':'email',detail:email==='yes'?(selectedPlan()?'Email accounts included; mailbox files use the shared hosting storage.': 'Email setup and any separate service need a quote.'):email==='existing'?'Plan DNS settings around the current provider.':''});
    if ((hasWebsite()&&state.website!=='later')||state.goal==='ssl') items.push({title:'SSL / HTTPS',value:sslLabels[state.ssl]||sslLabels.check,edit:'ssl',detail:state.ssl==='existing'?'Confirm the certificate still covers the setup.':'Check current certificates before adding anything. A new certificate, if needed, requires a price and renewal quote.'});
    return items;
  };
  function element(tag,cls,text) { const el=document.createElement(tag); if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el; }
  function costs(items) {
    const node=element('div','setup-costs');node.append(element('h3','', 'Known costs'));
    const groups=[['month','Hosting each month',' / month'],['year','Annual services',' / year'],['once','Website design',' once-off']];
    let known=false;
    for(const [term,label,suffix] of groups) { const relevant=items.filter(i=>i.term===term&&typeof i.amount==='number');if(!relevant.length)continue;known=true;const row=element('div','setup-cost-line');row.append(element('span','',label),element('strong','',money(relevant.reduce((n,i)=>n+i.amount,0))+suffix));node.append(row); }
    node.append(element('p','input-help',known?'Full annual charges and the full website package price are shown. Quotes and unconfirmed costs are excluded.':'No fixed-price service selected yet. We’ll confirm any required quote.'));
    return node;
  }
  function renderSummary() {
    const items=buildItems();
    const snapshot=shell.querySelector('[data-setup-snapshot]');snapshot.replaceChildren();
    if(!state.goal) { snapshot.append(element('p','', 'Choose your goal to begin.')); }
    else { snapshot.append(element('p','snapshot-goal',labels[state.goal]));items.forEach(item=>{const row=element('div','snapshot-row');row.append(element('small','',item.title),element('strong','',item.value));snapshot.append(row);});if(items.length)snapshot.append(costs(items)); }
    const review=shell.querySelector('[data-setup-review]');review.replaceChildren();
    items.forEach(item=>{
      const row=element('section','setup-review-item');const top=element('div','review-item-top');top.append(element('h2','',item.title));const edit=element('button','setup-edit','Change');edit.type='button';edit.setAttribute('aria-label','Change '+item.title);edit.addEventListener('click',()=>go(item.edit));top.append(edit);row.append(top,element('strong','review-item-value',item.value));if(item.detail)row.append(element('p','',item.detail));if(typeof item.amount==='number')row.append(element('p','review-price',money(item.amount)+(item.term==='month'?' / month':item.term==='year'?' / year':' once-off')));review.append(row);
    });
    review.append(costs(items));
    const body=['Mumatec setup enquiry','Goal: '+(labels[state.goal]||''),'',...items.flatMap(i=>[i.title+': '+i.value,i.detail,typeof i.amount==='number'?'Guide cost: '+money(i.amount)+' / '+{month:'month',year:'year',once:'once-off'}[i.term]:'']).filter(Boolean),'','Please confirm availability, service scope, taxes, current prices and renewal terms before setup.'].join('\n');
    shell.querySelector('[data-setup-email]').href='mailto:'+catalogue.email+'?subject='+encodeURIComponent('Business setup enquiry')+'&body='+encodeURIComponent(body);
    return body;
  }
  const drawings={
    goal:['<div class="guide-kit"><span>yourbusiness.co.za</span><div><b>Website</b><b>Hosting</b></div><small>hello@yourbusiness.co.za</small></div>','The pieces work together.','Your domain is the address. Hosting stores the files. A website shows your business. SSL protects the connection.'],
    website:['<div class="guide-screen"><div class="guide-screen-bar">yourbusiness.co.za</div><strong>Your business.<br>Your services.</strong><span>Get in touch ↗</span></div>','Website = what customers see.','Your pages explain what you do and make contacting you easy. Website design and hosting are separate services.'],
    hosting:['<div class="guide-server"><div><i></i><b>Website files</b></div><div><i></i><b>Email storage</b></div><div><i></i><b>Available space</b></div></div>','Hosting = where the files live.','Think of it as the space for your website and inboxes. A domain points visitors to that space.'],
    capacity:['<div class="guide-space"><div><b>15</b><span>GB</span></div><div><b>30</b><span>GB</span></div><div><b>60</b><span>GB</span></div></div>','Storage is a shared space.','Website images, files and stored email all use it. The right size depends on what you have and what you keep.'],
    package:['<div class="guide-server"><div><i></i><b>Website space</b></div><div><i></i><b>Email included</b></div><div><i></i><b>Your chosen plan</b></div></div>','Choose enough room.','The recommendation uses your website count and storage answer. More demanding apps or unknown storage still need checking.'],
    domain:['<div class="guide-address"><strong>yourbusiness<span>.co.za</span></strong><i>↓</i><div><b>Your website</b><b>Your email</b></div></div>','Domain = your address online.','One name can be used for your website and email. Owning a domain does not automatically include hosting.'],
    email:['<div class="guide-envelope"><small>FROM YOUR BUSINESS</small><strong>hello@<br>yourbusiness.co.za</strong><span>A professional reply.</span></div>','Email with your business name.','You need a domain and an email service. With Mumatec hosting, accounts are included and share the plan’s storage.'],
    ssl:['<div class="guide-secure"><div class="guide-lock"></div><strong>https://yourbusiness.co.za</strong><div><b>Visitor</b><i>Encrypted connection</i><b>Website</b></div></div>','SSL/TLS = an encrypted connection.','It protects data travelling between visitors and your site. Check current coverage before buying a new certificate.'],
    review:['<div class="guide-kit"><span>Your business setup</span><div><b>Selected services</b><b>Clear costs</b></div><small>Ready for a conversation.</small></div>','Chosen for your needs.','This is a setup enquiry. We confirm availability and unpriced items before any order, payment or service change.']
  };
  function renderExplanation() {
    const [visual,title,text]=drawings[current]||drawings.goal;
    const figure=shell.querySelector('[data-setup-explainer]');figure.replaceChildren();
    const art=element('div','guide-drawing');art.setAttribute('aria-hidden','true');art.innerHTML=visual;const caption=element('figcaption');caption.append(element('h2','',title),element('p','',text));figure.append(art,caption);
  }
  function syncControls() {
    for(const input of form.querySelectorAll('input,select')) { if(input.type==='radio')input.checked=state[input.name]===input.value;else if(Object.hasOwn(state,input.name))input.value=state[input.name]; }
    shell.querySelector('[data-design-options]').hidden=state.website!=='build';
    shell.querySelector('[data-domain-fields]').hidden=!['new','existing'].includes(state.domainNeed);
    shell.querySelector('[data-extension-options]').hidden=state.domainNeed!=='new';
    const transfer=shell.querySelector('[data-domain-action]');if(transfer)transfer.hidden=state.domainNeed!=='existing';
    const recommendation=recommended();
    const info=shell.querySelector('[data-recommendation]');info.textContent=recommendation?`Suggested: ${recommendation.name}. It covers ${state.sites} website${state.sites==='1'?'':'s'}${state.storage==='unsure'?'; storage must still be checked':` and up to ${state.storage} GB`}.`:'A custom hosting quote is needed for these requirements.';
    for(const radio of form.querySelectorAll('[name="plan"]')) { const plan=catalogue.hosting.find(p=>p.id===radio.value);const fits=!!recommendation&&plan.websites>=Number(state.sites)&&plan.storage>=recommendation.storage;radio.disabled=!fits;radio.closest('.setup-choice').classList.toggle('choice-unavailable',!fits);const description=radio.closest('.setup-choice').querySelector('small');description.textContent=`${plan.storage} GB shared storage · ${plan.websites} websites · ${money(plan[state.cycle])}${state.cycle==='yearly'?' / year upfront':' / month'}`+(!fits?' · Below your selected needs':''); }
  }
  function render(focus=false) {
    const list=steps();if(!list.includes(current))current=list[0];const index=list.indexOf(current);
    form.querySelectorAll('[data-step]').forEach(panel=>{panel.hidden=panel.dataset.step!==current;});syncControls();
    shell.querySelector('[data-step-count]').textContent=state.goal?`Step ${index+1} of ${list.length} · ${names[current]}`:'Start with your goal';
    const progress=shell.querySelector('[data-step-progress]');progress.max=state.goal?list.length:9;progress.value=index+1;
    const nav=shell.querySelector('[data-step-nav]');nav.replaceChildren();
    list.forEach((step,i)=>{const node=element(i<=index?'button':'span','setup-step-link',names[step]);if(i<=index){node.type='button';node.addEventListener('click',()=>go(step));}if(i===index)node.setAttribute('aria-current','step');nav.append(node);});
    const back=shell.querySelector('[data-setup-back]');back.disabled=index===0;back.hidden=index===0;
    const prompts={goal:'Start here: choose what you want to do.',website:state.website==='build'?'Choose a website package below.':'Choose whether you need a website built.',hosting:'Choose Mumatec hosting, keep your host, or ask for help.',capacity:'Choose your website count and storage.',package:'Choose your hosting package and billing.',domain:'Choose a new domain, use your own, or decide later.',email:'Choose how you want to handle business email.',ssl:'Choose how to handle HTTPS coverage.',review:'Check your choices, then open your email enquiry.'};
    shell.querySelector('[data-setup-direction] p').textContent=prompts[current];
    const next=shell.querySelector('[data-setup-next]');next.disabled=false;next.hidden=current==='review';next.textContent=list[index+1]==='review'?'Review my setup →':'Continue →';
    shell.querySelector('[data-setup-save]').disabled=false;shell.querySelector('[data-setup-restart]').disabled=false;
    shell.querySelector('[data-setup-explainer]').classList.remove('explainer-arrive');renderExplanation();renderSummary();save();
    if(focus){const heading=form.querySelector('[data-step="'+current+'"] legend');heading.focus({preventScroll:true});const target=innerWidth<=700?shell.querySelector('[data-setup-explainer]'):form;target.scrollIntoView({block:'start',behavior:'auto'});}
  }
  function clearError(){const error=shell.querySelector('#setup-error');error.hidden=true;error.textContent='';form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));}
  function fail(message,name){const error=shell.querySelector('#setup-error');error.textContent=message;error.hidden=false;const target=form.querySelector('[data-step="'+current+'"] [name="'+name+'"]');const panel=form.querySelector('[data-step="'+current+'"]');panel.setAttribute('aria-invalid','true');panel.setAttribute('aria-describedby','setup-error');if(target){target.setAttribute('aria-invalid','true');target.focus();}return false;}
  function validate(step) {
    if(step==='goal'&&!state.goal)return fail('Choose what you’d like to do.','goal');
    if(step==='website'){if(!state.website)return fail('Choose whether you need a website built.','website');if(state.website==='build'&&!state.design)return fail('Choose a website package or a custom quote.','design');}
    if(step==='hosting'&&!state.hosting)return fail('Choose where to host, or ask us to check the requirements.','hosting');
    if(step==='capacity'){if(!state.sites)return fail('Choose how many websites you need to host.','sites');if(!state.storage)return fail('Choose the storage you need, or select “I’m not sure”.','storage');}
    if(step==='package'){const plan=selectedPlan(),recommendedPlan=recommended();if(!plan||!recommendedPlan||plan.websites<Number(state.sites)||plan.storage<recommendedPlan.storage)return fail('Choose a package with enough website slots and storage.','plan');}
    if(step==='domain'){
      if(!state.domainNeed)return fail('Choose a new domain, your existing one, or decide later.','domainNeed');
      if(state.domainNeed!=='later'){
        let domain=(state.domain||'').trim().toLowerCase();
        if(state.domainNeed==='new'&&domain.includes('.')){const ext=catalogue.domains.find(d=>domain.endsWith('.'+d.extension));if(!ext)return fail('Choose .co.za, .com or .org in this guide, or ask us about another ending.','domain');state.extension=ext.extension;}
        domain=fullDomain();if(!window.Mumatec.isValidDomain(domain,true))return fail('Enter a domain such as yourbusiness.co.za, using letters, numbers and hyphens.','domain');
      }
    }
    if(step==='email'&&!state.email)return fail('Choose business email, keep your provider, or leave it for later.','email');
    return true;
  }
  function go(step) { clearError(); current=step;if(current==='package'&&!state.plan){const suggested=recommended();if(suggested)state.plan=suggested.id;}render(true); }
  form.addEventListener('change',event=>{
    const input=event.target;if(!input.name)return;clearError();
    if(input.name==='goal'&&state.goal!==input.value){state={...defaults(),goal:input.value};if(input.value==='ssl')state.domainNeed='existing';}
    else state[input.name]=input.value;
    if(input.name==='website'&&input.value!=='build')delete state.design;
    if(['sites','storage'].includes(input.name)){const plan=selectedPlan(),minimum=recommended();if(!minimum||!plan||plan.websites<Number(state.sites)||plan.storage<minimum.storage)delete state.plan;}
    render();
  });
  form.addEventListener('input',event=>{if(event.target.name==='domain'){state.domain=event.target.value;clearError();renderSummary();save();}});
  form.addEventListener('submit',event=>{event.preventDefault();clearError();if(current==='review')return;if(!validate(current))return;const list=steps();go(list[list.indexOf(current)+1]);});
  shell.querySelector('[data-setup-back]').addEventListener('click',()=>{const list=steps();go(list[Math.max(0,list.indexOf(current)-1)]);});
  shell.querySelector('[data-setup-restart]').addEventListener('click',()=>{state=defaults();current='goal';form.reset();clearError();render(true);});
  shell.querySelector('[data-setup-save]').addEventListener('click',()=>{
    const text=renderSummary();const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const link=element('a');link.href=url;link.download='Mumatec-My-Setup.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  // A restored review must still have all its prerequisite answers.
  if(current==='review'){const previous=current;for(const step of steps().filter(s=>s!=='review')){current=step;if(!validate(step)){clearError();break;}current=previous;}}
  shell.hidden=false;render();
})();
