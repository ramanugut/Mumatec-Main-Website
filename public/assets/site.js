document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
if(toggle)toggle.disabled=false;
const nav = document.querySelector('#site-nav');
function closeMenu() {
  nav?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}
toggle?.addEventListener('click', () => {
  const opened = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(opened));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
    closeMenu(); toggle.focus();
  }
});
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.querySelectorAll('.domain-form').forEach(form => {
  const input = form.querySelector('[name="query"]');
  const error = form.querySelector('.field-error');
  const clear = form.querySelector('.clear-search');
  if(clear)clear.disabled=false;
  input.addEventListener('input', () => {
    clear.hidden = !input.value; error.textContent = ''; input.removeAttribute('aria-invalid');
  });
  clear.addEventListener('click', () => {
    input.value = ''; clear.hidden = true; error.textContent = ''; input.removeAttribute('aria-invalid'); input.focus();
  });
  form.addEventListener('submit', event => {
    const value = input.value.trim().toLowerCase();
    const labels = value.split('.');
    const valid = value.length > 0 && value.length <= 253 && labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
    if (!valid) {
      event.preventDefault();
      error.textContent = 'Enter a name such as yourbusiness.co.za. Use letters, numbers and hyphens.';
      input.setAttribute('aria-invalid', 'true'); input.focus(); return;
    }
    input.value = value;
  });
});
document.querySelectorAll('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

const catalogue = JSON.parse(document.querySelector('#service-catalogue')?.textContent || '{"hosting":[],"domains":[]}');
const parameters = new URLSearchParams(window.location.search);
const formatMoney = value => 'R' + Number(value).toLocaleString('en-ZA', {minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2, maximumFractionDigits: 2});
function isValidDomain(value,requireEnding=false) {
  const labels=value.split('.');
  return value.length>0&&value.length<=253&&(!requireEnding||labels.length>=2)&&labels.every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
}
window.Mumatec = {formatMoney,isValidDomain};
function updateBilling(cycle) {
  document.querySelectorAll('.plan-card[data-plan]').forEach(card => {
    const plan = catalogue.hosting.find(item => item.id === card.dataset.plan);
    if (!plan) return;
    const yearly = cycle === 'yearly';
    card.querySelector('[data-plan-price]').textContent = Number(plan[cycle]).toLocaleString('en-ZA');
    card.querySelector('[data-plan-period]').textContent = yearly ? '/ year' : '/ month';
    card.querySelector('[data-plan-charge]').textContent = yearly ? 'Full annual payment, paid upfront.' : 'Billed monthly.';
    card.querySelector('[data-plan-saving]').textContent = (yearly ? 'Save' : 'Annual option: save') + ' ' + formatMoney(plan.monthly * 12 - plan.yearly) + ' over 12 monthly payments.';
    card.querySelector('[data-plan-link]').href = 'checkout.html?plan=' + encodeURIComponent(plan.id) + '&cycle=' + cycle;
  });
  const feedback = document.querySelector('[data-billing-feedback]');
  if (feedback) feedback.textContent = cycle === 'yearly' ? 'Annual prices displayed. The full year is paid upfront.' : 'Monthly prices displayed.';
}
const billingRadios = document.querySelectorAll('[name="billing-cycle"]');
billingRadios.forEach(radio => radio.addEventListener('change', () => updateBilling(radio.value)));
if (parameters.get('cycle') === 'yearly') {
  billingRadios.forEach(radio => { radio.checked = radio.value === 'yearly'; });
  updateBilling('yearly');
}

const domainResults = document.querySelector('[data-domain-results]');
if (domainResults) {
  const query = (parameters.get('query') || '').trim().toLowerCase();
  const searchInput = document.querySelector('.domain-form [name="query"]');
  const valid = query.length > 0 && query.length <= 253 && query.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
  const transfer = parameters.get('mode') === 'transfer';
  const transferPanel = document.querySelector('[data-transfer-panel]');
  if (transferPanel) transferPanel.hidden = !transfer;
  if (query) {
    searchInput.value = query;
    document.querySelector('.clear-search').hidden = false;
  }
  if (valid && !transfer) {
    document.querySelector('[data-domain-notice]').hidden = false;
    let name = query;
    const matching = catalogue.domains.find(item => query.endsWith('.' + item.extension));
    if (matching) name = query.slice(0, -(matching.extension.length + 1));
    else if (query.includes('.')) name = query.slice(0, query.lastIndexOf('.'));
    const make = (tag, className, content) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (content) element.textContent = content;
      return element;
    };
    catalogue.domains.forEach(example => {
      const domain = name + '.' + example.extension;
      const row = make('article', 'domain-result');
      const identity = make('div');
      identity.append(make('h2', '', domain));
      const price = make('div', 'domain-result-price');
      price.append(make('strong', '', formatMoney(example.price)), make('span', '', 'per year · guide'));
      const link = make('a', 'btn btn-primary', 'Ask about this domain ↗');
      link.href = 'checkout.html?domain=' + encodeURIComponent(domain) + '&extension=' + encodeURIComponent(example.extension);
      row.append(identity, price, link);
      domainResults.append(row);
    });
  } else if (query && !transfer) {
    document.querySelector('.field-error').textContent = 'Enter a business name using letters, numbers and hyphens.';
    searchInput.setAttribute('aria-invalid', 'true');
  }
}

