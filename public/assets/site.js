document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
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

// The demo is intentionally local: no fetches, credentials, persistence or live checkout.
const demoCatalogue = JSON.parse(document.querySelector('#demo-catalogue')?.textContent || '{"hosting":[],"domains":[]}');
const parameters = new URLSearchParams(window.location.search);
if (parameters.get('review-text') === '200') document.documentElement.style.fontSize = '200%';
const formatMoney = value => 'R' + Number(value).toLocaleString('en-ZA', {minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2, maximumFractionDigits: 2});
function updateBilling(cycle) {
  document.querySelectorAll('.plan-card[data-plan]').forEach(card => {
    const plan = demoCatalogue.hosting.find(item => item.id === card.dataset.plan);
    if (!plan) return;
    const yearly = cycle === 'yearly';
    card.querySelector('[data-plan-price]').textContent = Number(plan[cycle]).toLocaleString('en-ZA');
    card.querySelector('[data-plan-period]').textContent = yearly ? '/ year' : '/ month';
    card.querySelector('[data-plan-charge]').textContent = yearly ? 'Full annual payment, paid upfront.' : 'Billed monthly.';
    card.querySelector('[data-plan-saving]').textContent = `${yearly ? 'Save' : 'Annual option: save'} ${formatMoney(plan.monthly * 12 - plan.yearly)} over 12 monthly payments.`;
    card.querySelector('[data-plan-link]').href = `checkout.html?plan=${encodeURIComponent(plan.id)}&cycle=${cycle}`;
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
  document.querySelector('[data-transfer-preview]').hidden = !transfer;
  document.querySelector('[data-domain-empty]').hidden = transfer || valid;
  if (query) {
    searchInput.value = query;
    document.querySelector('.clear-search').hidden = false;
  }
  if (valid && !transfer) {
    let name = query;
    const matching = demoCatalogue.domains.find(item => query.endsWith('.' + item.extension));
    if (matching) name = query.slice(0, -(matching.extension.length + 1));
    else if (query.includes('.')) name = query.slice(0, query.lastIndexOf('.'));
    const make = (tag, className, content) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (content) element.textContent = content;
      return element;
    };
    demoCatalogue.domains.forEach(example => {
      const domain = name + '.' + example.extension;
      const row = make('article', 'domain-result');
      const identity = make('div');
      identity.append(make('h2', '', domain), make('p', '', 'Example result · availability not checked'));
      const price = make('div', 'domain-result-price');
      price.append(make('strong', '', formatMoney(example.price)), make('span', '', '/ year · sample price'));
      const link = make('a', 'btn btn-primary', 'Add to demo order ↗');
      link.href = `checkout.html?plan=domain-only&domain=${encodeURIComponent(domain)}&extension=${encodeURIComponent(example.extension)}`;
      row.append(identity, price, link);
      domainResults.append(row);
    });
  } else if (query && !transfer) {
    document.querySelector('.field-error').textContent = 'Enter a business name using letters, numbers and hyphens.';
    searchInput.setAttribute('aria-invalid', 'true');
  }
}

const checkoutForm = document.querySelector('[data-demo-checkout]');
if (checkoutForm) {
  checkoutForm.querySelector('[type="submit"]').disabled = false;
  const planField = checkoutForm.elements.plan;
  const cycleField = checkoutForm.elements.cycle;
  const domainChoice = checkoutForm.elements['domain-choice'];
  const domainField = checkoutForm.elements.domain;
  const extensionField = checkoutForm.elements.extension;
  const review = document.querySelector('[data-order-review]');
  const error = checkoutForm.querySelector('.checkout-error');
  const knownPlan = demoCatalogue.hosting.find(item => item.id === parameters.get('plan'));
  if (knownPlan || parameters.get('plan') === 'domain-only') planField.value = parameters.get('plan');
  if (parameters.get('cycle') === 'yearly') cycleField.value = 'yearly';
  if (parameters.get('domain')) {
    domainField.value = parameters.get('domain').slice(0,253);
    domainChoice.value = 'register';
  }
  if (demoCatalogue.domains.some(item => item.extension === parameters.get('extension'))) extensionField.value = parameters.get('extension');
  function refreshSummary() {
    const domainOnly = planField.value === 'domain-only';
    if (domainOnly) { domainChoice.value = 'register'; cycleField.value = 'yearly'; }
    cycleField.disabled = domainOnly;
    domainChoice.disabled = domainOnly;
    const plan = demoCatalogue.hosting.find(item => item.id === planField.value) || demoCatalogue.hosting[0];
    const yearly = cycleField.value === 'yearly';
    const registration = domainChoice.value === 'register';
    const domainExample = demoCatalogue.domains.find(item => item.extension === extensionField.value);
    const domainPrice = registration ? domainExample.price : 0;
    const hostingPrice = domainOnly ? 0 : plan[cycleField.value];
    document.querySelector('[data-checkout-domain-fields]').hidden = domainChoice.value === 'later';
    document.querySelector('[data-checkout-extension-field]').hidden = !registration;
    domainField.required = domainChoice.value !== 'later';
    document.querySelector('[data-summary-package]').textContent = domainOnly ? 'Domain registration' : plan.name;
    document.querySelector('[data-summary-storage]').textContent = domainOnly ? '.' + domainExample.extension + ' domain example' : `${plan.storage} GB NVMe SSD · ${plan.websites} websites`;
    document.querySelector('[data-summary-cycle]').textContent = yearly ? 'Yearly billing · full annual payment' : 'Monthly billing';
    document.querySelector('[data-summary-hosting]').textContent = domainOnly ? 'Not added' : formatMoney(hostingPrice) + (yearly ? ' / year' : ' / month');
    document.querySelector('[data-summary-domain]').textContent = registration ? formatMoney(domainPrice) + ' / year' : domainChoice.value === 'existing' ? 'Use existing domain' : 'Not added';
    document.querySelector('[data-summary-total]').textContent = formatMoney(hostingPrice + domainPrice);
    document.querySelector('[data-summary-renewal]').textContent = domainOnly ? 'Sample annual registration. Renewal pricing is not verified.' : `Hosting renews ${yearly ? 'yearly' : 'monthly'}. ${registration ? 'Domain registration is annual; renewal pricing is not verified.' : 'Domain registration is separate.'}`;
    review.hidden = true; error.hidden = true; domainField.removeAttribute('aria-invalid');
  }
  checkoutForm.addEventListener('input', refreshSummary);
  checkoutForm.addEventListener('change', refreshSummary);
  checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = domainField.value.trim().toLowerCase();
    const valid = value.length > 0 && value.length <= 253 && value.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
    if (domainChoice.value !== 'later' && !valid) {
      error.hidden = false; error.textContent = 'Enter a valid domain name for the preview.';
      domainField.setAttribute('aria-invalid', 'true'); domainField.focus(); return;
    }
    review.hidden = false; review.focus();
  });
  refreshSummary();
}

