/* Lightweight globe adapted from the owner's design. */
(function(){'use strict';var M=window.MX;if(!M)return;var $=M.$,$$=M.$$,clamp=M.clamp,vw=innerWidth;
/* ---------- globe canvas (hero) ---------- */
(function(){
  var cv=$('#sky'),ctx=cv.getContext('2d'),hero=$('#stop-1'),stage=$('#stage');
  var W=0,H=0,dpr=1,cx=0,cy=0,oy=0,R=240,onScreen=true,D=Math.PI/180,dots=[],arcs=[],lines=[];
  var glow=document.createElement('canvas');glow.width=glow.height=48;
  (function(){var g=glow.getContext('2d'),r=g.createRadialGradient(24,24,0,24,24,24);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.3,'rgba(92,201,234,.65)');r.addColorStop(1,'rgba(92,201,234,0)');g.fillStyle=r;g.fillRect(0,0,48,48)})();
  function ll(lat,lon){var a=lat*D,b=lon*D;return [Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)]}
  var cities=[['PRETORIA',-25.7,28.2],['London',51.5,-.1],['New York',40.7,-74],['Sao Paulo',-23.5,-46.6],['Dubai',25.2,55.3],['Lagos',6.5,3.4],['Nairobi',-1.3,36.8],['Singapore',1.35,103.8],['Sydney',-33.9,151.2]].map(function(c){return {n:c[0],v:ll(c[1],c[2])}});
  (function(){
    var N=vw<700?280:580,ga=Math.PI*(3-Math.sqrt(5)),i,k,s;
    for(i=0;i<N;i++){var y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),th=ga*i;dots.push([Math.cos(th)*r,y,Math.sin(th)*r])}
    var a=cities[0].v;
    for(k=1;k<cities.length;k++){
      var b=cities[k].v,dt=a[0]*b[0]+a[1]*b[1]+a[2]*b[2],om=Math.acos(Math.min(1,Math.max(-1,dt))),so=Math.sin(om),pts=[];
      for(s=0;s<=40;s++){
        var t=s/40,f1=Math.sin((1-t)*om)/so,f2=Math.sin(t*om)/so,l=1+.28*Math.sin(Math.PI*t)*Math.min(1,om/1.4);
        pts.push([(f1*a[0]+f2*b[0])*l,(f1*a[1]+f2*b[1])*l,(f1*a[2]+f2*b[2])*l]);
      }
      arcs.push({p:pts,off:k*.13,sp:.00011+k*.00001});
    }
    for(var lat=-60;lat<=60;lat+=30){var row=[];for(var lo=0;lo<=360;lo+=6)row.push(ll(lat,lo));lines.push(row)}
    for(var m=0;m<360;m+=30){var col=[];for(var la=-85;la<=85;la+=5)col.push(ll(la,m));lines.push(col)}
  })();
  var rotB=-28*D,tilt=-.32;
  function proj(v,rot){
    var c=Math.cos(rot),s=Math.sin(rot),x=v[0]*c+v[2]*s,z1=-v[0]*s+v[2]*c,ct=Math.cos(tilt),st=Math.sin(tilt),y=v[1]*ct-z1*st,z=v[1]*st+z1*ct;
    return [cx+x*R,oy-y*R,z];
  }
  function draw(t,sy){
    ctx.clearRect(0,0,W,H);
    var rot=rotB+(M.RM?0:Math.sin(t*.00025)*.55)+sy*.0014,i,j,p,q;
    oy=cy-sy*.12;
    var g=ctx.createRadialGradient(cx-R*.3,oy-R*.35,R*.1,cx,oy,R);
    g.addColorStop(0,'rgba(39,165,205,.30)');g.addColorStop(.7,'rgba(14,79,124,.22)');g.addColorStop(1,'rgba(92,201,234,.18)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,oy,R,0,6.2832);ctx.fill();
    ctx.strokeStyle='rgba(92,201,234,.45)';ctx.lineWidth=1.2;ctx.stroke();
    for(i=0;i<dots.length;i++){p=proj(dots[i],rot);var a=p[2]>0?.2+.65*p[2]:.05,sz=p[2]>0?1.2+p[2]*.9:.8;ctx.fillStyle='rgba(150,220,245,'+a.toFixed(2)+')';ctx.fillRect(p[0]-sz/2,p[1]-sz/2,sz,sz)}
    ctx.strokeStyle='rgba(92,201,234,.16)';ctx.lineWidth=1;ctx.beginPath();
    for(i=0;i<lines.length;i++){var pen=false;for(j=0;j<lines[i].length;j++){p=proj(lines[i][j],rot);if(p[2]>0){if(pen)ctx.lineTo(p[0],p[1]);else{ctx.moveTo(p[0],p[1]);pen=true}}else pen=false}}
    ctx.stroke();
    ctx.lineWidth=1.3;
    for(i=0;i<arcs.length;i++){
      var A=arcs[i],pr=A.p.map(function(v){return proj(v,rot)});
      ctx.strokeStyle='rgba(120,215,245,.7)';ctx.beginPath();var on=false;
      for(j=0;j<pr.length;j++){if(pr[j][2]>-.05){if(on)ctx.lineTo(pr[j][0],pr[j][1]);else{ctx.moveTo(pr[j][0],pr[j][1]);on=true}}else on=false}
      ctx.stroke();
      var u=((t*A.sp)+A.off)%1,f=u*40,k=Math.floor(f),w=f-k,p0=pr[k],p1=pr[Math.min(40,k+1)];
      q=[p0[0]+(p1[0]-p0[0])*w,p0[1]+(p1[1]-p0[1])*w,p0[2]+(p1[2]-p0[2])*w];
      if(q[2]>-.05){ctx.drawImage(glow,q[0]-12,q[1]-12,24,24);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(q[0],q[1],2.1,0,6.2832);ctx.fill()}
    }
    for(i=0;i<cities.length;i++){
      p=proj(cities[i].v,rot);if(p[2]<=.02)continue;
      if(i===0){
        var ph=(t*.0012)%1;ctx.strokeStyle='rgba(255,138,80,'+(1-ph).toFixed(2)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p[0],p[1],7+ph*18,0,6.2832);ctx.stroke();
        ctx.fillStyle='#ff8a50';ctx.beginPath();ctx.arc(p[0],p[1],5,0,6.2832);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.9)';ctx.font='500 11px JetBrains Mono, monospace';ctx.fillText(cities[i].n,p[0]+11,p[1]-9);
      }else{ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p[0],p[1],2.6,0,6.2832);ctx.fill()}
    }
  }
  function size(){
    dpr=Math.min(2,window.devicePixelRatio||1);W=hero.offsetWidth;H=hero.offsetHeight;
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    var hr=hero.getBoundingClientRect(),sr=stage.getBoundingClientRect();
    cx=sr.left-hr.left+sr.width/2;cy=sr.top-hr.top+sr.height/2;
    R=Math.min(Math.max(sr.width,sr.height)*.68,W*.46,360);
    draw(0,window.scrollY||0);
  }
  M.skyFrame=function(t,sy){if(!onScreen||M.RM)return;draw(t,sy)};
  if(window.IntersectionObserver)new IntersectionObserver(function(en){onScreen=en[0].isIntersecting}).observe(hero);

  /* server-rack skyline (launch section) */
  function racks(){
    var c=$('#ridge'),g=c.getContext('2d'),r=Math.min(2,window.devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;
    c.width=Math.round(w*r);c.height=Math.round(h*r);g.setTransform(r,0,0,r,0,0);
    var rw=Math.max(54,Math.min(92,w/12)),n=Math.ceil(w/rw)+1,seed=7;
    function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
    for(var layer=0;layer<2;layer++){
      for(var i=0;i<n;i++){
        var x=i*rw+(layer?0:rw/2)-rw/2,rh=h*(layer?.92:.66)*(.72+rnd()*.28),top=h-rh;
        g.fillStyle=layer?'#061f33':'#0e4f7c';g.fillRect(x,top,rw-6,rh);
        for(var y=top+8;y<h-4;y+=11){
          g.fillStyle=layer?'rgba(92,201,234,.14)':'rgba(255,255,255,.1)';g.fillRect(x+7,y,rw-26,6);
          if(rnd()>.4){g.fillStyle=rnd()>.5?'#3ddc97':'#5cc9ea';g.beginPath();g.arc(x+rw-15,y+3,1.7,0,6.2832);g.fill()}
        }
      }
    }
  }
  M.sizeAll=function(){size();racks()};
  size();racks();
})();


})();