const checkoutForm = document.querySelector('[data-checkout]');
if (checkoutForm) {
  checkoutForm.querySelector('[type="submit"]').disabled = false;
  const planField = checkoutForm.elements.plan;
  const cycleField = checkoutForm.elements.cycle;
  const domainChoice = checkoutForm.elements['domain-choice'];
  const domainField = checkoutForm.elements.domain;
  const extensionField = checkoutForm.elements.extension;
  const review = document.querySelector('[data-order-review]');
  const error = checkoutForm.querySelector('.checkout-error');
  const knownPlan = catalogue.hosting.find(item => item.id === parameters.get('plan'));
  if (knownPlan) planField.value = parameters.get('plan');
  if (parameters.get('cycle') === 'yearly') cycleField.value = 'yearly';
  if (parameters.get('domain')) {
    domainField.value = parameters.get('domain').slice(0, 253);
    domainChoice.value = 'register';
  }
  if (catalogue.domains.some(item => item.extension === parameters.get('extension'))) extensionField.value = parameters.get('extension');
  function refreshSummary() {
    const stages=document.querySelectorAll('.checkout-steps li');
    stages[0]?.classList.remove('is-complete');stages[0]?.setAttribute('aria-current','step');stages[1]?.classList.remove('active');stages[1]?.removeAttribute('aria-current');
    if(!planField.value){
      checkoutForm.querySelector('.checkout-next').hidden=true;
      checkoutForm.querySelector('[data-checkout-billing]').hidden=true;
      checkoutForm.querySelector('[data-checkout-domain-step]').hidden=true;
      const direction=checkoutForm.querySelector('[data-plan-direction]');direction.classList.remove('checkout-plan-confirmed');direction.textContent='Select a service above to unlock the next choices.';
      document.querySelector('[data-summary-package]').textContent='Choose your service first';
      document.querySelector('[data-summary-storage]').textContent='Choose hosting and connect your domain';
      document.querySelector('[data-summary-cycle]').textContent='';
      document.querySelector('[data-summary-hosting]').textContent='Not selected';
      document.querySelector('[data-summary-domain]').textContent='Not selected';
      document.querySelector('[data-summary-total]').textContent='—';
      document.querySelector('[data-summary-renewal]').textContent='Your price guide appears after you choose a service.';
      review.hidden=true;error.hidden=true;return;
    }
    checkoutForm.querySelector('[data-checkout-domain-step]').hidden=false;
    checkoutForm.querySelector('.checkout-next').hidden=false;
    planField.removeAttribute('aria-invalid');
    const domainOnly = false;
    if (domainOnly) { domainChoice.value = 'register'; cycleField.value = 'yearly'; }
    cycleField.disabled = domainOnly;
    domainChoice.disabled = domainOnly;
    const plan = catalogue.hosting.find(item => item.id === planField.value) || catalogue.hosting[0];
    checkoutForm.querySelector('[data-checkout-billing]').hidden=domainOnly;
    checkoutForm.querySelector('[data-domain-step-number]').textContent=domainOnly?'2':'3';
    const direction=checkoutForm.querySelector('[data-plan-direction]');
    direction.classList.add('checkout-plan-confirmed');
    direction.textContent=domainOnly?'✓ Domain only selected. Next: enter the name you want below.':'✓ '+plan.name+' selected. Next: choose hosting billing below.';
    const yearly = cycleField.value === 'yearly';
    const registration = domainChoice.value === 'register';
    const domainName = (domainField?.value || '').trim().toLowerCase();
    const matchingDomain = registration && catalogue.domains.find(item => domainName.endsWith('.' + item.extension));
    if (matchingDomain) extensionField.value = matchingDomain.extension;
    const domainExample = registration ? catalogue.domains.find(item => item.extension === extensionField.value) : null;
    const knownDomainPrice = Boolean(registration && matchingDomain && domainExample && matchingDomain.extension === domainExample.extension);
    const domainPrice = knownDomainPrice ? domainExample.price : 0;
    const hostingPrice = domainOnly ? 0 : plan[cycleField.value];
    document.querySelector('[data-checkout-domain-fields]').hidden = false;
    document.querySelector('[data-checkout-extension-field]').hidden = !registration;
    if (domainField) domainField.required = true;
    document.querySelector('[data-summary-package]').textContent = domainOnly ? 'Domain registration' : plan.name;
    document.querySelector('[data-summary-storage]').textContent = domainOnly ? (domainName || 'Domain name not selected') : plan.storage + ' GB NVMe SSD · ' + plan.websites + ' websites';
    document.querySelector('[data-summary-cycle]').textContent = yearly ? 'Yearly billing · full annual payment' : 'Monthly billing';
    document.querySelector('[data-summary-hosting]').textContent = domainOnly ? 'Not added' : formatMoney(hostingPrice) + (yearly ? ' / year' : ' / month');
    document.querySelector('[data-summary-domain]').textContent = registration ? (knownDomainPrice ? formatMoney(domainPrice) + ' / year' : 'Price confirmed by Mumatec') : domainChoice.value === 'existing' ? 'Use existing domain' : 'Not added';
    document.querySelector('[data-summary-total]').textContent = domainOnly && !knownDomainPrice ? 'Confirm after name' : formatMoney(hostingPrice + domainPrice);
    document.querySelector('.summary-total span').textContent = registration && !knownDomainPrice ? (domainOnly ? 'Domain price on request' : 'Hosting price only') : 'Estimated first term';
    document.querySelector('[data-summary-renewal]').textContent = domainOnly ? 'Domain is billed yearly. Mumatec confirms the renewal price.' : 'Hosting renews ' + (yearly ? 'yearly' : 'monthly') + '. ' + (registration ? (knownDomainPrice ? 'Domain registration is annual; renewal pricing is confirmed before setup.' : 'Domain price is confirmed before setup.') : 'Domain registration is separate.');
    review.hidden = true; error.hidden = true; domainField?.removeAttribute('aria-invalid');
  }
  checkoutForm.addEventListener('input', refreshSummary);
  checkoutForm.addEventListener('change', refreshSummary);
  checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    if(!planField.value){error.textContent='Start with step 1: choose your hosting package.';error.hidden=false;planField.setAttribute('aria-invalid','true');planField.focus();return;}
    planField.removeAttribute('aria-invalid');
    const value = domainField?.value.trim().toLowerCase() || '';
    const valid = isValidDomain(value,true);
    if (true && !valid) {
      error.hidden = false; error.textContent = 'Enter a valid domain name.';
      domainField.setAttribute('aria-invalid', 'true'); domainField.focus(); return;
    }
    const plan = catalogue.hosting.find(item => item.id === planField.value) || catalogue.hosting[0];
    const yearly = cycleField.value === 'yearly';
    const domainOnly = false;
    const selections = [
      domainOnly ? 'Domain registration' : 'Hosting: ' + plan.name + ' · ' + plan.storage + ' GB',
      domainOnly ? 'Billing: yearly' : 'Billing: ' + (yearly ? 'yearly' : 'monthly'),
      'Domain: ' + (domainChoice.value === 'register' ? value : domainChoice.value === 'existing' ? 'Use my existing domain: '+value : 'I will choose later'),
      'Estimated first-term price: ' + document.querySelector('[data-summary-total]').textContent
    ].join('\n');
    const subject = domainOnly ? 'Domain request: ' + value : 'Hosting setup: ' + plan.name;
    const body = 'Hello Mumatec,\n\nI’d like to ask about this setup:\n' + selections + '\n\nPlease confirm availability, the current total and renewal terms before setup.\n\nThank you.';
    document.querySelector('[data-request-link]').href = 'mailto:' + (catalogue.email || 'info@mumatechosting.co.za') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    review.hidden = false; review.focus();
    const stages=document.querySelectorAll('.checkout-steps li');
    stages[0]?.classList.add('is-complete');stages[0]?.removeAttribute('aria-current');stages[1]?.classList.add('active');stages[1]?.setAttribute('aria-current','step');
  });
  refreshSummary();
}