const enquiryForm = document.querySelector('[data-demo-enquiry]');
if (enquiryForm) {
  enquiryForm.querySelector('[type="submit"]').disabled = false;
  const service = parameters.get('service');
  if (Array.from(enquiryForm.elements.service.options).some(option => option.value === service)) enquiryForm.elements.service.value = service;
  const feedback = enquiryForm.querySelector('.form-feedback');
  enquiryForm.addEventListener('submit', event => { event.preventDefault(); feedback.hidden = false; feedback.focus(); });
  enquiryForm.addEventListener('input', () => { feedback.hidden = true; });
  enquiryForm.addEventListener('reset', () => { feedback.hidden = true; });
}

const accountTitle = document.querySelector('[data-account-title]');
if (accountTitle) {
  const views = {
    login: ['Welcome back.', 'Sign-in is disabled while we review the main website design.', 'Sign-in disabled in preview'],
    register: ['Start your next chapter.', 'Account creation will be connected after design approval.', 'Registration disabled in preview'],
    reset: ['Let’s get you back in.', 'Password resets will use the real account system after approval.', 'Reset disabled in preview'],
    support: ['Your support, together.', 'Existing tickets will be available after the client area is connected.', 'Account access disabled in preview']
  };
  const requested = parameters.get('view');
  const view = Object.hasOwn(views, requested) ? requested : 'login';
  accountTitle.textContent = views[view][0];
  document.querySelector('[data-account-description]').textContent = views[view][1];
  document.querySelector('[data-account-button]').textContent = views[view][2];
  document.querySelector('[data-account-password]').hidden = view === 'reset' || view === 'support';
  document.querySelectorAll('[data-account-tab]').forEach(link => {
    if (link.dataset.accountTab === view) link.setAttribute('aria-current', 'page');
  });
}
