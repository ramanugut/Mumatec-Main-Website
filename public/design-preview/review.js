const screen=document.querySelector('#screen');
const viewport=document.querySelector('#viewport');
const frame=document.querySelector('#product-preview');
const textSize=document.querySelector('#text-size');
function updateScreen(){
  const url=new URL(screen.value,window.location.origin);
  if(textSize.value==='200') url.searchParams.set('review-text','200');
  frame.src=url.pathname+url.search;
}
screen.addEventListener('change',updateScreen);
textSize.addEventListener('change',updateScreen);
viewport.addEventListener('change',()=>{frame.style.width=viewport.value+'px';});