const enquiryForm = document.querySelector('[data-enquiry]');
if (enquiryForm) {
  const submit = enquiryForm.querySelector('[type="submit"]');
  submit.disabled = false;
  enquiryForm.querySelector('[type=reset]').disabled=false;
  const service = parameters.get('service');
  if (Array.from(enquiryForm.elements.service.options).some(option => option.value === service)) enquiryForm.elements.service.value = service;
  const feedback = enquiryForm.querySelector('.form-feedback');
  const emailLink = enquiryForm.querySelector('[data-enquiry-link]');
  const resetPreparedMessage = () => { feedback.hidden = true; emailLink.hidden = true; };
  enquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    enquiryForm.querySelectorAll('[aria-invalid]').forEach(field=>field.removeAttribute('aria-invalid'));
    const invalid=[...enquiryForm.querySelectorAll('[required]')].find(field=>!field.checkValidity()||!field.value.trim());
    if(invalid){invalid.setAttribute('aria-invalid','true');feedback.textContent=invalid.type==='email'?'Enter a valid email address.':'Complete '+enquiryForm.querySelector('label[for="'+invalid.id+'"]').textContent.toLowerCase()+'.';feedback.hidden=false;emailLink.hidden=true;invalid.setAttribute('aria-describedby','enquiry-feedback');feedback.id='enquiry-feedback';invalid.focus();return;}
    const serviceName = enquiryForm.elements.service.selectedOptions[0].textContent;
    const subject = serviceName + ' enquiry from ' + enquiryForm.elements.name.value.trim();
    const body = [
      'Name: ' + enquiryForm.elements.name.value.trim(),
      'Reply to: ' + enquiryForm.elements.email.value.trim(),
      'Service: ' + serviceName,
      '',
      enquiryForm.elements.message.value.trim()
    ].join('\n');
    emailLink.href = 'mailto:' + (catalogue.email || 'info@mumatechosting.co.za') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    emailLink.hidden = false;
    feedback.textContent = 'Your email is ready. Open it to review the details, then choose Send.';
    feedback.hidden = false;
    feedback.focus();
  });
  enquiryForm.addEventListener('input', resetPreparedMessage);
  enquiryForm.addEventListener('change', resetPreparedMessage);
  enquiryForm.addEventListener('reset', resetPreparedMessage);
}

