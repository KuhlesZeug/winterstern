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
 return {clear(){x.clearRect(0,0,W,H)}}}

window.WIDGETS={
 // 1 Zaubertinte
 ink(ctx){const s=el('div','scratch');const t=el('div','inktext',ctx.D.w.text);s.appendChild(t);ctx.W.append(s,lab('Reibe über das Pergament'));
  const sc=scratch(s,(x,W,H)=>{const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f6ecd4');g.addColorStop(1,'#e6d4ab');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalAlpha=.12;for(let i=0;i<200;i++){x.fillStyle=Math.random()<.5?'#a07a3a':'#fff';x.fillRect(Math.random()*W,Math.random()*H,2,2)}x.globalAlpha=1},()=>{sc.clear();SFX.magic()});
  if(ctx.solved)setTimeout(()=>sc.clear(),50)},
 // 2 Kessel
 cauldron(ctx){const w=ctx.D.w,box=el('div','cauld'),seq=el('div','seqline','');let got=[];
  const pot=sv('svg',{viewBox:'0 0 190 120',class:'pot'});pot.innerHTML='<ellipse cx="95" cy="22" rx="80" ry="14" fill="#1b1430"/><path d="M15 22 Q10 100 60 112 L130 112 Q180 100 175 22Z" fill="#2a2140"/><ellipse id="brew" cx="95" cy="24" rx="72" ry="10" fill="#6b9f5a"/><ellipse cx="95" cy="22" rx="80" ry="14" fill="none" stroke="#4b3f68" stroke-width="5"/><path d="M60 112 l-14 8 M130 112 l14 8" stroke="#1b1430" stroke-width="6"/><g fill="#ff9a3a" opacity=".85"><path d="M70 120 q6 -14 12 0Z"/><path d="M90 120 q6 -18 12 0Z"/><path d="M110 120 q6 -14 12 0Z"/></g>';
  const steam=el('div','steam','');box.append(pot,steam);const brew=pot.querySelector('#brew');
  const parts=w.items.map((it,i)=>{const d=el('div','ingr','<div class="dot" style="background:'+it[1]+'">'+it[2]+'</div><small>'+it[0]+'</small>');d.style.left=(i*25)+'%';box.appendChild(d);d.dataset.i=i;return d});
  const reset=()=>{got=[];seq.textContent='';parts.forEach(p=>{p.classList.remove('used');p.style.transform=''});brew.setAttribute('fill','#6b9f5a')};
  const drop=(p)=>{const it=w.items[+p.dataset.i];p.classList.add('used');p.style.transform='';got.push(it[2]);seq.textContent=got.join(' ');SFX.bubble();brew.setAttribute('fill',it[1]);
   if(got.length===w.items.length){const word=got.join('');if(word===w.sol){steam.innerHTML=IC.hedgehog+' '+word;steam.classList.add('on');SFX.magic();setTimeout(()=>ctx.check(word),1400)}else{SFX.no();toast('Puff! Schwarzer Rauch. Die Reihenfolge stimmt nicht.');brew.setAttribute('fill','#222');setTimeout(reset,1300)}}};
  parts.forEach(p=>{let sx=0,sy=0,dr=false,moved=false;
   p.addEventListener('pointerdown',e=>{ac();dr=true;moved=false;sx=e.clientX;sy=e.clientY;p.setPointerCapture(e.pointerId)});
   p.addEventListener('pointermove',e=>{if(!dr)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.hypot(dx,dy)>6)moved=true;p.style.transform='translate('+dx+'px,'+dy+'px) scale(1.1)'});
   p.addEventListener('pointerup',e=>{if(!dr)return;dr=false;const r=pot.getBoundingClientRect();const inPot=e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top-40&&e.clientY<r.bottom;if(!moved||inPot)drop(p);else p.style.transform=''})});
  if(ctx.solved){steam.innerHTML=IC.hedgehog+' '+w.sol;steam.classList.add('on')}
  ctx.W.append(box,seq,lab('Zieh oder tipp die Zutaten in den Kessel'));const r=btn('Kessel leeren','ghost sm');r.onclick=()=>{SFX.bubble();reset();steam.classList.remove('on')};ctx.W.appendChild(r)},
 // 3 Runenrad
 wheel(ctx){const w=ctx.D.w,A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';ctx.W.appendChild(lab('Geheime Botschaft'));ctx.W.appendChild(el('div','codeword',w.code));
  const s=sv('svg',{viewBox:'-150 -150 300 300',class:'wheel'});s.appendChild(sv('circle',{r:146,fill:'#c9a24e',stroke:'#7a5a26','stroke-width':3}));s.appendChild(sv('circle',{r:122,fill:'#f2e3b8',stroke:'#7a5a26'}));
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2;if(i===3)s.appendChild(sv('circle',{cx:Math.sin(a)*134,cy:-Math.cos(a)*134,r:11,fill:'#8a2a3a'}));s.appendChild(sv('text',{x:Math.sin(a)*134,y:-Math.cos(a)*134+5,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':14,fill:i===3?'#fff':'#2b2340'},A[i]))}
  const g=sv('g',{});g.appendChild(sv('circle',{r:118,fill:'#1d2f6b'}));g.appendChild(sv('circle',{r:92,fill:'#14204f',stroke:'#e0b961','stroke-width':1}));
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2;if(i===0)g.appendChild(sv('circle',{cx:0,cy:-106,r:11,fill:'none',stroke:'#ffd76a','stroke-width':2.5}));g.appendChild(sv('text',{x:Math.sin(a)*106,y:-Math.cos(a)*106+5,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':i===0?16:14,fill:i===0?'#ffd76a':'#f1d690'},A[i]))}
  g.appendChild(sv('path',{d:starPath(30,8),fill:'#e0b961',opacity:.8}));s.appendChild(g);s.appendChild(sv('path',{d:'M0 -150 l-7 -0 l7 14 l7 -14Z',fill:'#8a2a3a'}));
  let rot=ctx.solved?w.key:7,drag=false,a0=0,r0=0;const draw=()=>g.setAttribute('transform','rotate('+(rot*360/26)+')');draw();
  const ang=e=>{const [x,y]=svgPt(s,e);return Math.atan2(x,-y)};
  s.addEventListener('pointerdown',e=>{ac();drag=true;a0=ang(e);r0=rot});addEventListener('pointermove',e=>{if(!drag)return;const da=(ang(e)-a0)*26/(2*Math.PI);let nr=Math.round(r0+da);nr=((nr%26)+26)%26;if(nr!==rot){rot=nr;SFX.tick();draw()}});addEventListener('pointerup',()=>drag=false);
  ctx.W.appendChild(s);const c=el('div','ctrl');const l=el('button','btn ghost sm',IC.rotL),r=el('button','btn ghost sm',IC.rotR);l.onclick=()=>{rot=(rot+25)%26;SFX.tick();draw()};r.onclick=()=>{rot=(rot+1)%26;SFX.tick();draw()};c.append(l,r);ctx.W.appendChild(c)},
 // 4 Kristallkugel
 crystal(ctx){const b=el('div','ball'),sp=el('div','sphere');sp.appendChild(el('div','mw',ctx.D.w.word));b.append(sp,el('div','stand'));ctx.W.append(b,lab('Wisch die Kugel frei'));
  const sc=scratch(sp,(x,W,H)=>{const g=x.createRadialGradient(W*.4,H*.35,0,W/2,H/2,W*.6);g.addColorStop(0,'#eef3ff');g.addColorStop(1,'#a8b6da');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalAlpha=.25;for(let i=0;i<60;i++){x.fillStyle='#fff';x.beginPath();x.arc(Math.random()*W,Math.random()*H,Math.random()*W*.08,0,7);x.fill()}x.globalAlpha=1},()=>{sc.clear();SFX.magic()},30);
  if(ctx.solved)setTimeout(()=>sc.clear(),50)},
 // 5 Mondphasen
 moon(ctx){const w=ctx.D.w;const mk=p=>{const s=sv('svg',{viewBox:'-26 -26 52 52'});s.appendChild(sv('circle',{r:24,fill:'#1a2140',stroke:'#6b77a8','stroke-width':1}));
   const f=p%1;if(f!==0){const waxing=f<.5;const ill=waxing?f*2:(1-f)*2;const k=Math.cos(ill*Math.PI)*24;const sweep=waxing?1:0;
    const d='M0 -24 A24 24 0 0 '+sweep+' 0 24 A'+Math.abs(k)+' 24 0 0 '+(k>0?1-sweep:sweep)+' 0 -24Z';s.appendChild(sv('path',{d,fill:'#f6efcf'}))}
   else if(p===.5){}return s};
  const full=s=>{s.appendChild(sv('circle',{r:23,fill:'#f6efcf'}));return s};
  const mm=p=>p===.5?full(mk(0)):mk(p);
  const row=el('div','moons');w.seq.forEach(p=>{const d=el('div','m');if(p===null)d.appendChild(el('div','qmark','?'));else d.appendChild(p===1?mk(0):mm(p));row.appendChild(d)});
  ctx.W.append(row,lab('Welcher Mond gehört in die Lücke?'));
  const g=el('div','opts');g.style.gridTemplateColumns='repeat(4,1fr)';w.opts.forEach(([L,p])=>{const b=el('button','opt');b.appendChild(mm(p));b.querySelector('svg').style.width='46px';b.appendChild(el('span','lab',L));b.onclick=()=>{SFX.tap();g.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ctx.check(L===ctx.D.L?'__OK__':'x')};g.appendChild(b)});
  ctx.noInput=true;ctx.W.appendChild(g)},
 // 6 Porträts
 portraits(ctx){const w=ctx.D.w,f=el('div','frames'),bub=el('div','bubble','Tipp auf ein Porträt, dann spricht es.');
  w.p.forEach(([n,ic,t])=>{const d=el('button','frame','<div class="face">'+IC.bust(ic)+'</div><b>'+n+'</b>');d.onclick=()=>{ac();d.classList.remove('talk');void d.offsetWidth;d.classList.add('talk');bub.innerHTML='<b>'+n+':</b> „'+t+'“';for(let i=0;i<5;i++)tone(220+Math.random()*180,.08,'triangle',.05,i*.09)};f.appendChild(d)});
  const lf=el('div','lift');w.p.forEach(([n])=>{const b=el('button','btn ghost sm','Rahmen anheben');b.onclick=()=>{if(n===w.sol){SFX.magic();b.innerHTML=IC.key+' Schlüssel!';ctx.check('__OK__')}else{SFX.no();b.textContent='Nichts';toast('Hinter '+n+' ist nur Staub.')}};lf.appendChild(b)});
  ctx.noInput=true;ctx.W.append(f,bub,lf)},
 // 7 Treppen
 stairs(ctx){const T=[['I','L','L','L'],['L','I','I','L'],['L','I','L','I'],['I','L','L','I']];
  // Lösungsweg: (3,0)I n-s, (2,0)L s-e, (2,1)I w-e, (2,2)L w-n, (1,2)I s-n, (0,2)L s-e, (0,3)L w-n
  const R=[[0,1,2,1],[3,0,1,2],[2,1,1,3],[1,1,0,2]];
  const OPEN={I:[['n','s'],['e','w']],L:[['n','e'],['e','s'],['s','w'],['w','n']]};
  const op=(r,c)=>{const t=T[r][c];return OPEN[t][R[r][c]%(t==='I'?2:4)]};
  const fix={'3,0':0,'2,0':1,'2,1':1,'2,2':3,'1,2':0,'0,2':1,'0,3':3};
  if(ctx.solved)for(const k in fix){const [r,c]=k.split(',').map(Number);R[r][c]=fix[k]}
  const g=el('div','stairs');
  const top=el('div','send top','<span></span><span></span><span></span><span class="mark goal">'+IC.door+'<br>Sternwarte<br>ZIEL</span>');
  const bot=el('div','send bot','<span class="mark start">'+IC.up+'<br>START<br>Halle</span><span></span><span></span><span></span>');
  const DD={n:[-1,0],s:[1,0],e:[0,1],w:[0,-1]},OPP={n:'s',s:'n',e:'w',w:'e'};
  const reach=()=>{const seen=new Set();if(!op(3,0).includes('s'))return seen;seen.add('3,0');const q=[[3,0]];while(q.length){const [r,c]=q.shift();op(r,c).forEach(d=>{const nr=r+DD[d][0],nc=c+DD[d][1];if(nr<0||nr>3||nc<0||nc>3)return;if(!op(nr,nc).includes(OPP[d]))return;const k=nr+','+nc;if(!seen.has(k)){seen.add(k);q.push([nr,nc])}})}return seen};
  const draw=(b,r,c,lit)=>{const o=op(r,c);const P={n:[50,0],s:[50,100],e:[100,50],w:[0,50]};const a=P[o[0]],z=P[o[1]];const d='M'+a+' Q50 50 '+z;
   const col=lit?'#ffd76a':'#8a7c62',edge=lit?'#7a5a26':'#4f4636';
   let steps='';for(let i=1;i<9;i++){steps+='<path d="'+d+'" fill="none" stroke="'+edge+'" stroke-width="26" stroke-dasharray="1.6 '+(9)+'" stroke-dashoffset="'+(-i*0)+'"/>';break}
   b.innerHTML='<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="'+(lit?'#5d4f86':'#3b3256')+'"/><path d="M0 0h100v100h-100z" fill="none" stroke="#2a2140" stroke-width="3"/><path d="'+d+'" fill="none" stroke="#1d1630" stroke-width="36"/><path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="26" '+(lit?'style="filter:drop-shadow(0 0 5px #ffd76a)"':'')+'/>'+steps+'</svg>';
   b.classList.toggle('lit',!!lit)};
  const redraw=()=>{const R0=reach();cells.forEach((b,i)=>draw(b,i>>2,i&3,R0.has((i>>2)+','+(i&3))))};
  let won=false;const cells=[];
  const check=()=>{const R0=reach();return R0.has('0,3')&&op(0,3).includes('n')};
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const b=el('button','t');if(r===3&&c===0)b.classList.add('st');if(r===0&&c===3)b.classList.add('en');b.onclick=()=>{if(won)return;ac();R[r][c]++;noise(.12,500,3,.25);tone(160,.1,'sine',.15);redraw();if(check()){won=true;g.classList.add('ok');SFX.magic();top.querySelector('.goal').innerHTML=IC.door+'<br>Tür offen<br>Zeichen <b>S</b>';setTimeout(()=>ctx.check('__OK__'),900)}};g.appendChild(b);cells.push(b)}
  redraw();if(ctx.solved){won=true;g.classList.add('ok')}
  ctx.noInput=true;ctx.W.append(top,g,bot,lab('Leuchtende Stufen sind schon mit der Halle verbunden'))},
 // 8 Labyrinth
 maze(ctx){const w=ctx.D.w,N=6,box=el('div','maze');const s=sv('svg',{viewBox:'-4 -30 308 368'});box.appendChild(s);const C=50;
  s.appendChild(sv('rect',{x:-4,y:-4,width:308,height:308,rx:10,fill:'#2a2140'}));s.appendChild(sv('rect',{x:0,y:0,width:300,height:300,fill:'#3d335c'}));
  const trail=sv('g',{});s.appendChild(trail);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const o=w.open[r][c],x=c*C,y=r*C;const L=w.let[r][c];if(L!=='.')s.appendChild(sv('text',{x:x+25,y:y+33,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':22,fill:'#f1d690'},L));
   const wl=(x1,y1,x2,y2)=>s.appendChild(sv('line',{x1,y1,x2,y2,stroke:'#c9a24e','stroke-width':5,'stroke-linecap':'round'}));
   if(!o.includes('n')&&!(r===0&&c===N-1))wl(x,y,x+C,y);if(!o.includes('w'))wl(x,y,x,y+C);if(c===N-1&&!o.includes('e'))wl(x+C,y,x+C,y+C);if(r===N-1&&!o.includes('s')&&!(c===0))wl(x,y+C,x+C,y+C)}

  const glow=(x,y,col)=>{const g0=sv('rect',{x:x+3,y:y+3,width:44,height:44,rx:8,fill:col,opacity:.35});g0.innerHTML='<animate attributeName="opacity" values=".2;.5;.2" dur="1.8s" repeatCount="indefinite"/>';s.insertBefore(g0,trail)};
  glow(0,250,'#7fe0a0');glow(250,0,'#ffd76a');
  s.appendChild(sv('text',{x:25,y:322,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':16,fill:'#2f7a4a'},'START'));
  s.appendChild(sv('text',{x:275,y:-12,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':16,fill:'#9a6b14'},'ZIEL'));
  s.appendChild(sv('path',{d:'M18 300 h14',stroke:'#2f7a4a','stroke-width':4}));
  const goal=sv('g',{transform:'translate(259 8) scale(1.35)',color:'#ffd76a'});goal.innerHTML=IC.castleLine.replace('<svg class="ic"','<svg width="24" height="24"');s.appendChild(goal);
  const owl=sv('image',{href:'eule.png',width:46,height:33});s.appendChild(owl);
  let r=ctx.solved?0:5,c=ctx.solved?5:0;const pos=()=>{owl.setAttribute('x',c*C+2);owl.setAttribute('y',r*C+8)};pos();
  const D={n:[-1,0],s:[1,0],w:[0,-1],e:[0,1]};
  const mv=d=>{if(!w.open[r][c].includes(d)){SFX.no();return}trail.appendChild(sv('circle',{cx:c*C+25,cy:r*C+25,r:5,fill:'#e0b961',opacity:.5}));r+=D[d][0];c+=D[d][1];SFX.wing&&noise(.12,700,1.2,.12);pos();if(r===0&&c===5){SFX.magic();toast('Fenna ist am Turm! Welches Wort hat sie gesammelt?')}};
  const ar=el('div','arrows');ar.innerHTML='<span></span><button data-m="n">'+IC.up+'</button><span></span><button data-m="w">'+IC.left+'</button><button data-m="s">'+IC.down+'</button><button data-m="e">'+IC.right+'</button>';ar.onclick=e=>{const m=e.target.dataset.m;if(m){ac();mv(m)}};
  let sx=null,sy=null;box.addEventListener('pointerdown',e=>{ac();sx=e.clientX;sy=e.clientY});box.addEventListener('pointermove',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;const th=box.getBoundingClientRect().width/8;if(Math.abs(dx)>th||Math.abs(dy)>th){mv(Math.abs(dx)>Math.abs(dy)?(dx>0?'e':'w'):(dy>0?'s':'n'));sx=e.clientX;sy=e.clientY}});addEventListener('pointerup',()=>{sx=null});
  const rs=btn('Zurück zum Start','ghost sm');rs.onclick=()=>{r=5;c=0;trail.innerHTML='';pos()};
  ctx.W.append(box,ar,rs)},
 // 9 Spieluhr
 musicbox(ctx){const w=ctx.D.w,F={};w.bells.forEach(([L,f])=>F[L]=f);const mb=el('div','mbox');
  const s=sv('svg',{viewBox:'-80 -80 160 160',class:'crank'});s.innerHTML='<rect x="-70" y="-46" width="140" height="92" rx="12" fill="#6b4a2a" stroke="#3b2a16" stroke-width="3"/><rect x="-60" y="-36" width="120" height="72" rx="8" fill="#8a6236"/><circle r="28" fill="#c9a24e" stroke="#7a5a26" stroke-width="3"/>';
  const arm=sv('g',{});arm.innerHTML='<line x1="0" y1="0" x2="0" y2="-56" stroke="#e0b961" stroke-width="7" stroke-linecap="round"/><circle cy="-58" r="11" fill="#2a2140" stroke="#e0b961" stroke-width="3"/>';s.appendChild(arm);s.appendChild(sv('circle',{r:6,fill:'#2a2140'}));
  let ang=0,last=null,acc=0,ni=0;const draw=()=>arm.setAttribute('transform','rotate('+ang+')');draw();
  const at=e=>{const [x,y]=svgPt(s,e);return Math.atan2(x,-y)*180/Math.PI};let on=false;
  s.addEventListener('pointerdown',e=>{ac();on=true;last=at(e)});addEventListener('pointermove',e=>{if(!on)return;const a=at(e);let d=a-last;if(d>180)d-=360;if(d<-180)d+=360;last=a;if(d<0)return;ang+=d;acc+=d;draw();if(acc>=70){acc=0;const L=w.melody[ni%w.melody.length];bell(F[L],1.6,.16);ni++;if(ni%w.melody.length===0)ni+=0}});addEventListener('pointerup',()=>{on=false});
  mb.appendChild(s);ctx.W.append(mb,lab('Dreh die Kurbel im Uhrzeigersinn'));
  const play=btn(IC.right+' Melodie abspielen','ghost sm');play.onclick=()=>{ac();w.melody.split('').forEach((L,i)=>bell(F[L],1.5,.16,i*.6))};
  const bs=el('div','bells');w.bells.forEach(([L,f])=>{const b=el('button','','<span>'+IC.bell+'</span>'+L);b.onclick=()=>{ac();bell(f,1.5,.16);b.classList.remove('ring');void b.offsetWidth;b.classList.add('ring')};bs.appendChild(b)});
  ctx.W.append(lab('Die sechs Glocken'),bs,play)},
 // 10 Schneekugel
 globe(ctx){const wrap=el('div','globewrap');const s=sv('svg',{viewBox:'0 0 200 230',class:'globe'});
  s.innerHTML='<defs><radialGradient id="gb" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3a5aa8"/><stop offset="1" stop-color="#101a44"/></radialGradient></defs><circle cx="100" cy="100" r="92" fill="url(#gb)"/><path d="M40 150 Q100 130 160 150 L160 170 L40 170Z" fill="#e8eef8"/><g transform="translate(100 150)"><path d="M-14 0 L0 -40 L14 0Z" fill="#1f5a3a"/><path d="M-4 0 h8 v8 h-8Z" fill="#5a3a1a"/></g><circle cx="100" cy="100" r="92" fill="none" stroke="#cfe0ff" stroke-width="3" opacity=".6"/><ellipse cx="70" cy="58" rx="20" ry="10" fill="#fff" opacity=".18" transform="rotate(-30 70 58)"/><path d="M30 178 L170 178 L184 224 L16 224Z" fill="#6b4a2a"/><rect x="24" y="176" width="152" height="10" rx="4" fill="#c9a24e"/>';
  const cv=el('canvas');cv.width=400;cv.height=400;const tx=el('div','globetext',ctx.D.w.text);wrap.append(s,cv,tx);
  const meter=el('div','meter','<i></i>');ctx.W.append(wrap,meter,lab('Schütteln oder schnell hin und her wischen'));
  const x=cv.getContext('2d');const P=[];for(let i=0;i<140;i++)P.push({x:100+Math.random()*120-60,y:140+Math.random()*20,vx:0,vy:0});let E=ctx.solved?.6:0,alive=true;
  (function loop(){if(!alive)return;if(!document.body.contains(cv)){alive=false;return}x.clearRect(0,0,400,400);x.save();x.beginPath();x.arc(200,200,182,0,7);x.clip();x.fillStyle='#fff';
   P.forEach(p=>{if(E>.05&&Math.random()<E*.2){p.vx+=(Math.random()-.5)*E*3;p.vy-=Math.random()*E*3}p.vy+=.03;p.vx*=.96;p.vy*=.97;p.x+=p.vx;p.y+=p.vy;const dx=p.x-100,dy=p.y-100;if(Math.hypot(dx,dy)>88){p.vx*=-.5;p.vy*=-.5;p.x=100+dx*.97;p.y=100+dy*.97}if(p.y>146&&Math.abs(p.x-100)<60){p.y=146+Math.random()*4;p.vy=0}x.beginPath();x.arc(p.x*2,p.y*2,2.2,0,7);x.fill()});x.restore();
   E=Math.max(0,E-.004);tx.style.opacity=Math.max(0,Math.min(1,(E-.25)*3));meter.firstChild.style.width=Math.min(100,E*100)+'%';requestAnimationFrame(loop)})();
  const kick=a=>{E=Math.min(1,E+a);if(Math.random()<.5)noise(.08,5000,1,.04)};
  let lx=null,dir=0;wrap.addEventListener('pointerdown',e=>{ac();lx=e.clientX});wrap.addEventListener('pointermove',e=>{if(lx===null)return;const d=e.clientX-lx;if(Math.abs(d)>8){const nd=Math.sign(d);if(nd!==dir&&dir)kick(.14);dir=nd;lx=e.clientX}});addEventListener('pointerup',()=>{lx=null;dir=0});
  const mo=e=>{if(!document.body.contains(cv)){removeEventListener('devicemotion',mo);return}const a=e.accelerationIncludingGravity||e.acceleration;if(!a)return;const m=Math.hypot(a.x||0,a.y||0,a.z||0);if(m>16)kick((m-16)/40)};
  const sh=btn(IC.phone+' Schütteln erlauben','ghost sm');sh.onclick=async()=>{try{if(window.DeviceMotionEvent&&DeviceMotionEvent.requestPermission)await DeviceMotionEvent.requestPermission()}catch(e){}addEventListener('devicemotion',mo);sh.textContent='Jetzt schütteln!'};
  if(window.DeviceMotionEvent&&!DeviceMotionEvent.requestPermission)addEventListener('devicemotion',mo);ctx.W.appendChild(sh)},
 // 11 Kräuter Sudoku
 sudoku(ctx){const w=ctx.D.w,g=el('div','sudo'),cur=w.giv.map(r=>r.slice());if(ctx.solved)w.sol.forEach((r,i)=>cur[i]=r.slice());let won=ctx.solved;
  const paint=(b,v)=>{b.innerHTML=v?'<div class="herb" style="background:'+w.herbs[v-1][1]+'">'+w.herbs[v-1][2]+'</div><small>'+w.herbs[v-1][0]+'</small>':''};
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const b=el('button');const giv=w.giv[r][c]>0;if(giv)b.classList.add('giv');if(r===w.gold[0]&&c===w.gold[1])b.classList.add('gold');paint(b,cur[r][c]);
   b.onclick=()=>{if(giv||won)return;cur[r][c]=(cur[r][c]+1)%5;paint(b,cur[r][c]);noise(.06,2500,2,.08);
    if(cur.every(row=>row.every(v=>v>0))){if(cur.every((row,i)=>row.every((v,j)=>v===w.sol[i][j]))){won=true;SFX.magic();toast('Das Beet blüht! Im goldenen Feld wächst Nessel.');setTimeout(()=>ctx.check('__OK__'),900)}else{SFX.no();toast('Irgendwo wächst ein Kraut doppelt. Prüf Reihen, Spalten und Viertel.')}}};g.appendChild(b)}
  const lg=el('div','legend');w.herbs.forEach(h=>lg.appendChild(el('span','','<i style="background:'+h[1]+'"></i>'+h[0])));ctx.noInput=true;ctx.W.append(g,lg)},
 // 12 Waage
 scale(ctx){const w=ctx.D.w;let n=ctx.solved?w.n:0;const rc=el('div','recipe','<div>'+IC.egg+' Drachenei = '+IC.crystal+IC.crystal+' + '+IC.moonstone+'</div><div>'+IC.crystal+' Kristall = '+IC.moonstone+IC.moonstone+'</div>');
  const s=sv('svg',{viewBox:'0 0 320 210',class:'scale'});s.innerHTML='<rect x="150" y="60" width="20" height="130" fill="#7a5a26"/><rect x="100" y="186" width="120" height="14" rx="6" fill="#5a4220"/><path d="M160 46 l-12 16 h24Z" fill="#c9a24e"/>';
  const beam=sv('g',{});beam.innerHTML='<rect x="30" y="56" width="260" height="8" rx="4" fill="#c9a24e"/><line x1="50" y1="60" x2="50" y2="120" stroke="#7a5a26" stroke-width="2"/><line x1="270" y1="60" x2="270" y2="120" stroke="#7a5a26" stroke-width="2"/>';s.appendChild(beam);
  const lp=sv('g',{}),rp=sv('g',{});s.append(lp,rp);
  const draw=()=>{const tilt=Math.max(-14,Math.min(14,(w.n-n)*3));beam.setAttribute('transform','rotate('+(-tilt)+' 160 60)');const dy=Math.sin(tilt*Math.PI/180)*110;
   lp.setAttribute('transform','translate(50 '+(120+dy)+')');rp.setAttribute('transform','translate(270 '+(120-dy)+')');
   lp.innerHTML='<path d="M-40 0 h80 l-10 14 h-60Z" fill="#c9a24e"/><image href="ic/egg.webp" x="-22" y="-46" width="44" height="46"/>';
   let t='';for(let i=0;i<n;i++)t+='<image href="ic/moonstone.webp" x="'+((i%4)*18-27-9)+'" y="'+(-9-Math.floor(i/4)*16-9)+'" width="18" height="18"/>';rp.innerHTML='<path d="M-40 0 h80 l-10 14 h-60Z" fill="#c9a24e"/>'+t;
   num.textContent=n};
  const c=el('div','ctrl');const m=el('button','btn ghost sm','− Stein'),num=el('b','',''),p=el('button','btn ghost sm','+ Stein');c.append(m,num,p);
  let tm=null;const chg=d=>{n=Math.max(0,Math.min(10,n+d));SFX.tick();tone(300+n*40,.12,'sine',.1);draw();clearTimeout(tm);if(n===w.n){tm=setTimeout(()=>{SFX.magic();toast('Die Waage steht ganz still. '+n+' Mondsteine!');setTimeout(()=>ctx.check('__OK__'),700)},700)}};
  m.onclick=()=>chg(-1);p.onclick=()=>chg(1);ctx.noInput=true;ctx.W.append(rc,s,c,numtab());draw()},
 // 13 Kerze
 candle(ctx){const cave=el('div','cave');cave.append(el('div','insc',ctx.D.w.text),el('div','dark'),el('div','flame',IC.candle));
  const set=e=>{const r=cave.getBoundingClientRect();cave.style.setProperty('--x',(e.clientX-r.left)+'px');cave.style.setProperty('--y',(e.clientY-r.top)+'px')};
  cave.addEventListener('pointerdown',e=>{ac();noise(.4,1200,.6,.08);set(e)});cave.addEventListener('pointermove',set);
  if(ctx.solved)cave.querySelector('.dark').style.display='none';ctx.W.append(cave,lab('Kerze mit dem Finger bewegen'))},
 // 14 Fernrohr
 scope(ctx){const box=el('div','scopebox');const s=sv('svg',{viewBox:'0 0 360 260'});box.appendChild(s);
  const C=[['Schwan',[[161,53],[174,85],[186,115],[199,146],[155,94],[137,103],[193,75],[210,67]],[[0,1],[1,2],[2,3],[1,4],[4,5],[1,6],[6,7]],[180,100]],
   ['Leier',[[60,60],[48,90],[72,98],[58,128],[84,134]],[[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]],[66,100]],
   ['Krone',[[260,190],[280,205],[302,212],[324,206],[340,190],[300,190]],[[0,1],[1,2],[2,3],[3,4]],[300,200]],
   ['Drache',[[290,40],[310,60],[300,90],[270,100],[250,130],[262,158]],[[0,1],[1,2],[2,3],[3,4],[4,5]],[285,95]],
   ['Kassiopeia',[[40,200],[62,176],[86,198],[110,172],[132,196]],[[0,1],[1,2],[2,3],[3,4]],[86,190]]];
  s.innerHTML='<rect width="360" height="260" fill="#050818"/>';let bg='';for(let i=0;i<90;i++)bg+='<circle cx="'+(Math.random()*360).toFixed(0)+'" cy="'+(Math.random()*260).toFixed(0)+'" r=".6" fill="#fff" opacity=".25"/>';s.insertAdjacentHTML('beforeend',bg);
  const cid='sc'+Math.random().toString(36).slice(2);s.insertAdjacentHTML('beforeend','<defs><clipPath id="'+cid+'"><circle id="'+cid+'c" cx="180" cy="130" r="62"/></clipPath></defs>');
  const lay=sv('g',{'clip-path':'url(#'+cid+')'});lay.appendChild(sv('rect',{width:360,height:260,fill:'#0d1638'}));
  let det='';for(let i=0;i<160;i++)det+='<circle cx="'+(Math.random()*360).toFixed(1)+'" cy="'+(Math.random()*260).toFixed(1)+'" r="'+(Math.random()*.9+.3).toFixed(2)+'" fill="#fff" opacity=".7"/>';lay.insertAdjacentHTML('beforeend',det);
  C.forEach(([n,P,E])=>{E.forEach(([a,b])=>lay.appendChild(sv('line',{x1:P[a][0],y1:P[a][1],x2:P[b][0],y2:P[b][1],stroke:'#8fb0ff','stroke-width':1,opacity:.6})));P.forEach(p=>lay.appendChild(sv('circle',{cx:p[0],cy:p[1],r:3.2,fill:'#fff'})))});
  s.appendChild(lay);const ring=sv('circle',{cx:180,cy:130,r:62,fill:'none',stroke:'#c9a24e','stroke-width':5});s.appendChild(ring);const cross=sv('g',{opacity:.35});s.appendChild(cross);
  const label=sv('text',{x:180,y:250,'text-anchor':'middle','font-family':'Cinzel','font-size':16,fill:'#f1d690'},'');s.appendChild(label);
  const clip=s.querySelector('#'+cid+'c');let cx=180,cy=130;const mvTo=(x,y)=>{cx=Math.max(20,Math.min(340,x));cy=Math.max(20,Math.min(240,y));clip.setAttribute('cx',cx);clip.setAttribute('cy',cy);ring.setAttribute('cx',cx);ring.setAttribute('cy',cy);cross.innerHTML='<line x1="'+(cx-62)+'" y1="'+cy+'" x2="'+(cx+62)+'" y2="'+cy+'" stroke="#c9a24e"/><line x1="'+cx+'" y1="'+(cy-62)+'" x2="'+cx+'" y2="'+(cy+62)+'" stroke="#c9a24e"/>'};mvTo(210,240);
  let dn=false,moved=false,st0=null;
  s.addEventListener('pointerdown',e=>{ac();dn=true;moved=false;st0=svgPt(s,e)});s.addEventListener('pointermove',e=>{if(!dn)return;const p=svgPt(s,e);if(Math.hypot(p[0]-st0[0],p[1]-st0[1])>6)moved=true;if(moved)mvTo(p[0],p[1]-40)});
  s.addEventListener('pointerup',e=>{dn=false;if(moved)return;const [x,y]=svgPt(s,e);if(Math.hypot(x-cx,y-cy)>62){toast('Schau zuerst durch das Fernrohr.');return}
   let best=null,bd=60;C.forEach(c=>{const d=Math.hypot(c[3][0]-x,c[3][1]-y);c[1].forEach(p=>{const dd=Math.hypot(p[0]-x,p[1]-y);if(dd<bd){bd=dd;best=c}})});
   if(!best){SFX.tap();return}label.textContent=best[0];if(best[0]==='Schwan'){SFX.magic();ctx.check('__OK__')}else{SFX.no();toast('Das ist '+(best[0]==='Krone'||best[0]==='Leier'?'die ':best[0]==='Kassiopeia'?'':'der ')+best[0]+'. Gesucht ist ein Kreuz.')}});
  addEventListener('pointerup',()=>dn=false);s.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
  ctx.noInput=true;ctx.W.append(box,lab('Ziehen bewegt das Fernrohr, tippen wählt ein Sternbild'))},
 // 15 Schloss
 lock(ctx){const w=ctx.D.w;const cl=el('div','clues');w.clues.forEach(([c,t])=>cl.appendChild(el('div','','<b>'+c+'</b><span>'+t+'</span>')));
  const v=ctx.solved?w.code.split('').map(Number):[0,0,0];const lw=el('div','lockw');const chest=el('div','chest',ctx.solved?IC.key:IC.chest);
  v.forEach((x,i)=>{const r=el('div','ring');const u=el('button','',IC.up),b=el('b','',x),d=el('button','',IC.down);const set=k=>{v[i]=(v[i]+k+10)%10;b.textContent=v[i];SFX.tick();tone(900,.03,'square',.03)};u.onclick=()=>set(1);d.onclick=()=>set(-1);
   let sy=null;b.addEventListener('pointerdown',e=>{sy=e.clientY});b.addEventListener('pointermove',e=>{if(sy===null)return;if(Math.abs(e.clientY-sy)>18){set(e.clientY<sy?1:-1);sy=e.clientY}});addEventListener('pointerup',()=>sy=null);b.style.touchAction='none';
   r.append(u,b,d);lw.appendChild(r)});
  const go=btn('Kästchen öffnen','');go.onclick=()=>{if(v.join('')===w.code){SFX.magic();chest.innerHTML=IC.key+'<b> T</b>';chest.style.transform='scale(1.2)';ctx.check('__OK__')}else{noise(.15,400,4,.3);ctx.check('x')}};
  ctx.noInput=true;ctx.W.append(cl,lw,go,chest)},
 // 16 Bücher
 books(ctx){const w=ctx.D.w,sh=el('div','shelf');let arr=ctx.solved?w.b.slice().sort((a,b)=>a[1]-b[1]):w.b.slice();const cols=['#6b2a3a','#2f4f96','#3f6b3a','#7a5a26'];let sel=-1;
  const draw=()=>{sh.innerHTML='';arr.forEach((b,i)=>{const e=el('button','book',b[0]);e.style.height=(70+b[1]*24)+'px';e.style.background=cols[b[1]-1];if(i===sel)e.classList.add('sel');e.onclick=()=>{ac();if(sel<0){sel=i;SFX.tap()}else{if(sel!==i){[arr[sel],arr[i]]=[arr[i],arr[sel]];noise(.2,1500,1,.15)}sel=-1}draw()};sh.appendChild(e)})};draw();ctx.W.append(sh,lab('Vom kleinsten zum größten'))},
 // 17 Muster
 pattern(ctx){const s=sv('svg',{viewBox:'0 0 240 240',class:'dots'});const P=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)P.push([40+c*80,40+r*80]);
  s.appendChild(sv('rect',{width:240,height:240,rx:16,fill:'#1d2f6b'}));const lines=sv('g',{});s.appendChild(lines);const live=sv('line',{stroke:'#fff3c4','stroke-width':6,'stroke-linecap':'round',opacity:.6});s.appendChild(live);
  P.forEach((p,i)=>{s.appendChild(sv('circle',{cx:p[0],cy:p[1],r:14,fill:'#e0b961'}));s.appendChild(sv('text',{x:p[0],y:p[1]+5,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':14,fill:'#1d2f6b'},i+1))});
  let cur=-1,on=false;const near=p=>{let b=-1;P.forEach((q,i)=>{if(Math.hypot(q[0]-p[0],q[1]-p[1])<26)b=i});return b};
  const add=(a,b)=>{lines.appendChild(sv('line',{x1:P[a][0],y1:P[a][1],x2:P[b][0],y2:P[b][1],stroke:'#fff3c4','stroke-width':7,'stroke-linecap':'round',style:'filter:drop-shadow(0 0 4px #ffd56a)'}));bell(600+b*80,.8,.08)};
  s.addEventListener('pointerdown',e=>{ac();const p=svgPt(s,e);const k=near(p);if(k>=0){cur=k;on=true;bell(600+k*80,.6,.06)}});
  s.addEventListener('pointermove',e=>{if(!on)return;const p=svgPt(s,e);live.setAttribute('x1',P[cur][0]);live.setAttribute('y1',P[cur][1]);live.setAttribute('x2',p[0]);live.setAttribute('y2',p[1]);const k=near(p);if(k>=0&&k!==cur){add(cur,k);cur=k}});
  addEventListener('pointerup',()=>{on=false;live.setAttribute('x2',live.getAttribute('x1')||0);live.setAttribute('y2',live.getAttribute('y1')||0)});s.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
  if(ctx.solved){add(6,1);add(1,8);add(3,5)}
  const rs=btn('Neu zeichnen','ghost sm');rs.onclick=()=>{lines.innerHTML='';SFX.whoosh()};ctx.W.append(s,lab('Muster: 7, 2, 9, dann 4, 6'),rs)},
 // 18 Eulen
 owls(ctx){const w=ctx.D.w,row=el('div','owlrow'),tw=el('div','towers');const place={};let sel=null;const ob={},tb={};
  w.owls.forEach(o=>{const b=el('button','owlbtn','<img src="eule.png" alt="">'+o);b.onclick=()=>{SFX.tap();sel=o;row.querySelectorAll('.owlbtn').forEach(x=>x.classList.toggle('sel',x===b))};row.appendChild(b);ob[o]=b});
  const draw=()=>{w.towers.forEach(t=>{const who=Object.keys(place).find(o=>place[o]===t);tb[t].querySelector('.slot').innerHTML=who?'<img src="eule.png" alt="" style="width:48px"><br><small>'+who+'</small>':'';});w.owls.forEach(o=>ob[o].classList.toggle('placed',!!place[o]))};
  w.towers.forEach(t=>{const b=el('button','tower','<div class="slot"></div><div class="tw">'+IC.castle+'</div><small>'+t+'</small>');b.onclick=()=>{if(!sel){toast('Tipp zuerst auf eine Eule.');return}for(const o in place)if(place[o]===t)delete place[o];place[sel]=t;SFX.wing();sel=null;row.querySelectorAll('.owlbtn').forEach(x=>x.classList.remove('sel'));draw()};tw.appendChild(b);tb[t]=b});
  if(ctx.solved)Object.assign(place,w.sol);draw();
  const go=btn('Eulen losschicken','');go.onclick=()=>{if(Object.keys(place).length<3){toast('Jede Eule braucht einen Turm.');return}if(w.owls.every(o=>place[o]===w.sol[o])){SFX.magic();ctx.check('__OK__')}else ctx.check('x')};
  ctx.noInput=true;ctx.W.append(row,tw,go)},
 // 19 Laternen
 lanterns(ctx){const w=ctx.D.w,g=el('div','lanterns');const B={};let seq=[],busy=false;
  const lite=(L,ms)=>{const b=B[L];b.classList.add('lit');bell(440*Math.pow(2,'CTLAHI'.indexOf(L)/7),1,.12);setTimeout(()=>b.classList.remove('lit'),ms||500)};
  w.l.forEach(L=>{const b=el('button','lantern','<span>'+IC.lantern+'</span>'+L);b.onclick=()=>{if(busy)return;ac();lite(L,350);seq.push(L);const tgt=w.word.slice(0,seq.length);if(seq.join('')!==tgt){SFX.no();seq=[];toast('Die Laternen flackern und gehen aus. Lass sie noch einmal leuchten.');return}if(seq.length===w.word.length){SFX.magic();setTimeout(()=>ctx.check('__OK__'),600)}};g.appendChild(b);B[L]=b});
  const go=btn(IC.lantern+' Leuchten lassen','');go.onclick=async()=>{if(busy)return;ac();busy=true;seq=[];for(const L of w.word){await sleep(250);lite(L,550);await sleep(550)}busy=false};
  if(ctx.solved)w.word.split('').forEach(L=>B[L].classList.add('lit'));ctx.noInput=true;ctx.W.append(g,go)},
 // 20 Kreuzwort
 cross(ctx){const w=ctx.D.w,box=el('div','xw');const mg=Math.max(...w.rows.map(r=>r[1]));const all=[];
  w.rows.forEach(([word,gi,clue],ri)=>{const row=el('div','xrow');row.appendChild(el('span','n',ri+1));for(let k=0;k<mg-gi;k++){const sp=el('span');sp.style.width='38px';row.appendChild(sp)}
   const ins=[];for(let k=0;k<word.length;k++){const i=el('input');i.maxLength=1;i.setAttribute('autocapitalize','characters');i.autocomplete='off';i.spellcheck=false;if(k===gi)i.classList.add('g');if(ctx.solved)i.value=word[k];
    i.oninput=()=>{i.value=i.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g,'').slice(-1);if(i.value){noise(.03,4000,3,.05);const nx=ins[k+1];if(nx)nx.focus()}const cur=ins.map(x=>x.value).join('');if(cur===word){ins.forEach(x=>x.classList.add('ok'));bell(880+ri*110,.8,.08)}else ins.forEach(x=>x.classList.remove('ok'));test()};
    i.onkeydown=e=>{if(e.key==='Backspace'&&!i.value&&ins[k-1])ins[k-1].focus()};ins.push(i);row.appendChild(i)}all.push([word,ins]);box.appendChild(row)});
  const cl=el('div','xclues');w.rows.forEach(([w2,g2,c],i)=>cl.appendChild(el('div','','<b>'+(i+1)+'</b> '+c+' ('+w2.length+')')));
  function test(){if(all.every(([wd,ins])=>ins.map(x=>x.value).join('')===wd)){SFX.magic();toast('Alles richtig! Lies die goldenen Felder.')}}
  ctx.W.append(box,cl)},
 // 21 Unterschiede
 diff(ctx){const D=[[52,40,'Mond'],[150,26,'Stern'],[112,61,'Fahne'],[214,118,'Fenster'],[217,57,'Fahne rechts'],[40,130,'Baumspitze'],[268,151,'Schneemann'],[150,161,'Tor']];
  const scene=v=>{let s='<svg viewBox="0 0 300 200"><rect width="300" height="200" fill="#16224f"/>';
   s+=v?'<path d="M44 30 a14 14 0 1 0 14 24 a11 11 0 1 1 -14 -24Z" fill="#f6efcf"/>':'<circle cx="52" cy="40" r="13" fill="#f6efcf"/>';
   [[90,20],[200,30],[240,16],[120,50],[280,44]].forEach(p=>s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.6" fill="#fff"/>');if(v)s+='<path transform="translate(150 26)" d="'+starPath(6,5)+'" fill="#ffe08a"/>';
   s+='<rect x="0" y="170" width="300" height="30" fill="#e8eef8"/><rect x="90" y="100" width="34" height="70" fill="#3b3160"/><path d="M86 102 L107 70 L128 102Z" fill="#2a2140"/>';
   if(!v)s+='<line x1="107" y1="70" x2="107" y2="56" stroke="#c9a24e" stroke-width="2"/><path d="M107 56 l14 5 l-14 5Z" fill="#8a2a3a"/>';
   s+='<rect x="124" y="120" width="76" height="50" fill="#3b3160"/><rect x="200" y="96" width="34" height="74" fill="#3b3160"/><path d="M196 98 L217 64 L238 98Z" fill="#2a2140"/><line x1="217" y1="64" x2="217" y2="52" stroke="#c9a24e" stroke-width="2"/>';
   s+='<path d="M217 52 l'+(v?'-14':'14')+' 5 l'+(v?'14':'-14')+' 5Z" fill="#8a2a3a"/>';
   s+='<rect x="210" y="110" width="9" height="15" rx="3" fill="'+(v?'#1a2140':'#ffcf6a')+'"/><rect x="100" y="114" width="9" height="15" rx="3" fill="#ffcf6a"/><rect x="150" y="130" width="9" height="13" rx="3" fill="#ffcf6a"/>';
   s+='<path d="M140 170 v-16 a10 10 0 0 1 20 0 v16Z" fill="'+(v?'#2f6b3a':'#6b4a2a')+'"/>';
   s+='<path d="M20 172 L40 '+(v?'132':'126')+' L60 172Z" fill="#1f5a3a"/><rect x="37" y="170" width="6" height="8" fill="#5a3a1a"/>'+(v?'':'<path transform="translate(40 124)" d="'+starPath(6,5)+'" fill="#ffe08a"/>');
   s+='<circle cx="268" cy="176" r="10" fill="#fff"/><circle cx="268" cy="160" r="7" fill="#fff"/>'+(v?'':'<rect x="262" y="148" width="12" height="6" fill="#222"/><rect x="259" y="153" width="18" height="2" fill="#222"/>');
   return s+'</svg>'};
  const a=el('div','diffpic',scene(0)),b=el('div','diffpic',scene(1));const found=new Set();const cnt=el('div','wlab','Gefunden: 0 von ?');
  const s=b.querySelector('svg');s.addEventListener('click',e=>{ac();const [x,y]=svgPt(s,e);let hit=-1;D.forEach((d,i)=>{if(Math.hypot(d[0]-x,d[1]-y)<20)hit=i});
   if(hit<0||found.has(hit)){if(hit<0)SFX.tap();return}found.add(hit);s.appendChild(sv('circle',{cx:D[hit][0],cy:D[hit][1],r:15,fill:'none',stroke:'#ffd56a','stroke-width':3}));bell(700+found.size*90,.8,.1);cnt.textContent='Gefunden: '+found.size+' von ?';
   if(found.size===D.length){cnt.textContent='Alle '+D.length+' Unterschiede gefunden!';SFX.magic();setTimeout(()=>ctx.check('__OK__'),900)}});
  if(ctx.solved)D.forEach((d,i)=>{found.add(i);s.appendChild(sv('circle',{cx:d[0],cy:d[1],r:15,fill:'none',stroke:'#ffd56a','stroke-width':3}))});
  ctx.noInput=true;ctx.W.append(lab('Original'),a,lab('Verzaubert'),b,cnt,numtab())},
 // 22 Pixel
 pixel(ctx){const g=el('div','pix');ctx.D.w.grid.forEach(r=>r.forEach(n=>{const b=el('button','',n);if(ctx.solved&&n%3===0)b.classList.add('on');b.onclick=()=>{ac();b.classList.toggle('on');bell(b.classList.contains('on')?900:500,.4,.06)};g.appendChild(b)}));ctx.W.appendChild(g)},
 // 23 Tresor
 dial(ctx){const w=ctx.D.w,N=30;const box=el('div','dialw');const s=sv('svg',{viewBox:'-110 -122 220 232'});box.appendChild(s);
  s.appendChild(sv('path',{d:'M0 -104 l-8 -14 h16Z',fill:'#8a2a3a'}));s.appendChild(sv('circle',{r:100,fill:'#2a2140',stroke:'#c9a24e','stroke-width':4}));
  const g=sv('g',{});for(let i=0;i<N;i++){const a=i/N*Math.PI*2;g.appendChild(sv('line',{x1:Math.sin(a)*92,y1:-Math.cos(a)*92,x2:Math.sin(a)*(i%5?86:80),y2:-Math.cos(a)*(i%5?86:80),stroke:'#e0b961','stroke-width':i%5?1.5:3}));if(i%1===0)g.appendChild(sv('text',{x:Math.sin(a)*68,y:-Math.cos(a)*68+5,'text-anchor':'middle','font-family':'Cinzel','font-weight':700,'font-size':i%5?10:14,fill:'#f1d690',opacity:i%5?.7:1},i))}
  g.appendChild(sv('circle',{r:44,fill:'#3b3160',stroke:'#c9a24e','stroke-width':2}));g.appendChild(sv('rect',{x:-6,y:-40,width:12,height:80,rx:6,fill:'#c9a24e'}));s.appendChild(g);
  let v=ctx.solved?w.n:0,on=false,a0=0,v0=0;const draw=()=>{g.setAttribute('transform','rotate('+(-v*360/N)+')');num.textContent=v};const ang=e=>{const [x,y]=svgPt(s,e);return Math.atan2(x,-y)};
  s.addEventListener('pointerdown',e=>{ac();on=true;a0=ang(e);v0=v});addEventListener('pointermove',e=>{if(!on)return;let d=(ang(e)-a0)*N/(2*Math.PI);let nv=Math.round(v0-d);nv=((nv%N)+N)%N;if(nv!==v){v=nv;SFX.tick();draw()}});addEventListener('pointerup',()=>on=false);
  const num=el('b','');const c=el('div','ctrl');const l=el('button','btn ghost sm',IC.left),r=el('button','btn ghost sm',IC.right);l.onclick=()=>{v=(v+N-1)%N;SFX.tick();draw()};r.onclick=()=>{v=(v+1)%N;SFX.tick();draw()};c.append(l,num,r);
  const go=btn('Tresor öffnen','');go.onclick=()=>{if(v===w.n){SFX.magic();noise(.5,300,2,.3);ctx.check('__OK__')}else{noise(.15,300,4,.3);ctx.check('x')}};
  ctx.noInput=true;ctx.W.append(box,c,go,numtab());draw()},
 // 24 Lichtzeichen
 blink(ctx){const sp=el('div','spark');ctx.W.appendChild(sp);let alive=true;const u=300;
  (async()=>{while(alive){for(const ch of ctx.D.w.code){if(!document.body.contains(sp)){alive=false;return}sp.classList.add('on');if(ctx._snd)tone(880,(ch==='.'?u:u*3)/1000,'sine',.06);await sleep(ch==='.'?u:u*3);sp.classList.remove('on');await sleep(u)}await sleep(u*5)}})();
  const snd=btn(IC.bell+' Mit Ton','ghost sm');snd.onclick=()=>{ac();ctx._snd=!ctx._snd;snd.innerHTML=ctx._snd?IC.bellOff+' Ohne Ton':IC.bell+' Mit Ton'};
  const t=el('div','mtab');Object.entries(window.MORSE).forEach(([L,c])=>t.appendChild(el('div','','<b>'+L+'</b> '+c.replace(/\./g,'•').replace(/-/g,'▬'))));
  ctx.W.append(snd,lab('Lichttafel'),t)}
};
function numtab(){const t=el('div','numtab');t.style.marginTop='12px';'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c,i)=>t.appendChild(el('div','','<b>'+c+'</b><br>'+(i+1))));return t}
})();
