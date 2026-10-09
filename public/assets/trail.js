/* Scroll never gets intercepted. Drawing pauses offscreen and in hidden tabs. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (n,a=0,b=1) => Math.min(b,Math.max(a,n));
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const home=document.body.classList.contains('trail-page');
  const page=$('#main'),header=$('.site-header'),hero=$('#stop-1');
  const stage=$('#stage'),rackWrap=$('#rackWrap'),hud=$('#hud');
  const stops=$$('[data-stop]'),reveals=$$('[data-e]');
  const svg=$('#trail'),walk=$('#tWalk'),base=$('#tBase'),marker=$('#tMarker');
  let width=innerWidth,height=innerHeight,tops=[],length=1,samples=[],dots=[],markerScale=1;
  let frame=0,resizeTimer=0,current=-1,heroVisible=false,canvasTimer=0,canvasFrame=0;
  let pointerX=0,pointerY=0,lastCanvas=0;
  const M={$, $$, clamp, RM:preference.matches};window.MX=M;
  const docTop=el=>el.getBoundingClientRect().top+scrollY;
  const revealInfo=reveals.map(el=>({el,ref:el.dataset.ref?$(el.dataset.ref):el,delay:+(el.dataset.d||0),span:+(el.dataset.span||.45),top:0,last:-1}));
  const hudLinks=[];
  if(home)stops.forEach((section,i)=>{
    const a=document.createElement('a');a.href='#'+section.id;a.title=section.dataset.label;
    a.setAttribute('aria-label',section.dataset.label+' — section '+(i+1)+' of '+stops.length);
    $('#hudDots').append(a);hudLinks.push(a);
  });
  function sampleAt(y){
    if(!samples.length)return [0,0,0];
    let lo=0,hi=samples.length-1;
    while(lo<hi){const mid=(lo+hi)>>1;if(samples[mid][2]<y)lo=mid+1;else hi=mid;}
    return samples[lo];
  }
  function buildTrail(){
    if(!svg||!walk.getTotalLength)return;
    const w=page.clientWidth,h=page.offsetHeight;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.style.height=h+'px';
    const gutter=clamp(w*.04,16,48),margin=(w-Math.min(w-2*gutter,1180))/2;
    const lane=margin<34?9:Math.max(12,margin/2),amp=margin<34?2.5:Math.min(32,margin*.3);
    markerScale=margin<60?.6:1;
    const count=Math.max(4,Math.round((h-164)/230));let d='',px=0,py=0;
    for(let i=0;i<=count;i++){
      const y=104+(h-164)*i/count,x=lane+Math.sin(i*1.3)*amp;
      d+=i?` C${px} ${(py+y)/2} ${x} ${(py+y)/2} ${x} ${y}`:`M${x} ${y}`;
      px=x;py=y;
    }
    base.setAttribute('d',d);walk.setAttribute('d',d);length=walk.getTotalLength();
    walk.style.strokeDasharray=length;samples=[];
    for(let i=0;i<240;i++){const n=length*i/239,p=walk.getPointAtLength(n);samples.push([n,p.x,p.y]);}
    $('#tStops').replaceChildren();dots=[];
    stops.forEach(s=>{
      const pt=sampleAt(docTop(s)+60),circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx',pt[1]);circle.setAttribute('cy',pt[2]);circle.setAttribute('r',5*markerScale);
      circle.setAttribute('class','t-stop');$('#tStops').append(circle);dots.push({el:circle,y:pt[2]});
    });
  }
  function measure(){
    width=innerWidth;height=innerHeight;tops=stops.map(docTop);
    revealInfo.forEach(r=>r.top=docTop(r.ref||r.el));
    if(home){buildTrail();M.sizeAll?.();}queue();
  }
  function render(){
    frame=0;if(document.hidden)return;
    const y=scrollY,progress=clamp(y/Math.max(1,document.documentElement.scrollHeight-height));
    header.classList.toggle('is-solid',home?y>Math.min(hero.offsetHeight-90,height*.75):y>40);
    header.style.setProperty('--reading',progress);
    if(!home)return;
    revealInfo.forEach(r=>{
      const k=preference.matches?1:clamp((y+height*.94-r.top)/(height*r.span)-r.delay);
      const e=Math.round((1-(1-k)**3)*500)/500;
      if(e!==r.last){r.el.style.setProperty('--e',e);r.last=e;}
    });
    if(stage)stage.style.setProperty('--p',preference.matches?0:clamp(y/Math.max(1,hero.offsetHeight*.9)));
    if(samples.length){
      const s=sampleAt(y+height*(.2+.6*progress));
      marker.setAttribute('transform',`translate(${s[1]} ${s[2]}) scale(${markerScale})`);
      walk.style.strokeDashoffset=length-s[0];dots.forEach(d=>d.el.classList.toggle('is-passed',d.y<=s[2]));
    }
    let index=0;tops.forEach((t,i)=>{if(t<=y+height*.4)index=i;});
    hud.classList.toggle('is-on',y>160);
    if(index!==current){
      current=index;
      hudLinks.forEach((a,i)=>{a.classList.toggle('is-here',i===index);a.classList.toggle('is-passed',i<index);if(i===index)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
      $('#hudLabel').textContent=stops[index].dataset.label;
      $('#hudKm').textContent='Explore '+(index+1)+' of '+stops.length;
      $('#hudDots').style.setProperty('--hp',index/(stops.length-1));
    }
  }
  function queue(){if(!frame&&!document.hidden)frame=requestAnimationFrame(render);}
  function stopCanvas(){clearTimeout(canvasTimer);cancelAnimationFrame(canvasFrame);canvasTimer=canvasFrame=0;}
  function canvasLoop(t){
    canvasFrame=0;
    if(!home||!heroVisible||preference.matches||document.hidden){stopCanvas();return;}
    if(t-lastCanvas>=32){
      lastCanvas=t;M.skyFrame?.(t,scrollY);
      if(fine.matches){stage.style.setProperty('--mx',pointerX);stage.style.setProperty('--my',pointerY);}
    }
    canvasTimer=setTimeout(()=>{canvasTimer=0;canvasFrame=requestAnimationFrame(canvasLoop);},32);
  }
  function startCanvas(){if(!canvasTimer&&!canvasFrame&&home&&heroVisible&&!document.hidden&&!preference.matches)canvasFrame=requestAnimationFrame(canvasLoop);}
  function configure(){
    M.RM=preference.matches;
    revealInfo.forEach(r=>r.last=-1);
    if(preference.matches){stopCanvas();stage?.style.setProperty('--mx',0);stage?.style.setProperty('--my',0);rackWrap?.style.setProperty('--mx',0);rackWrap?.style.setProperty('--my',0);}
    else startCanvas();queue();
  }
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,140);},{passive:true});
  preference.addEventListener?.('change',configure);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCanvas();else{queue();startCanvas();}});
  if(home&&'IntersectionObserver' in window){
    const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{
      entry.target.toggleAttribute('data-motion-paused',!entry.isIntersecting);
      if(entry.target===hero){heroVisible=entry.isIntersecting;if(heroVisible)startCanvas();else stopCanvas();}
    }),{rootMargin:'60px'});
    stops.forEach(s=>visibility.observe(s));
    const active=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const target=entry.target;
      if(target.classList.contains('feat')){
        $$('.feat').forEach(f=>f.classList.toggle('is-on',f===target));$('#rack').dataset.on=target.dataset.on;
      }
      if(target.classList.contains('step')){
        $$('.step').forEach(s=>s.classList.toggle('is-on',s===target));$('#scene').dataset.step=target.dataset.step;
      }
    }),{rootMargin:'-25% 0px -40% 0px',threshold:0});
    $$('.feat,.step').forEach(el=>active.observe(el));
  }else if(home){heroVisible=true;reveals.forEach(el=>el.style.setProperty('--e',1));}
  if(home){
    $('#sceneUrl').textContent='yourbusiness.co.za';
    hero.addEventListener('pointermove',event=>{
      if(!fine.matches||preference.matches)return;
      const r=hero.getBoundingClientRect();pointerX=((event.clientX-r.left)/r.width-.5)*1.6;pointerY=((event.clientY-r.top)/r.height-.5)*1.3;
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{pointerX=pointerY=0;});
    $$('.plan').forEach(card=>{
      let tiltFrame=0;
      card.addEventListener('pointermove',event=>{
        if(!fine.matches||preference.matches||tiltFrame)return;
        tiltFrame=requestAnimationFrame(()=>{
          tiltFrame=0;const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
          card.style.setProperty('--tx',(x-.5)*2);card.style.setProperty('--ty',(y-.5)*2);
          card.style.setProperty('--gx',x*100+'%');card.style.setProperty('--gy',y*100+'%');
        });
      });
      card.addEventListener('pointerleave',()=>{cancelAnimationFrame(tiltFrame);tiltFrame=0;card.style.setProperty('--tx',0);card.style.setProperty('--ty',0);});
    });
    $('#copyMail').addEventListener('click',async()=>{
      const email=$('#mailAddr').textContent.trim(),toast=$('#toast');
      try{await navigator.clipboard.writeText(email);toast.textContent='Email address copied.';}
      catch{const range=document.createRange();range.selectNodeContents($('#mailAddr'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);toast.textContent='Email selected. Copy it using your device’s copy command.';}
      toast.classList.add('is-on');setTimeout(()=>toast.classList.remove('is-on'),3200);
    });
    if('ResizeObserver' in window)new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,160);}).observe(page);
  }
  document.fonts?.ready.then(measure);addEventListener('load',measure,{once:true});measure();configure();
})();
