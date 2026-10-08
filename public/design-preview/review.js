const screen=document.querySelector('#screen');
const viewport=document.querySelector('#viewport');
const frame=document.querySelector('#product-preview');
screen.addEventListener('change',()=>{frame.src=screen.value;});
viewport.addEventListener('change',()=>{frame.style.width=viewport.value+'px';});
