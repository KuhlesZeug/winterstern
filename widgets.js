(function(){
'use strict';
const {el,tone,bell,noise,SFX,toast,ac,sparkleAt,starPath,sleep}=window.Z;
const NS='http://www.w3.org/2000/svg';
function sv(t,a,txt){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;return e}
function svgPt(svg,e){const m=svg.getScreenCTM().inverse(),p=svg.createSVGPoint();const q=e.touches?e.touches[0]:e;p.x=q.clientX;p.y=q.clientY;const r=p.matrixTransform(m);return [r.x,r.y]}
const lab=t=>el('div','wlab',t);
function btn(t,cls){const b=el('button','btn '+(cls===undefined?'sm':cls)+' mx',t);return b}

// Rubbelfläche: deckt Inhalt mit Farbe ab, Reiben legt frei
function scratch(host,cover,done,brush){const cv=el('canvas');host.appendChild(cv);const x=cv.getContext('2d');let W,H,cnt=0,fired=false;
 const fill=()=>{const r=host.getBoundingClientRect();W=cv.width=r.width*devicePixelRatio;H=cv.height=r.height*devicePixelRatio;x.globalCompositeOperation='source-over';cover(x,W,H)};
 requestAnimationFrame(fill);let on=false,last=null;
 const rub=e=>{if(!on)return;e.preventDefault();const r=cv.getBoundingClientRect();const q=e.touches?e.touches[0]:e;const px=(q.clientX-r.left)*devicePixelRatio,py=(q.clientY-r.top)*devicePixelRatio;
  x.globalCompositeOperation='destination-out';const R=(brush||26)*devicePixelRatio;const g=x.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;
  const steps=last?Math.ceil(Math.hypot(px-last[0],py-last[1])/(R/3)):1;for(let i=1;i<=steps;i++){const ix=last?last[0]+(px-last[0])*i/steps:px,iy=last?last[1]+(py-last[1])*i/steps:py;x.save();x.translate(ix-px,iy-py);x.beginPath();x.arc(px,py,R,0,7);x.fill();x.restore()}last=[px,py];
  if(++cnt%6===0)noise(.05,3000+Math.random()*2000,1.5,.05);
  if(!fired&&cnt%15===0){const d=x.getImageData(0,0,W,H).data;let c=0,t=0;for(let i=3;i<d.length;i+=64){t++;if(d[i]<60)c++}if(c/t>.62){fired=true;done&&done()}}};
 cv.addEventListener('pointerdown',e=>{ac();on=true;last=null;rub(e)});cv.addEventListener('pointermove',rub);addEventListener('pointerup',()=>{on=false;last=null});cv.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
 return {clear(){x.clearRect(0,0,W,H)},refill(){if(cnt===0)fill()}}}

window.WIDGETS={
 // 1 Zaubertinte
 ink(ctx){const s=el('div','scratch kz-ink');const t=el('div','inktext',ctx.D.w.text);s.appendChild(t);s.appendChild(el('img','kz-quill'));s.lastChild.src='z/o_feder.webp';ctx.W.append(s,lab('Reibe mit dem Finger über das Pergament'));
  const pimg=new Image();pimg.src='z/t_pergament.jpg';
  const cover=(x,W,H)=>{if(pimg.complete&&pimg.naturalWidth){x.drawImage(pimg,0,0,W,H)}else{const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f6ecd4');g.addColorStop(1,'#e6d4ab');x.fillStyle=g;x.fillRect(0,0,W,H)}};
  let rub=0;const sc=scratch(s,cover,()=>{sc.clear();SFX.quill();setTimeout(()=>SFX.magic(),250);s.classList.add('done')});
  s.addEventListener('pointermove',e=>{if(e.buttons&&++rub%9===0)SFX.tick()});
  pimg.onload=()=>{if(!ctx.solved&&sc.refill)sc.refill()};
  if(ctx.solved)setTimeout(()=>{sc.clear();s.classList.add('done')},50)},
 // 2 Kessel
 cauldron(ctx){const w=ctx.D.w,IMG={Froschkraut:'z/i_frosch.webp',Feuerbeere:'z/i_feuer.webp',Eisblume:'z/i_eis.webp',Sonnenstaub:'z/i_sonne.webp'};
  const box=el('div','kz-cauld');let got=[];
  const shelf=el('div','kz-shelf');const potw=el('div','kz-pot','<div class="kz-glow"></div><img src="z/o_kessel.webp" alt="Kessel"><div class="kz-steam"></div><div class="kz-reveal"></div>');
  const glow=potw.querySelector('.kz-glow'),steam=potw.querySelector('.kz-steam'),rev=potw.querySelector('.kz-reveal');
  const seq=el('div','kz-seq','');box.append(shelf,potw);
  const setCol=c=>{glow.style.background='radial-gradient(ellipse at 50% 50%,'+c+' 0%,'+c+'00 70%)';glow.classList.remove('pulse');void glow.offsetWidth;glow.classList.add('pulse')};
  const parts=w.items.map((it,i)=>{const d=el('div','kz-ingr','<img src="'+IMG[it[0]]+'" alt=""><span class="kz-let">'+it[2]+'</span><small>'+it[0]+'</small>');d.dataset.i=i;shelf.appendChild(d);return d});
  const reset=()=>{got=[];seq.innerHTML='';parts.forEach(p=>{p.classList.remove('used');p.style.transform=''});setCol('#41e0c8');rev.className='kz-reveal'};
  const puff=(dark)=>{for(let k=0;k<9;k++){const s=el('i','kz-puff'+(dark?' dark':''));s.style.left=(35+Math.random()*30)+'%';s.style.animationDelay=(k*.06)+'s';steam.appendChild(s);setTimeout(()=>s.remove(),1800)}};
  const drop=(p)=>{const it=w.items[+p.dataset.i];p.classList.add('used');
   const pr=p.getBoundingClientRect(),kr=potw.getBoundingClientRect();const fly=p.querySelector('img').cloneNode();fly.className='kz-fly';document.body.appendChild(fly);
   fly.style.left=pr.left+'px';fly.style.top=pr.top+'px';fly.style.width=pr.width*.7+'px';
   const dx=kr.left+kr.width/2-pr.left-pr.width*.35,dy=kr.top+kr.height*.25-pr.top;
   fly.animate([{transform:'translate(0,0) rotate(0) scale(1)'},{transform:'translate('+dx*.5+'px,'+(dy*.5-60)+'px) rotate(140deg) scale(.9)'},{transform:'translate('+dx+'px,'+dy+'px) rotate(300deg) scale(.4)',opacity:.2}],{duration:620,easing:'cubic-bezier(.4,.1,.6,1)'}).onfinish=()=>{fly.remove();
    SFX.plop();setCol(it[1]);puff(false);for(let k=0;k<6;k++){const d=el('i','kz-drop');d.style.setProperty('--dx',(Math.random()*80-40)+'px');d.style.background=it[1];steam.appendChild(d);setTimeout(()=>d.remove(),900)}
    got.push(it[2]);seq.innerHTML=got.map(l=>'<b>'+l+'</b>').join('');
    if(got.length===w.items.length){const word=got.join('');
     if(word===w.sol){setTimeout(()=>{rev.innerHTML='<img src="ic/hedgehog.webp" alt=""><b>'+word+'</b>';rev.className='kz-reveal on';SFX.magic();sparkleAt(potw,26)},450);setTimeout(()=>ctx.check(word),2200)}
     else{setTimeout(()=>{setCol('#2a2433');puff(true);SFX.no();toast('Puff! Schwarzer Rauch. Die Reihenfolge stimmt nicht.')},350);setTimeout(reset,1700)}}}};
  parts.forEach(p=>{let sx=0,sy=0,dr=false,moved=false;
   p.addEventListener('pointerdown',e=>{if(p.classList.contains('used'))return;ac();dr=true;moved=false;sx=e.clientX;sy=e.clientY;p.setPointerCapture(e.pointerId);p.classList.add('drag')});
   p.addEventListener('pointermove',e=>{if(!dr)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.hypot(dx,dy)>6)moved=true;p.style.transform='translate('+dx+'px,'+dy+'px) scale(1.12) rotate('+(dx/12)+'deg)'});
   p.addEventListener('pointerup',e=>{if(!dr)return;dr=false;p.classList.remove('drag');const r=potw.getBoundingClientRect();const inPot=e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top-30&&e.clientY<r.bottom;p.style.transform='';if(!moved||inPot)drop(p)})});
  setCol('#41e0c8');
  if(ctx.solved){rev.innerHTML='<img src="ic/hedgehog.webp" alt=""><b>'+w.sol+'</b>';rev.className='kz-reveal on'}
  ctx.W.append(box,seq,lab('Zieh oder tipp die Zutaten in der richtigen Reihenfolge in den Kessel'));const r=btn('Kessel leeren','ghost sm');r.onclick=()=>{SFX.bubble();reset()};ctx.W.appendChild(r)},
 // 3 Runenrad
 wheel(ctx){const w=ctx.D.w,A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';ctx.W.appendChild(lab('Geheime Botschaft'));ctx.W.appendChild(el('div','codeword kz-code',w.code.split('').map(c=>'<span>'+c+'</span>').join('')));
  const s=sv('svg',{viewBox:'-150 -150 300 300',class:'wheel kz-wheel'});
  s.appendChild(sv('image',{href:'z/o_runenscheibe.webp',x:-150,y:-150,width:300,height:300}));
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2,cx=Math.sin(a)*126,cy=-Math.cos(a)*126;s.appendChild(sv('circle',{cx,cy:cy+1.2,r:12.2,fill:'rgba(40,22,4,.45)'}));s.appendChild(sv('circle',{cx,cy,r:12,fill:i===3?'#8a2a3a':'#f6e6bd',stroke:i===3?'#f6d78a':'#7a5520','stroke-width':1.3}));s.appendChild(sv('text',{x:cx,y:cy+5.3,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':15,fill:i===3?'#fff':'#2a1704'},A[i]))}
  const g=sv('g',{});g.appendChild(sv('circle',{r:106,fill:'#18275e',stroke:'#e0b961','stroke-width':3}));g.appendChild(sv('circle',{r:84,fill:'none',stroke:'#e0b961','stroke-width':1,opacity:.6}));
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2;if(i===0)g.appendChild(sv('circle',{cx:0,cy:-95,r:11,fill:'none',stroke:'#ffd76a','stroke-width':2.5}));g.appendChild(sv('text',{x:Math.sin(a)*95,y:-Math.cos(a)*95+5,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':i===0?16:13,fill:i===0?'#ffd76a':'#f1d690'},A[i]))}
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;g.appendChild(sv('circle',{cx:Math.sin(a)*60,cy:-Math.cos(a)*60,r:1.6,fill:'#e0b961',opacity:.7}))}
  g.appendChild(sv('path',{d:starPath(30,8),fill:'#e0b961',opacity:.9}));s.appendChild(g);s.appendChild(sv('path',{d:'M0 -150 l-8 0 l8 15 l8 -15Z',fill:'#8a2a3a',stroke:'#f6d78a','stroke-width':1}));
  let rot=ctx.solved?w.key:7,drag=false,a0=0,r0=0;const draw=()=>{g.setAttribute('transform','rotate('+(rot*360/26)+')');if(rot===w.key&&!s.classList.contains('hit')){s.classList.add('hit');SFX.chime()}else if(rot!==w.key)s.classList.remove('hit')};draw();
  const ang=e=>{const [x,y]=svgPt(s,e);return Math.atan2(x,-y)};
  s.addEventListener('pointerdown',e=>{ac();drag=true;a0=ang(e);r0=rot});addEventListener('pointermove',e=>{if(!drag)return;const da=(ang(e)-a0)*26/(2*Math.PI);let nr=Math.round(r0+da);nr=((nr%26)+26)%26;if(nr!==rot){rot=nr;SFX.tick();draw()}});addEventListener('pointerup',()=>drag=false);
  ctx.W.appendChild(s);const c=el('div','ctrl');const l=el('button','btn ghost sm',IC.rotL),r=el('button','btn ghost sm',IC.rotR);l.onclick=()=>{rot=(rot+25)%26;SFX.tick();draw()};r.onclick=()=>{rot=(rot+1)%26;SFX.tick();draw()};c.append(l,r);ctx.W.appendChild(c)},
 // 4 Kristallkugel
 crystal(ctx){const b=el('div','kz-ball');b.innerHTML='<img src="z/o_kugel_gross.webp" alt="">';const sp=el('div','kz-sphere');sp.appendChild(el('div','mw',ctx.D.w.word));b.appendChild(sp);ctx.W.append(b,lab('Wisch die Kugel mit dem Finger frei'));
  let rub=0;const sc=scratch(sp,(x,W,H)=>{const g=x.createRadialGradient(W*.4,H*.35,0,W/2,H/2,W*.6);g.addColorStop(0,'rgba(240,244,255,.97)');g.addColorStop(1,'rgba(176,190,230,.97)');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalAlpha=.3;for(let i=0;i<70;i++){x.fillStyle='#fff';x.beginPath();x.arc(Math.random()*W,Math.random()*H,Math.random()*W*.09,0,7);x.fill()}x.globalAlpha=.25;for(let i=0;i<30;i++){x.fillStyle='#c9b8ff';x.beginPath();x.arc(Math.random()*W,Math.random()*H,Math.random()*W*.06,0,7);x.fill()}x.globalAlpha=1},()=>{sc.clear();SFX.magic();b.classList.add('done')},30);
  sp.addEventListener('pointermove',e=>{if(e.buttons&&++rub%14===0)SFX.crystal(.35)});
  if(ctx.solved)setTimeout(()=>{sc.clear();b.classList.add('done')},50)},
 // 5 Mondphasen
 moon(ctx){const w=ctx.D.w;let uid=0;
  const mk=p=>{const id='mm'+(++uid)+Math.random().toString(36).slice(2,6);const s=sv('svg',{viewBox:'-26 -26 52 52',class:'kz-moon'});
   let lit='';if(p===.5)lit='M0 -24 A24 24 0 1 1 0 24 A24 24 0 1 1 0 -24Z';
   else if(p===0)lit='M0 0Z';else{const f=p%1;const waxing=f<.5;const ill=waxing?f*2:(1-f)*2;const k=Math.cos(ill*Math.PI)*24;const sweep=waxing?1:0;lit='M0 -24 A24 24 0 0 '+sweep+' 0 24 A'+Math.abs(k)+' 24 0 0 '+(k>0?1-sweep:sweep)+' 0 -24Z'}
   s.innerHTML='<defs><clipPath id="'+id+'"><path d="'+lit+'"/></clipPath></defs><image href="z/o_mond.webp" x="-24" y="-24" width="48" height="48" opacity=".16"/><image href="z/o_mond.webp" x="-24" y="-24" width="48" height="48" clip-path="url(#'+id+')"/><circle r="24" fill="none" stroke="rgba(255,240,200,.25)" stroke-width=".8"/>';return s};
  const row=el('div','moons kz-moons');w.seq.forEach(p=>{const d=el('div','m');if(p===null)d.appendChild(el('div','qmark','?'));else d.appendChild(mk(p===1?0:p));row.appendChild(d)});
  ctx.W.append(row,lab('Welcher Mond gehört in die Lücke?'));
  const g=el('div','opts');g.style.gridTemplateColumns='repeat(4,1fr)';w.opts.forEach(([L,p])=>{const b=el('button','opt');b.appendChild(mk(p));b.querySelector('svg').style.width='50px';b.appendChild(el('span','lab',L));b.onclick=()=>{SFX.twinkle(.5);g.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ctx.check(L===ctx.D.L?'__OK__':'x')};g.appendChild(b)});
  ctx.noInput=true;ctx.W.appendChild(g)},
 // 6 Porträts
 portraits(ctx){const w=ctx.D.w,f=el('div','frames painted'),bub=el('div','bubble','Tipp auf ein Porträt, dann spricht es.');
  const IMG={'Gräfin Ulme':'ic/por_ulme.webp','Ritter Rabold':'ic/por_rabold.webp','Magister Kauz':'ic/por_kauz.webp'};
  const VO={'Gräfin Ulme':'ulme','Ritter Rabold':'rabold','Magister Kauz':'kauz'};
  const play=src=>window.Z.clip(src);
  const frames={};
  w.p.forEach(([n,ic,t])=>{const d=el('button','frame pf','<div class="pimg"><img src="'+IMG[n]+'" alt="'+n+'"></div><b>'+n+'</b>');
   d.onclick=()=>{ac();Object.values(frames).forEach(x=>x.classList.remove('talk'));void d.offsetWidth;d.classList.add('talk');bub.innerHTML='<b>'+n+':</b> „'+t+'“';play('v/p_'+VO[n]+'_a.mp3');setTimeout(()=>d.classList.remove('talk'),3800)};
   frames[n]=d;f.appendChild(d)});
  const lf=el('div','lift');w.p.forEach(([n])=>{const b=el('button','btn ghost sm','Rahmen anheben');b.onclick=()=>{const fr=frames[n];fr.classList.add('lifted');setTimeout(()=>fr.classList.remove('lifted'),1600);
    if(n===w.sol){SFX.magic();b.innerHTML=IC.key+' Schlüssel!';bub.innerHTML='<b>'+n+':</b> „Erwischt! Na gut, ich habe ein klitzekleines bisschen geschwindelt.“';play('v/p_'+VO[n]+'_b.mp3');setTimeout(()=>ctx.check('__OK__'),2600)}
    else{SFX.no();b.textContent='Nichts';const r={'Gräfin Ulme':'Hinter mir? Nur Staub, mein Kind. Wie unhöflich!','Magister Kauz':'Hinter mir? Nur alte Bücher und eine Spinne, junger Lehrling.'}[n];if(r){bub.innerHTML='<b>'+n+':</b> „'+r+'“';play('v/p_'+VO[n]+'_b.mp3')}else toast('Hinter '+n+' ist nur Staub.')}};lf.appendChild(b)});
  ctx.noInput=true;ctx.W.append(f,bub,lf)},
 // 7 Treppen
 stairs(ctx){const T=[['I','L','L','L'],['L','I','I','L'],['L','I','L','I'],['I','L','L','I']];
  // Lösungsweg: (3,0)I n-s, (2,0)L s-e, (2,1)I w-e, (2,2)L w-n, (1,2)I s-n, (0,2)L s-e, (0,3)L w-n
  const R=[[0,1,2,1],[3,0,1,2],[2,1,1,3],[1,1,0,2]];
  const OPEN={I:[['n','s'],['e','w']],L:[['n','e'],['e','s'],['s','w'],['w','n']]};
  const op=(r,c)=>{const t=T[r][c];return OPEN[t][R[r][c]%(t==='I'?2:4)]};
  const fix={'3,0':0,'2,0':1,'2,1':1,'2,2':3,'1,2':0,'0,2':1,'0,3':3};
  if(ctx.solved)for(const k in fix){const [r,c]=k.split(',').map(Number);R[r][c]=fix[k]}
  const g=el('div','stairs kz-stairs');
  const top=el('div','send top','<span></span><span></span><span></span><span class="mark goal"><img src="ic/door.webp" alt=""><br>Sternwarte</span>');
  const bot=el('div','send bot','<span class="mark start"><img src="ic/lantern.webp" alt=""><br>Halle</span><span></span><span></span><span></span>');
  const DD={n:[-1,0],s:[1,0],e:[0,1],w:[0,-1]},OPP={n:'s',s:'n',e:'w',w:'e'};
  const reach=()=>{const seen=new Set();if(!op(3,0).includes('s'))return seen;seen.add('3,0');const q=[[3,0]];while(q.length){const [r,c]=q.shift();op(r,c).forEach(d=>{const nr=r+DD[d][0],nc=c+DD[d][1];if(nr<0||nr>3||nc<0||nc>3)return;if(!op(nr,nc).includes(OPP[d]))return;const k=nr+','+nc;if(!seen.has(k)){seen.add(k);q.push([nr,nc])}})}return seen};
  const draw=(b,r,c,lit)=>{const t=T[r][c],k=R[r][c]%(t==='I'?2:4);const deg=t==='I'?k*90:(k-1)*90;
   if(!b.firstChild){b.innerHTML='<img src="z/'+(t==='I'?'o_treppe_gerade':'o_treppe_kurve')+'.webp" alt=""><i class="kz-lit"></i>'}
   b.firstChild.style.transform='rotate('+deg+'deg)';b.classList.toggle('lit',!!lit)};
  const redraw=()=>{const R0=reach();cells.forEach((b,i)=>draw(b,i>>2,i&3,R0.has((i>>2)+','+(i&3))))};
  let won=false;const cells=[];
  const check=()=>{const R0=reach();return R0.has('0,3')&&op(0,3).includes('n')};
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const b=el('button','t');if(r===3&&c===0)b.classList.add('st');if(r===0&&c===3)b.classList.add('en');b.onclick=()=>{if(won)return;ac();R[r][c]++;SFX.stone(.6);redraw();if(check()){won=true;g.classList.add('ok');SFX.magic();top.querySelector('.goal').innerHTML='<img src="ic/door.webp" alt="" class="open"><br>Tür offen: <b>S</b>';setTimeout(()=>ctx.check('__OK__'),900)}};g.appendChild(b);cells.push(b)}
  redraw();if(ctx.solved){won=true;g.classList.add('ok')}
  ctx.noInput=true;ctx.W.append(top,g,bot,lab('Leuchtende Stufen sind schon mit der Halle verbunden'))},
 // 8 Labyrinth
 maze(ctx){const w=ctx.D.w,N=6,box=el('div','maze');const s=sv('svg',{viewBox:'-4 -30 308 368'});box.appendChild(s);const C=50;
  s.appendChild(sv('rect',{x:-6,y:-6,width:312,height:312,rx:12,fill:'#5b4a33'}));s.appendChild(sv('image',{href:'z/t_pergament.jpg',x:0,y:0,width:300,height:300,preserveAspectRatio:'none'}));
  const trail=sv('g',{});s.appendChild(trail);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const o=w.open[r][c],x=c*C,y=r*C;const L=w.let[r][c];if(L!=='.'){s.appendChild(sv('circle',{cx:x+25,cy:y+25,r:13,fill:'#d7a840',stroke:'#8a6420','stroke-width':1.5}));s.appendChild(sv('text',{x:x+25,y:y+31,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':17,fill:'#3a2306'},L))}
   const wl=(x1,y1,x2,y2)=>{s.appendChild(sv('line',{x1,y1:y1+2,x2,y2:y2+2,stroke:'rgba(40,25,10,.35)','stroke-width':9,'stroke-linecap':'round'}));s.appendChild(sv('line',{x1,y1,x2,y2,stroke:'#8d8172','stroke-width':8,'stroke-linecap':'round'}));s.appendChild(sv('line',{x1,y1,x2,y2,stroke:'#b9ad9b','stroke-width':4,'stroke-linecap':'round','stroke-dasharray':'9 4'}))};
   if(!o.includes('n')&&!(r===0&&c===N-1))wl(x,y,x+C,y);if(!o.includes('w'))wl(x,y,x,y+C);if(c===N-1&&!o.includes('e'))wl(x+C,y,x+C,y+C);if(r===N-1&&!o.includes('s')&&!(c===0))wl(x,y+C,x+C,y+C)}

  const glow=(x,y,col)=>{const g0=sv('rect',{x:x+3,y:y+3,width:44,height:44,rx:8,fill:col,opacity:.35});g0.innerHTML='<animate attributeName="opacity" values=".2;.5;.2" dur="1.8s" repeatCount="indefinite"/>';s.insertBefore(g0,trail)};
  glow(0,250,'#7fe0a0');glow(250,0,'#ffd76a');
  s.appendChild(sv('text',{x:25,y:322,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':16,fill:'#2f7a4a'},'START'));
  s.appendChild(sv('text',{x:275,y:-12,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':16,fill:'#9a6b14'},'ZIEL'));
  s.appendChild(sv('path',{d:'M18 300 h14',stroke:'#2f7a4a','stroke-width':4}));
  s.appendChild(sv('image',{href:'z/o_turm_nord.webp',x:258,y:-28,width:36,height:62}));
  const owl=sv('image',{href:'z/o_eule_fenna.webp',width:34,height:42});s.appendChild(owl);
  let r=ctx.solved?0:5,c=ctx.solved?5:0;const pos=()=>{owl.setAttribute('x',c*C+8);owl.setAttribute('y',r*C+4)};pos();
  const D={n:[-1,0],s:[1,0],w:[0,-1],e:[0,1]};
  const lc={};s.querySelectorAll('circle').forEach(ci=>{const k=Math.round((+ci.getAttribute('cy')-25)/C)+','+Math.round((+ci.getAttribute('cx')-25)/C);lc[k]=ci});
  const got=el('div','kz-mgot');const path=[[r,c]];
  const paint=()=>{trail.innerHTML='';for(let i=0;i<path.length-1;i++){const [a1,b1]=path[i],[a2,b2]=path[i+1];trail.appendChild(sv('line',{x1:b1*C+25,y1:a1*C+25,x2:b2*C+25,y2:a2*C+25,stroke:'#c9962e','stroke-width':6,'stroke-linecap':'round',opacity:.55}))}
   const on=new Set(path.map(([a,b])=>a+','+b));Object.keys(lc).forEach(k=>{const ci=lc[k];const hit=on.has(k);ci.setAttribute('fill',hit?'#ffe27a':'#d7a840');ci.setAttribute('stroke',hit?'#7a2a10':'#8a6420');ci.setAttribute('stroke-width',hit?3:1.5);ci.setAttribute('r',hit?15:13)});
   const L=path.map(([a,b])=>w.let[a][b]).filter(x=>x!=='.');got.innerHTML='<span>Gesammelt</span>'+(L.length?L.map(x=>'<b>'+x+'</b>').join(''):'<i>noch nichts</i>')};
  const mv=d=>{if(!w.open[r][c].includes(d)){SFX.no();box.classList.remove('bump');void box.offsetWidth;box.classList.add('bump');return}r+=D[d][0];c+=D[d][1];
   const pv=path[path.length-2];if(pv&&pv[0]===r&&pv[1]===c)path.pop();else path.push([r,c]);SFX.wing();pos();paint();
   if(r===0&&c===5){SFX.hoot(.6);setTimeout(()=>SFX.magic(),600);toast('Fenna ist am Turm! Welches Wort hat sie gesammelt?')}};
  const ar=el('div','arrows');ar.innerHTML='<span></span><button data-m="n" aria-label="hoch">'+IC.up+'</button><span></span><button data-m="w" aria-label="links">'+IC.left+'</button><button data-m="s" aria-label="runter">'+IC.down+'</button><button data-m="e" aria-label="rechts">'+IC.right+'</button>';
  ar.querySelectorAll('button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();ac();b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');mv(b.dataset.m)}));
  let sx=null,sy=null,sw=false;box.addEventListener('pointerdown',e=>{ac();sx=e.clientX;sy=e.clientY;sw=false});box.addEventListener('pointermove',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;const th=box.getBoundingClientRect().width/9;if(Math.abs(dx)>th||Math.abs(dy)>th){sw=true;mv(Math.abs(dx)>Math.abs(dy)?(dx>0?'e':'w'):(dy>0?'s':'n'));sx=e.clientX;sy=e.clientY}});
  box.addEventListener('pointerup',e=>{if(sx!==null&&!sw){const [x,y]=svgPt(s,e);const tc=Math.floor(x/C),tr=Math.floor(y/C);const dr=tr-r,dc=tc-c;if(Math.abs(dr)+Math.abs(dc)===1)mv(dr<0?'n':dr>0?'s':dc<0?'w':'e');else if(!(dr===0&&dc===0))toast('Tipp auf ein Feld direkt neben Fenna.')}sx=null});addEventListener('pointerup',()=>{sx=null});
  const rs=btn('Zurück zum Start','ghost sm');rs.onclick=()=>{r=5;c=0;path.length=0;path.push([r,c]);pos();paint()};
  if(ctx.solved){path.length=0;[[5,0],[5,1],[5,2],[4,2],[4,1],[4,0],[3,0],[3,1],[3,2],[3,3],[3,4],[2,4],[2,5],[1,5],[1,4],[0,4],[0,5]].forEach(x=>path.push(x))}
  paint();
  ctx.W.append(box,got,ar,rs)},
 // 9 Spieluhr
 musicbox(ctx){const w=ctx.D.w,F={};w.bells.forEach(([L,f])=>F[L]=f);const mb=el('div','kz-mbox');
  mb.innerHTML='<img src="z/o_spieluhr.webp" alt="Spieluhr" class="box">';
  const s=sv('svg',{viewBox:'-80 -80 160 160',class:'crank kz-crank'});s.innerHTML='<defs><radialGradient id="kzbr" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#d4a548"/><stop offset="1" stop-color="#7a5420"/></radialGradient></defs><circle r="44" fill="url(#kzbr)" stroke="#5a3d14" stroke-width="3"/><circle r="34" fill="none" stroke="#5a3d14" stroke-width="1.5" opacity=".6"/>';
  const arm=sv('g',{});arm.innerHTML='<line x1="0" y1="0" x2="0" y2="-62" stroke="#c9963a" stroke-width="9" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-62" stroke="#fff0b8" stroke-width="3" stroke-linecap="round" opacity=".7"/><circle cy="-64" r="12" fill="#5a2a1a" stroke="#d4a548" stroke-width="3"/>';s.appendChild(arm);s.appendChild(sv('circle',{r:7,fill:'#5a3d14'}));
  let ang=0,last=null,acc=0,ni=0;const draw=()=>arm.setAttribute('transform','rotate('+ang+')');draw();
  const bs=el('div','kz-bells');const BB={};w.bells.forEach(([L,f])=>{const b=el('button','','<img src="ic/bell.webp" alt=""><b>'+L+'</b>');b.onclick=()=>{ac();bell(f,1.5,.16);ring(b)};bs.appendChild(b);BB[L]=b});
  const ring=b=>{b.classList.remove('ring');void b.offsetWidth;b.classList.add('ring')};
  const at=e=>{const [x,y]=svgPt(s,e);return Math.atan2(x,-y)*180/Math.PI};let on=false;
  s.addEventListener('pointerdown',e=>{ac();on=true;last=at(e)});addEventListener('pointermove',e=>{if(!on)return;const a=at(e);let d=a-last;if(d>180)d-=360;if(d<-180)d+=360;last=a;if(d<0)return;ang+=d;acc+=d;draw();if(acc>=70){acc=0;const L=w.melody[ni%w.melody.length];bell(F[L],1.6,.16);mb.classList.remove('play');void mb.offsetWidth;mb.classList.add('play');ni++}});addEventListener('pointerup',()=>{on=false});
  const row=el('div','kz-mrow');row.append(mb,s);ctx.W.append(row,lab('Dreh die goldene Kurbel im Uhrzeigersinn'));
  const play=btn(IC.right+' Melodie abspielen','ghost sm');play.onclick=()=>{ac();w.melody.split('').forEach((L,i)=>setTimeout(()=>{bell(F[L],1.5,.16);mb.classList.remove('play');void mb.offsetWidth;mb.classList.add('play')},i*600))};
  ctx.W.append(lab('Die sechs Glocken'),bs,play)},
 // 10 Schneekugel
 globe(ctx){const wrap=el('div','globewrap kz-globe');const s=el('img','gimg');s.src='z/o_schneekugel.webp';s.draggable=false;wrap.style.touchAction='pan-y';
  const cv=el('canvas');cv.width=400;cv.height=400;cv.className='gcv';const tx=el('div','globetext',ctx.D.w.text);wrap.append(s,cv,tx);
  const meter=el('div','meter','<i></i>');ctx.W.append(wrap,meter,lab('Schütteln oder schnell hin und her wischen'));
  const x=cv.getContext('2d');const P=[];for(let i=0;i<140;i++)P.push({x:100+Math.random()*120-60,y:140+Math.random()*20,vx:0,vy:0});let E=ctx.solved?.6:0,alive=true;
  (function loop(){if(!alive)return;if(!document.body.contains(cv)){alive=false;return}x.clearRect(0,0,400,400);x.save();x.beginPath();x.arc(200,200,182,0,7);x.clip();x.fillStyle='#fff';
   P.forEach(p=>{if(E>.05&&Math.random()<E*.2){p.vx+=(Math.random()-.5)*E*3;p.vy-=Math.random()*E*3}p.vy+=.03;p.vx*=.96;p.vy*=.97;p.x+=p.vx;p.y+=p.vy;const dx=p.x-100,dy=p.y-100;if(Math.hypot(dx,dy)>88){p.vx*=-.5;p.vy*=-.5;p.x=100+dx*.97;p.y=100+dy*.97}if(p.y>146&&Math.abs(p.x-100)<60){p.y=146+Math.random()*4;p.vy=0}x.beginPath();x.arc(p.x*2,p.y*2,2.2,0,7);x.fill()});x.restore();
   E=Math.max(0,E-.004);tx.style.opacity=Math.max(0,Math.min(1,(E-.25)*3));meter.firstChild.style.width=Math.min(100,E*100)+'%';requestAnimationFrame(loop)})();
  let lastS=0;const kick=a=>{E=Math.min(1,E+a);const t=performance.now();if(t-lastS>900){lastS=t;SFX.globe(.6)}};
  let lx=null,dir=0;wrap.addEventListener('pointerdown',e=>{ac();lx=e.clientX});wrap.addEventListener('pointermove',e=>{if(lx===null)return;const d=e.clientX-lx;if(Math.abs(d)>8){const nd=Math.sign(d);if(nd!==dir&&dir)kick(.14);dir=nd;lx=e.clientX}});addEventListener('pointerup',()=>{lx=null;dir=0});
  let lg=null;const mo=e=>{if(!document.body.contains(cv)){removeEventListener('devicemotion',mo);return}const a=e.acceleration,g=e.accelerationIncludingGravity;let m=0;
   if(a&&a.x!=null)m=Math.hypot(a.x||0,a.y||0,a.z||0);else if(g&&g.x!=null){if(lg)m=Math.hypot(g.x-lg.x,g.y-lg.y,g.z-lg.z)*1.4;lg={x:g.x,y:g.y,z:g.z}}
   if(m>5)kick(Math.min(.12,(m-5)/45))};
  let mOn=false,asked=false;const sh=btn(IC.phone+' Schütteln einschalten','ghost sm');
  const allow=async()=>{if(mOn)return;try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function'){const r=await DeviceMotionEvent.requestPermission();if(r!=='granted'){if(!asked)toast('Ohne Erlaubnis geht nur das Wischen über die Kugel.');asked=true;return}}}catch(e){}mOn=true;addEventListener('devicemotion',mo);sh.innerHTML=IC.phone+' Jetzt kräftig schütteln!'};
  sh.onclick=allow;wrap.addEventListener('pointerdown',()=>{if(!asked&&window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function')allow()});
  if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission!=='function'){mOn=true;addEventListener('devicemotion',mo);sh.innerHTML=IC.phone+' Schüttle dein Handy'}ctx.W.appendChild(sh)},
 // 11 Kräuter Sudoku
 sudoku(ctx){const w=ctx.D.w,g=el('div','sudo kz-sudo'),cur=w.giv.map(r=>r.slice());if(ctx.solved)w.sol.forEach((r,i)=>cur[i]=r.slice());let won=ctx.solved;
  const HI={Minze:'z/o_k_minze.webp',Salbei:'z/o_k_salbei.webp',Thymian:'z/o_k_thymian.webp',Nessel:'z/o_k_nessel.webp'};const paint=(b,v)=>{b.innerHTML=v?'<img src="'+HI[w.herbs[v-1][0]]+'" alt=""><small>'+w.herbs[v-1][0]+'</small>':''};
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const b=el('button');const giv=w.giv[r][c]>0;if(giv)b.classList.add('giv');if(r===w.gold[0]&&c===w.gold[1])b.classList.add('gold');paint(b,cur[r][c]);
   b.onclick=()=>{if(giv||won)return;cur[r][c]=(cur[r][c]+1)%5;paint(b,cur[r][c]);SFX.tick();
    if(cur.every(row=>row.every(v=>v>0))){if(cur.every((row,i)=>row.every((v,j)=>v===w.sol[i][j]))){won=true;SFX.magic();toast('Das Beet blüht! Im goldenen Feld wächst Nessel.');setTimeout(()=>ctx.check('__OK__'),900)}else{SFX.no();toast('Irgendwo wächst ein Kraut doppelt. Prüf Reihen, Spalten und Viertel.')}}};g.appendChild(b)}
  const lg=el('div','legend kz-legend');w.herbs.forEach(h=>lg.appendChild(el('span','','<img src="'+HI[h[0]]+'" alt="">'+h[0])));ctx.noInput=true;ctx.W.append(g,lg)},
 // 12 Waage
 scale(ctx){const w=ctx.D.w;let n=ctx.solved?w.n:0;const E='<img src="z/i_drachenei.webp">',K='<img src="ic/crystal.webp">',M='<img src="z/i_mondstein.webp">';const rc=el('div','recipe kz-recipe','<div>'+E+'<span>Drachenei =</span>'+K+K+'<span>+</span>'+M+'</div><div>'+K+'<span>Kristall =</span>'+M+M+'</div>');
  // Gemalte Waage aus vier Ebenen: Balken kippt um die Mitte, Schalen hängen senkrecht an den Haken
  const L={stand:[387,32,769,819],beam:[170,130,983,186],panL:[39,186,369,613],panR:[784,186,1113,613]},PV=[577,163],HK={L:[203,182],R:[949,182]};
  const img=(k)=>{const b=L[k];return '<image href="z/w_'+k+'.webp" x="'+b[0]+'" y="'+b[1]+'" width="'+(b[2]-b[0])+'" height="'+(b[3]-b[1])+'"/>'};
  const s=sv('svg',{viewBox:'20 20 1112 820',class:'scale kz-scale kz-scale2'});
  s.innerHTML='<ellipse cx="578" cy="812" rx="210" ry="16" fill="rgba(90,60,20,.18)"/><ellipse class="sh" cx="203" cy="640" rx="140" ry="12" fill="rgba(90,60,20,.13)"/><ellipse class="sh" cx="949" cy="640" rx="140" ry="12" fill="rgba(90,60,20,.13)"/>';
  const lp=sv('g',{}),rp=sv('g',{}),beam=sv('g',{}),st=sv('g',{});lp.innerHTML=img('panL');rp.innerHTML=img('panR');beam.innerHTML=img('beam');st.innerHTML=img('stand');
  const li=sv('g',{}),ri=sv('g',{});lp.appendChild(li);rp.appendChild(ri);
  li.innerHTML='<image href="z/i_drachenei.webp" x="140" y="392" width="126" height="138"/>';
  s.append(lp,rp,beam,st);const sh=s.querySelectorAll('.sh');
  const rot=(p,a)=>{const r=a*Math.PI/180,dx=p[0]-PV[0],dy=p[1]-PV[1];return [PV[0]+dx*Math.cos(r)-dy*Math.sin(r),PV[1]+dx*Math.sin(r)+dy*Math.cos(r)]};
  let cur=null;
  const pose=a=>{beam.setAttribute('transform','rotate('+a+' '+PV[0]+' '+PV[1]+')');const l=rot(HK.L,a),r=rot(HK.R,a);
   lp.setAttribute('transform','translate('+(l[0]-HK.L[0]).toFixed(1)+' '+(l[1]-HK.L[1]).toFixed(1)+')');rp.setAttribute('transform','translate('+(r[0]-HK.R[0]).toFixed(1)+' '+(r[1]-HK.R[1]).toFixed(1)+')');
   sh[0].setAttribute('cx',l[0].toFixed(1));sh[1].setAttribute('cx',r[0].toFixed(1))};
  const swing=to=>{const from=cur==null?to:cur;cur=to;const t0=performance.now(),D=900;const f=t=>{const k=Math.min(1,(t-t0)/D);const e=1-Math.pow(1-k,3);const wob=Math.sin(k*Math.PI*3)*(1-k)*(to-from)*.18;pose(from+(to-from)*e+wob);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
  const stones=()=>{let t='';const rows=[5,4,1];let i=0;for(let r=0;r<rows.length&&i<n;r++){for(let j=0;j<rows[r]&&i<n;j++,i++){const x=949+(j-(rows[r]-1)/2)*54-32,y=462-r*38;t+='<image href="z/i_mondstein.webp" x="'+x.toFixed(1)+'" y="'+y+'" width="64" height="64"/>'}}ri.innerHTML=t};
  const draw=()=>{const tilt=Math.max(-12,Math.min(12,(w.n-n)*2.6));stones();swing(-tilt);num.textContent=n};
  const c=el('div','ctrl');const m=el('button','btn ghost sm','− Stein'),num=el('b','',''),p=el('button','btn ghost sm','+ Stein');c.append(m,num,p);
  let tm=null;const chg=d=>{const o=n;n=Math.max(0,Math.min(10,n+d));if(n===o)return;SFX.tick();if(d>0)SFX.plop(.35);draw();clearTimeout(tm);if(n===w.n){tm=setTimeout(()=>{SFX.magic();sparkleAt(s,20);toast('Die Waage steht ganz still. '+n+' Mondsteine!');setTimeout(()=>ctx.check('__OK__'),700)},700)}};
  m.onclick=()=>chg(-1);p.onclick=()=>chg(1);ctx.noInput=true;ctx.W.append(rc,s,c,numtab());draw()},
 // 13 Kerze
 candle(ctx){const cave=el('div','cave kz-cave');cave.append(el('div','insc',ctx.D.w.text),el('div','dark'),el('div','flame','<img src="ic/candle.webp" alt="">'));let lit=false;
  const set=e=>{const r=cave.getBoundingClientRect();cave.style.setProperty('--x',(e.clientX-r.left)+'px');cave.style.setProperty('--y',(e.clientY-r.top)+'px')};
  cave.addEventListener('pointerdown',e=>{ac();if(!lit){lit=true;SFX.candle(.6)}set(e)});cave.addEventListener('pointermove',set);
  if(ctx.solved)cave.querySelector('.dark').style.display='none';ctx.W.append(cave,lab('Kerze mit dem Finger über die Wand bewegen'))},
 // 14 Fernrohr
 scope(ctx){const box=el('div','scopebox');const s=sv('svg',{viewBox:'0 0 360 260'});box.appendChild(s);
  const C=[['Schwan',[[161,53],[174,85],[186,115],[199,146],[155,94],[137,103],[193,75],[210,67]],[[0,1],[1,2],[2,3],[1,4],[4,5],[1,6],[6,7]],[180,100]],
   ['Leier',[[60,60],[48,90],[72,98],[58,128],[84,134]],[[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]],[66,100]],
   ['Krone',[[260,190],[280,205],[302,212],[324,206],[340,190],[300,190]],[[0,1],[1,2],[2,3],[3,4]],[300,200]],
   ['Drache',[[290,40],[310,60],[300,90],[270,100],[250,130],[262,158]],[[0,1],[1,2],[2,3],[3,4],[4,5]],[285,95]],
   ['Kassiopeia',[[40,200],[62,176],[86,198],[110,172],[132,196]],[[0,1],[1,2],[2,3],[3,4]],[86,190]]];
  s.innerHTML='<image href="z/t_himmel.jpg" x="0" y="0" width="360" height="260" preserveAspectRatio="xMidYMid slice" opacity=".55"/><rect width="360" height="260" fill="#050818" opacity=".55"/>';let bg='';for(let i=0;i<90;i++)bg+='<circle cx="'+(Math.random()*360).toFixed(0)+'" cy="'+(Math.random()*260).toFixed(0)+'" r=".6" fill="#fff" opacity=".25"/>';s.insertAdjacentHTML('beforeend',bg);
  const cid='sc'+Math.random().toString(36).slice(2);s.insertAdjacentHTML('beforeend','<defs><clipPath id="'+cid+'"><circle id="'+cid+'c" cx="180" cy="130" r="62"/></clipPath></defs>');
  const lay=sv('g',{'clip-path':'url(#'+cid+')'});lay.appendChild(sv('image',{href:'z/t_himmel.jpg',x:0,y:0,width:360,height:260,preserveAspectRatio:'xMidYMid slice'}));lay.appendChild(sv('rect',{width:360,height:260,fill:'#0a1030',opacity:.35}));
  let det='';for(let i=0;i<160;i++)det+='<circle cx="'+(Math.random()*360).toFixed(1)+'" cy="'+(Math.random()*260).toFixed(1)+'" r="'+(Math.random()*.9+.3).toFixed(2)+'" fill="#fff" opacity=".7"/>';lay.insertAdjacentHTML('beforeend',det);
  C.forEach(([n,P,E])=>{E.forEach(([a,b])=>lay.appendChild(sv('line',{x1:P[a][0],y1:P[a][1],x2:P[b][0],y2:P[b][1],stroke:'#8fb0ff','stroke-width':1,opacity:.6})));P.forEach(p=>{lay.appendChild(sv('circle',{cx:p[0],cy:p[1],r:6,fill:'#fff6c8',opacity:.25}));lay.appendChild(sv('circle',{cx:p[0],cy:p[1],r:3.2,fill:'#fffbe8'}))})});
  s.appendChild(lay);const ring=sv('circle',{cx:180,cy:130,r:62,fill:'none',stroke:'#c9963a','stroke-width':7,style:'filter:drop-shadow(0 0 4px rgba(0,0,0,.8))'});s.appendChild(ring);const cross=sv('g',{opacity:.35});s.appendChild(cross);
  const label=sv('text',{x:180,y:250,'text-anchor':'middle','font-family':'Cinzel','font-size':16,fill:'#f1d690'},'');s.appendChild(label);
  const clip=s.querySelector('#'+cid+'c');let cx=180,cy=130;const mvTo=(x,y)=>{cx=Math.max(20,Math.min(340,x));cy=Math.max(20,Math.min(240,y));clip.setAttribute('cx',cx);clip.setAttribute('cy',cy);ring.setAttribute('cx',cx);ring.setAttribute('cy',cy);cross.innerHTML='<line x1="'+(cx-62)+'" y1="'+cy+'" x2="'+(cx+62)+'" y2="'+cy+'" stroke="#c9a24e"/><line x1="'+cx+'" y1="'+(cy-62)+'" x2="'+cx+'" y2="'+(cy+62)+'" stroke="#c9a24e"/>'};mvTo(210,240);
  let dn=false,moved=false,st0=null;
  s.addEventListener('pointerdown',e=>{ac();dn=true;moved=false;st0=svgPt(s,e)});s.addEventListener('pointermove',e=>{if(!dn)return;const p=svgPt(s,e);if(Math.hypot(p[0]-st0[0],p[1]-st0[1])>6)moved=true;if(moved)mvTo(p[0],p[1]-40)});
  s.addEventListener('pointerup',e=>{dn=false;if(moved)return;const [x,y]=svgPt(s,e);if(Math.hypot(x-cx,y-cy)>62){toast('Schau zuerst durch das Fernrohr.');return}
   let best=null,bd=60;C.forEach(c=>{const d=Math.hypot(c[3][0]-x,c[3][1]-y);c[1].forEach(p=>{const dd=Math.hypot(p[0]-x,p[1]-y);if(dd<bd){bd=dd;best=c}})});
   if(!best){SFX.tap();return}label.textContent=best[0];if(best[0]==='Schwan'){SFX.twinkle();setTimeout(()=>SFX.magic(),300);ctx.check('__OK__')}else{SFX.no();toast('Das ist '+(best[0]==='Krone'||best[0]==='Leier'?'die ':best[0]==='Kassiopeia'?'':'der ')+best[0]+'. Gesucht ist ein Kreuz.')}});
  addEventListener('pointerup',()=>dn=false);s.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
  const tel=el('img','kz-tel');tel.src='z/o_fernrohr.webp';box.appendChild(tel);let cr=0;s.addEventListener('pointermove',()=>{if(dn&&++cr%25===0)SFX.tick()});
  ctx.noInput=true;ctx.W.append(box,lab('Ziehen bewegt das Fernrohr, tippen wählt ein Sternbild'))},
 // 15 Schloss
 lock(ctx){const w=ctx.D.w;const cl=el('div','clues');w.clues.forEach(([c,t])=>cl.appendChild(el('div','','<b>'+c+'</b><span>'+t+'</span>')));
  const v=ctx.solved?w.code.split('').map(Number):[0,0,0];const lw=el('div','lockw kz-lockw');const chest=el('div','kz-chest'+(ctx.solved?' open':''),'<img src="z/o_truhe.webp" alt=""><img src="z/o_schluessel4.webp" class="k" alt=""><b>T</b>');
  const dr=el('div','kz-drums');const dk=[];[0,1,2].forEach(i=>{const d=el('span','kz-drum');dr.appendChild(d);dk.push(d)});chest.appendChild(dr);
  const showD=()=>dk.forEach((d,i)=>{d.innerHTML='<i>'+((v[i]+9)%10)+'</i><b>'+v[i]+'</b><i>'+((v[i]+1)%10)+'</i>'});showD();
  v.forEach((x,i)=>{const r=el('div','ring');const u=el('button','',IC.up),b=el('b','',x),d=el('button','',IC.down);const set=k=>{v[i]=(v[i]+k+10)%10;b.textContent=v[i];showD();SFX.tick();b.classList.remove('roll');void b.offsetWidth;b.classList.add('roll');dk[i].classList.remove('roll');void dk[i].offsetWidth;dk[i].classList.add('roll')};
   [[u,1],[d,-1]].forEach(([bt,k])=>{bt.addEventListener('pointerdown',e=>{e.preventDefault();ac();bt.classList.remove('hit');void bt.offsetWidth;bt.classList.add('hit');set(k)});bt.addEventListener('click',e=>e.preventDefault())});
   let sy=null;b.addEventListener('pointerdown',e=>{sy=e.clientY});b.addEventListener('pointermove',e=>{if(sy===null)return;if(Math.abs(e.clientY-sy)>18){set(e.clientY<sy?1:-1);sy=e.clientY}});addEventListener('pointerup',()=>sy=null);b.style.touchAction='none';
   r.append(u,b,d);lw.appendChild(r)});
  const tries=el('div','clues kz-tries');const fb=g=>{const c=w.code;let rp=0,wp=0;for(let i=0;i<3;i++){if(g[i]===c[i])rp++;else if(c.includes(g[i]))wp++}
   const z=n=>n===1?'Eine Ziffer':n===2?'Zwei Ziffern':'Drei Ziffern';if(!rp&&!wp)return 'Keine Ziffer stimmt.';const t=[];if(rp)t.push(z(rp)+(rp===1?' stimmt und steht':' stimmen und stehen')+' am richtigen Platz');if(wp)t.push((rp?(wp===1?'eine':wp===2?'zwei':'drei'):z(wp))+(wp===1?' stimmt, steht aber':' stimmen, stehen aber')+' am falschen Platz');return t.join(', ')+'.'};
  const go=btn('Kästchen öffnen','');go.onclick=()=>{const g=v.join('');if(g===w.code){SFX.lock();chest.classList.add('open');setTimeout(()=>{SFX.magic();sparkleAt(chest,22)},700);setTimeout(()=>ctx.check('__OK__'),1500)}else{SFX.tick();chest.classList.remove('rattle');void chest.offsetWidth;chest.classList.add('rattle');
   if(!tries.childElementCount)tries.appendChild(el('div','kz-trylab','Deine Versuche, das Schloss antwortet:'));const row=el('div','new','<b>'+g+'</b><span>'+fb(g)+'</span>');tries.appendChild(row);
   if(navigator.vibrate)navigator.vibrate([40,40,40]);toast('Das Schloss klemmt. Schau, was es dir verrät.')}};
  const rule=el('div','kz-rule','Im Code kommt jede Ziffer nur einmal vor.');
  ctx.noInput=true;ctx.W.append(cl,rule,chest,lw,go,tries)},
 // 16 Bücher
 books(ctx){const w=ctx.D.w,sh=el('div','shelf kz-shelf2');let arr=ctx.solved?w.b.slice().sort((a,b)=>a[1]-b[1]):w.b.slice();let sel=-1;
  const BI={1:'z/o_buch1.webp',2:'z/o_buch2.webp',3:'z/o_buch3.webp',4:'z/o_buch4.webp'},H={1:96,2:116,3:136,4:156};
  const draw=()=>{sh.innerHTML='';arr.forEach((b,i)=>{const e=el('button','kz-book'+(i===sel?' sel':''),'<img src="'+BI[b[1]]+'" alt=""><span>'+b[0]+'</span>');e.style.height=H[b[1]]+'px';e.onclick=()=>{ac();if(sel<0){sel=i;SFX.tap()}else{if(sel!==i){[arr[sel],arr[i]]=[arr[i],arr[sel]];SFX.book()}sel=-1}draw();
     if(arr.every((x,k)=>k===0||arr[k-1][1]<x[1])&&!ctx.solved){sh.classList.add('ok');SFX.magic();sparkleAt(sh,16)}};sh.appendChild(e)})};draw();ctx.W.append(sh,lab('Vom kleinsten zum größten Buch'))},
 // 17 Muster
 pattern(ctx){const s=sv('svg',{viewBox:'0 0 240 240',class:'dots'});const P=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)P.push([40+c*80,40+r*80]);
  s.appendChild(sv('image',{href:'z/t_teppich.jpg',x:0,y:0,width:240,height:240,preserveAspectRatio:'xMidYMid slice'}));const lines=sv('g',{});s.appendChild(lines);const live=sv('line',{stroke:'#fff3c4','stroke-width':6,'stroke-linecap':'round',opacity:.6});s.appendChild(live);
  P.forEach((p,i)=>{s.appendChild(sv('circle',{cx:p[0],cy:p[1],r:17,fill:'#ffd76a',opacity:.18}));s.appendChild(sv('image',{href:'z/o_g_mondstein.webp',x:p[0]-15,y:p[1]-15,width:30,height:30}));s.appendChild(sv('text',{x:p[0]+15,y:p[1]-11,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':12,fill:'#ffe6a0',style:'paint-order:stroke',stroke:'#1a1430','stroke-width':3},i+1))});
  const wand=sv('image',{href:'z/o_stab_weide.webp',width:46,height:70,opacity:0,style:'pointer-events:none'});
  let cur=-1,on=false;const near=p=>{let b=-1;P.forEach((q,i)=>{if(Math.hypot(q[0]-p[0],q[1]-p[1])<26)b=i});return b};
  const add=(a,b)=>{lines.appendChild(sv('line',{x1:P[a][0],y1:P[a][1],x2:P[b][0],y2:P[b][1],stroke:'#fff3c4','stroke-width':7,'stroke-linecap':'round',style:'filter:drop-shadow(0 0 6px #ffd56a)'}));SFX.wand(.5);bell(600+b*80,.8,.08)};
  s.appendChild(wand);const mvw=p=>{wand.setAttribute('x',p[0]-6);wand.setAttribute('y',p[1]-62);wand.setAttribute('opacity',1)};
  s.addEventListener('pointerdown',e=>{ac();const p=svgPt(s,e);mvw(p);const k=near(p);if(k>=0){cur=k;on=true;SFX.wand();bell(600+k*80,.6,.06)}});
  s.addEventListener('pointermove',e=>{if(!on)return;const p=svgPt(s,e);mvw(p);live.setAttribute('x1',P[cur][0]);live.setAttribute('y1',P[cur][1]);live.setAttribute('x2',p[0]);live.setAttribute('y2',p[1]);const k=near(p);if(k>=0&&k!==cur){add(cur,k);cur=k}});
  addEventListener('pointerup',()=>{on=false;live.setAttribute('x2',live.getAttribute('x1')||0);live.setAttribute('y2',live.getAttribute('y1')||0)});s.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
  if(ctx.solved){add(6,1);add(1,8);add(3,5)}
  const rs=btn('Neu zeichnen','ghost sm');rs.onclick=()=>{lines.innerHTML='';SFX.whoosh()};ctx.W.append(s,lab('Muster: 7, 2, 9, dann 4, 6'),rs)},
 // 18 Eulen
 owls(ctx){const w=ctx.D.w,row=el('div','owlrow kz-owlrow'),tw=el('div','towers kz-towers');const place={};let sel=null;const ob={},tb={};
  const OI={Horaz:'z/o_eule_horaz.webp',Fenna:'z/o_eule_fenna.webp',Bruno:'z/o_eule_bruno.webp'},TI={Nordturm:'z/o_turm_nord.webp',Ostturm:'z/o_turm_ost.webp',Westturm:'z/o_turm_west.webp'};
  w.owls.forEach(o=>{const b=el('button','owlbtn','<img src="'+OI[o]+'" alt=""><b>'+o+'</b>');b.onclick=()=>{if(place[o]){delete place[o];sel=null;SFX.wing();row.querySelectorAll('.owlbtn').forEach(x=>x.classList.remove('sel'));draw();return}SFX.hoot(.35);sel=o;row.querySelectorAll('.owlbtn').forEach(x=>x.classList.toggle('sel',x===b))};row.appendChild(b);ob[o]=b});
  const draw=()=>{w.towers.forEach(t=>{const who=Object.keys(place).find(o=>place[o]===t);tb[t].querySelector('.slot').innerHTML=who?'<img src="'+OI[who]+'" alt=""><small>'+who+'</small>':'';});w.owls.forEach(o=>ob[o].classList.toggle('placed',!!place[o]))};
  w.towers.forEach(t=>{const b=el('button','tower','<div class="slot"></div><img class="tw" src="'+TI[t]+'" alt=""><small>'+t+'</small>');b.onclick=()=>{if(!sel){const who=Object.keys(place).find(o=>place[o]===t);if(who){delete place[who];SFX.wing();draw();return}toast('Tipp zuerst auf eine Eule.');return}for(const o in place)if(place[o]===t)delete place[o];place[sel]=t;SFX.wing();sel=null;row.querySelectorAll('.owlbtn').forEach(x=>x.classList.remove('sel'));draw()};tw.appendChild(b);tb[t]=b});
  if(ctx.solved)Object.assign(place,w.sol);draw();
  const go=btn('Eulen losschicken','');go.onclick=()=>{if(Object.keys(place).length<3){toast('Jede Eule braucht einen Turm.');return}if(w.owls.every(o=>place[o]===w.sol[o])){SFX.wing();setTimeout(()=>SFX.magic(),400);ctx.check('__OK__')}else ctx.check('x')};
  ctx.noInput=true;ctx.W.append(row,tw,go)},
 // 19 Laternen
 lanterns(ctx){const w=ctx.D.w,g=el('div','lanterns kz-lanterns');const B={};let seq=[],busy=false;
  const lite=(L,ms)=>{const b=B[L];b.classList.add('lit');SFX.lantern(.35);bell(440*Math.pow(2,'CTLAHI'.indexOf(L)/7),1,.1);setTimeout(()=>b.classList.remove('lit'),ms||500)};
  w.l.forEach(L=>{const b=el('button','lantern kz-lantern','<span><img src="z/o_laterne_aus.webp" class="off" alt=""><img src="z/o_laterne_an.webp" class="on" alt=""></span><b>'+L+'</b>');b.onclick=()=>{if(busy)return;ac();lite(L,350);seq.push(L);const tgt=w.word.slice(0,seq.length);if(seq.join('')!==tgt){SFX.no();seq=[];toast('Die Laternen flackern und gehen aus. Lass sie noch einmal leuchten.');return}if(seq.length===w.word.length){SFX.magic();setTimeout(()=>ctx.check('__OK__'),600)}};g.appendChild(b);B[L]=b});
  const go=btn(IC.lantern+' Leuchten lassen','');go.onclick=async()=>{if(busy)return;ac();busy=true;seq=[];for(const L of w.word){await sleep(250);lite(L,550);await sleep(550)}busy=false};
  if(ctx.solved)w.word.split('').forEach(L=>B[L].classList.add('lit'));ctx.noInput=true;ctx.W.append(g,go)},
 // 20 Kreuzwort
 cross(ctx){const w=ctx.D.w,box=el('div','xw kz-xw');box.innerHTML='<div class="kz-paper">DER RABENFELSER EULENBOTE<small>Winterausgabe · Rätselecke</small></div>';const mg=Math.max(...w.rows.map(r=>r[1]));const all=[];
  w.rows.forEach(([word,gi,clue],ri)=>{const row=el('div','xrow');row.appendChild(el('span','n',ri+1));for(let k=0;k<mg-gi;k++){const sp=el('span');sp.style.width='38px';row.appendChild(sp)}
   const ins=[];for(let k=0;k<word.length;k++){const i=el('input');i.maxLength=1;i.setAttribute('autocapitalize','characters');i.autocomplete='off';i.spellcheck=false;if(k===gi)i.classList.add('g');if(ctx.solved)i.value=word[k];
    i.oninput=()=>{i.value=i.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g,'').slice(-1);if(i.value){SFX.quill(.5);const nx=ins[k+1];if(nx)nx.focus()}const cur=ins.map(x=>x.value).join('');if(cur===word){ins.forEach(x=>x.classList.add('ok'));bell(880+ri*110,.8,.08)}else ins.forEach(x=>x.classList.remove('ok'));test()};
    i.onkeydown=e=>{if(e.key==='Backspace'&&!i.value&&ins[k-1])ins[k-1].focus()};ins.push(i);row.appendChild(i)}all.push([word,ins]);box.appendChild(row)});
  const cl=el('div','xclues');w.rows.forEach(([w2,g2,c],i)=>cl.appendChild(el('div','','<b>'+(i+1)+'</b> '+c+' ('+w2.length+')')));
  function test(){if(all.every(([wd,ins])=>ins.map(x=>x.value).join('')===wd)){SFX.magic();toast('Alles richtig! Lies die goldenen Felder.')}}
  ctx.W.append(box,cl)},
 // 21 Unterschiede
 diff(ctx){const D=[[61,43,4.5,'hue-rotate(200deg) saturate(1.4)','Schleife'],[39,71,5,'hue-rotate(120deg)','Schal'],[24,74,0,'pip','Pip'],[90,8,0,'star','Mond'],[49.5,46,3.4,'hue-rotate(170deg) saturate(1.6)','Laterne'],[45,14,5.5,'hue-rotate(150deg) saturate(1.3)','Fahne'],[4.5,35,3,'hue-rotate(110deg)','Kugel'],[22,52,0,'candle','Kerze']];
  const pic=v=>{const d=el('div','kz-diff','<img src="z/t_hof.jpg" alt="">');if(v)D.forEach(([x,y,r,f])=>{let o;if(f==='pip'){o=el('img','kz-dspr');o.src='ic/pip_sleep.webp';o.style.cssText='left:'+(x-4)+'%;top:'+(y-4)+'%;width:9%'}else if(f==='star'){o=el('img','kz-dspr');o.src='ic/moon.webp';o.style.cssText='left:'+(x-3.5)+'%;top:'+(y-5)+'%;width:7%;filter:drop-shadow(0 0 8px #ffd76a)'}else if(f==='candle'){o=el('img','kz-dspr');o.src='ic/candle.webp';o.style.cssText='left:'+(x-2.5)+'%;top:'+(y-6)+'%;width:5%;filter:drop-shadow(0 0 8px #ffb347)'}else{o=el('div','kz-patch');const A=1744/2336,hp=2*r/A,top=y-r/A;o.style.cssText='left:'+(x-r)+'%;top:'+top+'%;width:'+(2*r)+'%;height:'+hp+'%;background-size:'+(10000/(2*r))+'% auto;background-position:'+((x-r)/(100-2*r)*100)+'% '+(top/(100-hp)*100)+'%;filter:'+f}d.appendChild(o)});return d};
  const a=pic(0),b=pic(1);const found=new Set();const cnt=el('div','wlab','Gefunden: 0 von ?');
  b.addEventListener('click',e=>{ac();const r=b.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;let hit=-1;D.forEach((d,i)=>{const dx=(d[0]-x),dy=(d[1]-y)*r.height/r.width;if(Math.hypot(dx,dy)<Math.max(d[2],4.5)+2)hit=i});
   if(hit<0||found.has(hit)){if(hit<0)SFX.tap();return}found.add(hit);const m=el('i','kz-mark');m.style.left=D[hit][0]+'%';m.style.top=D[hit][1]+'%';b.appendChild(m);SFX.twinkle(.5);cnt.textContent='Gefunden: '+found.size+' von ?';
   if(found.size===D.length){cnt.textContent='Alle '+D.length+' Unterschiede gefunden!';SFX.magic();setTimeout(()=>ctx.check('__OK__'),900)}});
  if(ctx.solved)D.forEach((d,i)=>{found.add(i);const m=el('i','kz-mark');m.style.left=d[0]+'%';m.style.top=d[1]+'%';b.appendChild(m)});
  ctx.W.append(lab('Original'),a,lab('Verzaubert'),b,cnt,numtab())},
 // 22 Pixel
 pixel(ctx){const g=el('div','pix kz-pix');ctx.D.w.grid.forEach(r=>r.forEach(n=>{const b=el('button','',n);if(ctx.solved&&n%3===0)b.classList.add('on');b.onclick=()=>{ac();b.classList.toggle('on');SFX.tick();if(b.classList.contains('on'))SFX.twinkle(.25)};g.appendChild(b)}));ctx.W.appendChild(g)},
 // 23 Tresor
 dial(ctx){const w=ctx.D.w,N=30;const box=el('div','dialw');const s=sv('svg',{viewBox:'-110 -122 220 232'});box.appendChild(s);
  s.appendChild(sv('path',{d:'M0 -104 l-9 -15 h18Z',fill:'#8a2a3a',stroke:'#f6d78a','stroke-width':1}));
  const g=sv('g',{});g.appendChild(sv('image',{href:'z/o_tresorrad.webp',x:-104,y:-104,width:208,height:208}));g.appendChild(sv('circle',{r:76,fill:'#1d1730',opacity:.82}));for(let i=0;i<N;i++){const a=i/N*Math.PI*2;g.appendChild(sv('line',{x1:Math.sin(a)*92,y1:-Math.cos(a)*92,x2:Math.sin(a)*(i%5?86:80),y2:-Math.cos(a)*(i%5?86:80),stroke:'#e0b961','stroke-width':i%5?1.5:3}));if(i%1===0)g.appendChild(sv('text',{x:Math.sin(a)*68,y:-Math.cos(a)*68+5,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':i%5?10:14,fill:'#f1d690',opacity:i%5?.7:1},i))}
  g.appendChild(sv('circle',{r:42,fill:'#c9963a',stroke:'#5a3d14','stroke-width':2}));g.appendChild(sv('rect',{x:-7,y:-38,width:14,height:76,rx:7,fill:'#7a5420'}));s.appendChild(g);
  let v=ctx.solved?w.n:0,on=false,a0=0,v0=0;const draw=()=>{g.setAttribute('transform','rotate('+(-v*360/N)+')');num.textContent=v};const ang=e=>{const [x,y]=svgPt(s,e);return Math.atan2(x,-y)};
  s.addEventListener('pointerdown',e=>{ac();on=true;a0=ang(e);v0=v});addEventListener('pointermove',e=>{if(!on)return;let d=(ang(e)-a0)*N/(2*Math.PI);let nv=Math.round(v0-d);nv=((nv%N)+N)%N;if(nv!==v){v=nv;SFX.tick();draw()}});addEventListener('pointerup',()=>on=false);
  const num=el('b','');const c=el('div','ctrl');const l=el('button','btn ghost sm',IC.left),r=el('button','btn ghost sm',IC.right);l.onclick=()=>{v=(v+N-1)%N;SFX.tick();draw()};r.onclick=()=>{v=(v+1)%N;SFX.tick();draw()};c.append(l,num,r);
  const go=btn('Tresor öffnen','');go.onclick=()=>{if(v===w.n){SFX.lock();setTimeout(()=>SFX.magic(),600);ctx.check('__OK__')}else{SFX.tick();ctx.check('x')}};
  ctx.noInput=true;ctx.W.append(box,c,go,numtab());draw()},
 // 24 Lichtzeichen
 blink(ctx){const box=el('div','kz-blink');const tw=el('img','kz-bl-tower');tw.src='z/o_turm_nord.webp';tw.alt='Nordturm';
  const sp=el('div','kz-bl-glow');const ray=el('div','kz-bl-ray');const snow=el('div','kz-bl-snow');const tr=el('div','kz-bl-trail');
  box.append(snow,ray,tw,sp,tr);ctx.W.appendChild(box);let alive=true;const u=320;
  (async()=>{await sleep(900);while(alive){tr.innerHTML='';for(const ch of ctx.D.w.code){if(!document.body.contains(box)){alive=false;return}
   const L=ch==='.'?u:u*3;box.classList.add('on');const m=el('i',ch==='.'?'d':'l');tr.appendChild(m);requestAnimationFrame(()=>m.classList.add('in'));
   if(ctx._snd)tone(988,L/1000,'sine',.06);await sleep(L);box.classList.remove('on');await sleep(u)}await sleep(u*6)}})();
  const snd=btn(IC.bell+' Mit Ton','ghost sm');snd.onclick=()=>{ac();ctx._snd=!ctx._snd;snd.innerHTML=ctx._snd?IC.bellOff+' Ohne Ton':IC.bell+' Mit Ton'};
  const t=el('div','mtab kz-mtab');Object.entries(window.MORSE).forEach(([L,c])=>t.appendChild(el('div','','<b>'+L+'</b><span>'+c.replace(/\./g,'<i class="d"></i>').replace(/-/g,'<i class="l"></i>')+'</span>')));
  ctx.W.append(snd,lab('Lichttafel'),t)}
};
function numtab(){const t=el('div','numtab');t.style.marginTop='12px';'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c,i)=>t.appendChild(el('div','','<b>'+c+'</b><br>'+(i+1))));return t}
})();
