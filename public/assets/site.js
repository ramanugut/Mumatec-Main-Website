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