// Progressive visual enhancement: no dependencies, scroll interception or render loop.
(() => {
  if (!window.matchMedia) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  let observer;
  let journeyObserver;
  const journey = document.querySelector('[data-journey]');
  const revealTargets = [...document.querySelectorAll('.section-heading, .foundation-visual, .foundation-detail, .home-service-cards, .local-card, .portfolio-grid, .journey-step, .cards .card, .steps, .service-explain')];
  const art = document.querySelector('[data-tilt]');
  let frame = 0;
  let bounds;
  let pointer;
  const resetTilt = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    bounds = null;
    if (art) {
      art.style.removeProperty('--tilt-x');
      art.style.removeProperty('--tilt-y');
    }
  };
  const configure = () => {
    if (observer) observer.disconnect();
    if (journeyObserver) journeyObserver.disconnect();
    if (journey) {
      delete journey.dataset.activeStage;
      journey.querySelectorAll('.is-current').forEach(el => el.classList.remove('is-current'));
    }
    revealTargets.forEach(el => el.classList.remove('reveal-ready'));
    resetTilt();
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(({target,isIntersecting}) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, {threshold: .08, rootMargin: '0px 0px 30px 0px'});
    if (journey) {
      journeyObserver = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach(({target}) => {
          journey.dataset.activeStage = target.dataset.stage;
          journey.querySelectorAll('[data-stage]').forEach(step => step.classList.toggle('is-current', step === target));
        });
      }, {rootMargin: '-25% 0px -40% 0px', threshold: 0});
      journey.querySelectorAll('[data-stage]').forEach(step => journeyObserver.observe(step));
    }
    revealTargets.forEach(el => {
      // Only offscreen sections reveal. Already visible content is never hidden.
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      observer.observe(el);
      el.classList.add('reveal-ready');
    });
  };
  if (art) {
    art.addEventListener('pointerenter', () => { bounds = art.getBoundingClientRect(); });
    art.addEventListener('pointermove', event => {
      if (reduced.matches || !fine.matches || document.hidden || !bounds) return;
      pointer = {x:event.clientX,y:event.clientY};
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        art.style.setProperty('--tilt-x', `${7-(pointer.y-bounds.top-bounds.height/2)/bounds.height*8}deg`);
        art.style.setProperty('--tilt-y', `${-13+(pointer.x-bounds.left-bounds.width/2)/bounds.width*12}deg`);
      });
    });
    art.addEventListener('pointerleave', resetTilt);
    window.addEventListener('resize', resetTilt, {passive:true});
    window.addEventListener('scroll', resetTilt, {passive:true});
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetTilt(); });
  if (reduced.addEventListener) reduced.addEventListener('change', configure);
  if (fine.addEventListener) fine.addEventListener('change', resetTilt);
  configure();
})();
