/* Presentation only. WHMCS owns authentication, submission and table state. */
document.querySelectorAll('input[type="search"], input[name="search"]').forEach(input => {
  if (!input.parentElement || input.dataset.mumatecClear) return;
  input.dataset.mumatecClear = 'true';
  const clear = document.createElement('button');
  clear.type = 'button'; clear.className = 'mumatec-search-clear';
  clear.setAttribute('aria-label', 'Clear search'); clear.textContent = '×';
  clear.hidden = !input.value; input.insertAdjacentElement('afterend', clear);
  input.addEventListener('input', () => { clear.hidden = !input.value; });
  clear.addEventListener('click', () => {
    input.value = ''; clear.hidden = true;
    // Notify both native and WHMCS/jQuery DataTables listeners.
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('keyup', { bubbles: true })); input.focus();
  });
});
