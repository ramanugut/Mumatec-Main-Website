const nav=document.querySelector('#preview-nav');
const toggle=document.querySelector('.preview-menu');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
const search=document.querySelector('#records');
search?.addEventListener('input',()=>{
 const rows=[...document.querySelectorAll('tbody tr')];const q=search.value.trim().toLowerCase();let matches=0;
 rows.forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(q);if(!row.hidden)matches++;});
 document.querySelector('#search-result').textContent=`${matches} of ${rows.length} example records`;
 document.querySelector('#empty-result').hidden=matches>0;
});
