(function(){
'use strict';
const $=s=>document.querySelector(s), el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const SOL='WINTERSTERNERSTRAHLEHELL', WORDS=[11,9,4];
const params=new URLSearchParams(location.search);
const KEY='kz_zauber_v1';
if(params.get('reset')==='1'&&params.get('probe')){try{localStorage.removeItem(KEY)}catch(e){}history.replaceState(null,'',location.pathname+location.search.replace(/[?&]reset=1/,'').replace(/^&/,'?'))}
let st={done:{},open:{},sound:true};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)st=Object.assign(st,s)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- Geschenk und Zugang ---------- */
let gift=null,giftOk=false;
try{const g=params.get('g');if(g){gift=kzDec(g)}}catch(e){}
const ready=(async()=>{if(gift&&gift.an&&gift.k){const sec=gift.s?kzShow(gift.s):'';giftOk=(await kzSig(gift.an,gift.von||'',kzMsg(gift.m||'',sec)))===gift.k;if(giftOk)gift.sec=sec}
 if(giftOk){$('#giftline').textContent='Ein Eulenbrief für '+gift.an+(gift.von?', geschickt von '+gift.von+'.':'.');if(gift.m){const m=$('#giftmsg');m.textContent=gift.m+(gift.von?'\n\n'+gift.von:'');m.style.display='block'}st.act=1;save()}else gift=null;
 if(!st.act)$('#codebox').style.display='block'})();
async function access(){await ready;if(st.act)return true;const v=kzNormCode($('#code').value);if(v&&await kzSha(v)===KZ_H){st.act=1;save();$('#codebox').style.display='none';return true}
 SFX.no();toast(v?'Dieser Code stimmt nicht. Schau noch einmal in dein PDF.':'Bitte gib zuerst deinen Zugangscode ein.');$('#code').focus();return false}

/* ---------- Datum ---------- */
let TOFF=0;
(async()=>{try{const r=await fetch(location.pathname+'?t='+Date.now(),{method:'HEAD',cache:'no-store'});const d=Date.parse(r.headers.get('date'));if(d){TOFF=d-Date.now();if($('#s-desk').classList.contains('on'))renderDesk()}}catch(e){}})();
function berlin(){const p=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date(Date.now()+TOFF));const o={};p.forEach(x=>o[x.type]=+x.value);return o}
let PROBE=false;(async()=>{const q=params.get('probe');if(q&&await kzSha(q)==='f4c4125bb77f6326d8e44b3769bda526842e4f0ec9f36aeb3c9c12bd830806d9'){PROBE=true;window.__kz={openCase:d=>openCase(d),openEnv:d=>openEnv(d),runeDone:()=>runeDone(),finale:()=>finale()};if($('#s-desk').classList.contains('on'))renderDesk()}})();
function unlocked(d){if(PROBE)return true;const b=berlin();if(b.month===12)return b.day>=d;if(b.month===1)return true;return false}
function todayNr(){const b=berlin();return b.month===12&&b.day<=24?b.day:0}
const ORD=['Erster','Zweiter','Dritter','Vierter','Fünfter','Sechster','Siebter','Achter','Neunter','Zehnter','Elfter','Zwölfter','Dreizehnter','Vierzehnter','Fünfzehnter','Sechzehnter','Siebzehnter','Achtzehnter','Neunzehnter','Zwanzigster','Einundzwanzigster','Zweiundzwanzigster','Dreiundzwanzigster','Vierundzwanzigster'];

/* ---------- Audio ---------- */
let AC=null,master=null;
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=st.sound?1:0;master.connect(AC.destination)}if(AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type,v,t0){const c=ac(),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.value=f;const t=c.currentTime+(t0||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.2,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)}
function bell(f,d,v,t0){tone(f,d||1.4,'sine',v||.18,t0);tone(f*2.01,(d||1.4)*.5,'sine',(v||.18)*.35,t0);tone(f*3.98,(d||1.4)*.25,'sine',(v||.18)*.12,t0)}
function noise(d,f,q,v,t0,type){const c=ac(),n=Math.max(1,c.sampleRate*d|0),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;const bf=c.createBiquadFilter();bf.type=type||'bandpass';bf.frequency.value=f;bf.Q.value=q||1;const g=c.createGain();const t=c.currentTime+(t0||0);g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);s.connect(bf);bf.connect(g);g.connect(master);s.start(t);return {s,bf}}
const SFX={
 tap(){tone(1200,.05,'triangle',.05)},
 paper(){noise(.35,2600,.7,.22);noise(.25,5000,.8,.1,.12)},
 magic(){[784,988,1175,1568,1976].forEach((f,i)=>bell(f,1.2,.07,i*.06))},
 ok(){[523,659,784,1047,1319].forEach((f,i)=>bell(f,1.6,.11,i*.09))},
 no(){tone(180,.25,'triangle',.12);tone(150,.3,'triangle',.1,.09)},
 wing(){noise(.25,700,1.2,.25);noise(.25,600,1.2,.22,.3);noise(.25,650,1.2,.2,.6)},
 seal(){tone(110,.4,'sine',.5);noise(.25,400,1,.35);bell(1568,1.2,.08,.15)},
 pop(){tone(420,.12,'sine',.25);tone(840,.1,'sine',.12,.04)},
 tick(){noise(.03,4500,6,.1)},
 bubble(){for(let i=0;i<6;i++)tone(300+Math.random()*500,.08,'sine',.08,i*.07)},
 whoosh(){const c=ac();const r=noise(.8,500,1.5,.3);r.bf.frequency.exponentialRampToValueAtTime(3000,c.currentTime+.7)},
 chime(){[0,.35,.7,1.05].forEach((t,i)=>bell([1047,1319,1568,2093][i],2,.1,t))}
};
// Echte Geräusche (ElevenLabs), synthetische Töne bleiben als Rückfall
const SBUF={};const SNAMES=['book','bubble','candle','click','crystal','globe','hoot','lantern','lock','paper','plop','quill','seal','stone','success','twinkle','wand','wing','wrong'];
function sload(){const c=ac();SNAMES.forEach(n=>{if(SBUF[n]!==undefined)return;SBUF[n]=null;fetch('s/'+n+'.mp3').then(r=>r.arrayBuffer()).then(b=>c.decodeAudioData(b)).then(d=>{SBUF[n]=d}).catch(()=>{})})}
function smp(n,v,rate){const c=ac();if(!SBUF[n]){sload();return false}const s=c.createBufferSource();s.buffer=SBUF[n];if(rate)s.playbackRate.value=rate;const g=c.createGain();g.gain.value=v||.8;s.connect(g);g.connect(master);s.start();return true}
(()=>{const o={...SFX};const M={paper:['paper',.9],magic:['success',.75],ok:['success',.9],no:['wrong',.7],wing:['wing',.8],seal:['seal',.9],bubble:['plop',.8],tick:['click',.6],whoosh:['wand',.8],chime:['twinkle',.7]};
 Object.keys(M).forEach(k=>{SFX[k]=function(){const [n,v]=M[k];if(!smp(n,v,k==='tick'?1+Math.random()*.15:0))o[k]&&o[k]()}});
 ['crystal','stone','globe','candle','lock','hoot','lantern','book','quill','twinkle','plop','wand','success'].forEach(n=>{SFX[n]=(v)=>smp(n,v||.8)})})();
document.addEventListener('pointerdown',()=>{try{sload()}catch(e){}},{once:true});
// Wind im Hintergrund
let windG=null;
function startWind(){if(windG)return;const c=ac();const n=c.sampleRate*4,b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=l*.996+(Math.random()*2-1)*.03;x[i]=l}
 const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=.6;const g=c.createGain();g.gain.value=.0;s.connect(f);f.connect(g);g.connect(master);s.start();windG=g;
 const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.11;lg.gain.value=180;lfo.connect(lg);lg.connect(f.frequency);lfo.start();setWind(STORM)}
function setWind(v){if(windG&&AC)windG.gain.setTargetAtTime(.035*v,AC.currentTime,1.2)}
const music=$('#music');const MV=.2,MD=.06;let mG=null;
function musicOn(){if(!st.sound)return;const c=ac();if(!mG){try{const src=c.createMediaElementSource(music);mG=c.createGain();mG.gain.value=(voice&&!voice.paused)?MD:MV;src.connect(mG);mG.connect(master)}catch(e){music.volume=.15}}music.play().catch(()=>{})}
function mVol(v){if(mG&&AC)mG.gain.setTargetAtTime(v,AC.currentTime,.3)}
const voice=new Audio('stimmen.mp3?v=2');voice.preload='auto';let vStop=null,vx=null;
function vDone(){clearTimeout(vStop);try{voice.pause();if(vx)vx.pause()}catch(e){}mVol(MV);$('#btn-say').classList.remove('on')}
function say(k){vDone();if(!st.sound||st.voice===false||!window.VOX||!VOX[k])return false;const [s,d,fx]=VOX[k];if(fx){vx=new Audio(fx);mVol(MD);vx.play().then(()=>{vStop=setTimeout(vDone,d*1000+250)}).catch(()=>{});return true}const go=()=>{try{voice.currentTime=s}catch(e){}mVol(MD);voice.play().then(()=>{if(/^d\d+a$/.test(k))$('#btn-say').classList.add('on');vStop=setTimeout(vDone,d*1000+250)}).catch(()=>{})};if(voice.readyState>=1)go();else{voice.load();voice.addEventListener('loadedmetadata',go,{once:true})}return true}
const hush=vDone;
function clip(src){vDone();if(!st.sound)return null;vx=new Audio(src);mVol(MD);vx.addEventListener('ended',()=>mVol(MV),{once:true});vx.play().catch(()=>{});return vx}
function setSound(on){st.sound=on;save();if(!on)hush();if(master)master.gain.value=on?1:0;music.muted=!on;$('#btn-sound').innerHTML=on?IC.sound:IC.mute}

/* ---------- Schnee und Sturm ---------- */
let STORM=1;
(function(){const cv=$('#snow'),cx=cv.getContext('2d');let W,H,fl=[];function rs(){W=cv.width=innerWidth*devicePixelRatio;H=cv.height=innerHeight*devicePixelRatio}rs();addEventListener('resize',rs);
 for(let i=0;i<120;i++)fl.push({x:Math.random(),y:Math.random(),r:Math.random()*2+.6,s:Math.random()*.4+.25,w:Math.random()*6,k:Math.random()});
 (function loop(t){cx.clearRect(0,0,W,H);cx.fillStyle='rgba(255,255,255,.8)';const n=Math.round(40+80*STORM);
  for(let i=0;i<n;i++){const p=fl[i];p.y+=p.s/600*(1+STORM*1.6);p.x+=(STORM*.0025+.0002)*(.6+p.k);if(p.y>1.02){p.y=-.02;p.x=Math.random()}if(p.x>1.05)p.x=-.05;const x=(p.x+Math.sin(t/2000+p.w)*.008)*W;cx.beginPath();cx.arc(x,p.y*H,p.r*devicePixelRatio,0,7);cx.fill()}requestAnimationFrame(loop)})(0)})();
function storm(v){STORM=v;setWind(v)}


/* ---------- Pip, das Eulenküken (Suchspiel) ---------- */
const PIPPOS=[['peek','top:4px;right:72px'],['sleep','bottom:8px;right:72px'],['read','bottom:10px;right:14px'],['star','bottom:8px;right:72px'],['wave','bottom:10px;right:14px'],['fly','top:4px;left:44%'],['peek','top:4px;right:72px'],['sleep','bottom:8px;right:72px'],['read','bottom:10px;right:14px'],['star','bottom:8px;right:72px'],['wave','bottom:10px;right:14px'],['fly','top:4px;left:44%'],['peek','top:4px;right:72px'],['sleep','bottom:8px;right:72px'],['read','bottom:10px;right:14px'],['star','bottom:8px;right:72px'],['wave','bottom:10px;right:14px'],['fly','top:4px;left:44%'],['peek','top:4px;right:72px'],['sleep','bottom:8px;right:72px'],['read','bottom:10px;right:14px'],['star','bottom:8px;right:72px'],['wave','bottom:10px;right:14px'],['fly','top:4px;left:44%']];
const PIPV=['v/pip1.mp3','v/pip2.mp3','v/pip3.mp3','v/pip4.mp3'];
function pipCount(){return Object.keys(st.pip||{}).length}
function placePip(d){const paper=$('#s-case .paper');let p=$('#pip');if(p)p.remove();const [pose,css]=PIPPOS[(d-1)%24];
 p=el('button','pip'+((st.pip||{})[d]?' found':''));p.id='pip';p.setAttribute('aria-label','Pip');p.style.cssText=css;p.innerHTML='<img src="ic/pip_'+pose+'.webp" alt="">';
 p.onclick=e=>{e.stopPropagation();ac();st.pip=st.pip||{};const neu=!st.pip[d];st.pip[d]=1;save();p.classList.remove('hop');void p.offsetWidth;p.classList.add('hop','found');
  clip(PIPV[(d+(neu?0:1))%PIPV.length]);
  sparkleAt(p,14);if(neu)toast('Pip gefunden! '+pipCount()+' von 24')};
 paper.appendChild(p)}

/* ---------- Burg, Sterne ---------- */
function castle(win){let s='<g fill="#070b1d"><path d="M0 222 L0 190 Q150 160 300 166 Q450 160 600 186 L600 222Z"/>'+
 '<rect x="106" y="106" width="48" height="80"/><path d="M98 108 L130 58 L162 108Z"/>'+
 '<path d="M150 186 V140 h10 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h10 V186Z"/>'+
 '<rect x="246" y="94" width="108" height="92"/><path d="M240 96 h120 v-10 h-12 v-8 h-12 v8 h-12 v-8 h-12 v8 h-12 v-8 h-12 v8 h-12 v-8 h-12 v8 h-12 v-8 h-12 v8 h-12Z"/>'+
 '<rect x="276" y="38" width="48" height="60"/><path d="M270 40 L300 0 L330 40Z"/>'+
 '<path d="M350 186 V142 h10 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h10 V186Z"/>'+
 '<rect x="456" y="98" width="46" height="88"/><path d="M448 100 L479 52 L510 100Z"/>'+
 '<rect x="516" y="132" width="28" height="56"/><path d="M511 134 L530 106 L549 134Z"/></g>';
 const W=[[124,124,8,14],[124,150,8,14],[290,54,8,14],[302,54,8,14],[262,112,9,15],[284,112,9,15],[308,112,9,15],[330,112,9,15],[262,142,9,15],[330,142,9,15],[473,116,8,14],[473,144,8,14],[527,148,6,11],[190,156,7,11],[400,158,7,11]];
 W.forEach((w,i)=>{s+='<rect class="win" data-i="'+i+'" x="'+w[0]+'" y="'+w[1]+'" width="'+w[2]+'" height="'+w[3]+'" rx="3" fill="'+(win?'#ffcf6a':'#1a2140')+'"/>'});
 s+='<path d="M286 186 v-22 a14 14 0 0 1 28 0 v22Z" fill="'+(win?'#c98f3a':'#141a35')+'" class="win"/>';return s}
function starPath(r,k){let d='';const n=k||5;for(let i=0;i<n*2;i++){const a=-Math.PI/2+i*Math.PI/n,rr=i%2?r*.42:r;d+=(i?'L':'M')+(Math.cos(a)*rr).toFixed(1)+' '+(Math.sin(a)*rr).toFixed(1)}return d+'Z'}
function hexPts(cx,cy,R){const V=[];for(let i=0;i<12;i++){const a=-Math.PI/2+i*Math.PI/6,r=i%2?R/Math.sqrt(3):R;V.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}
 const P=[];for(let i=0;i<12;i++){const a=V[i],b=V[(i+1)%12];P.push(a,[(a[0]+b[0])/2,(a[1]+b[1])/2])}return P}
function bgStars(n,w,h,seed){let s='',r=seed||7;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};for(let i=0;i<n;i++){s+='<circle cx="'+(rnd()*w).toFixed(1)+'" cy="'+(rnd()*h).toFixed(1)+'" r="'+(rnd()*1.1+.3).toFixed(2)+'" fill="#fff" opacity="'+(rnd()*.5+.2).toFixed(2)+'"/>'}return s}
const glow=id=>'<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#fff8dc"/><stop offset=".35" stop-color="#ffd56a" stop-opacity=".8"/><stop offset="1" stop-color="#ffb92e" stop-opacity="0"/></radialGradient></defs>';
$('#start-sky').innerHTML='<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMax meet">'+glow('sg0')+bgStars(70,600,260,3)+'<g transform="translate(0 198)">'+castle(false)+'</g></svg>';

/* ---------- Navigation ---------- */
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));const s=$(id);s.classList.add('on');s.scrollTop=0;$('#snow').style.display=(id==='#s-case'||id==='#s-book'||id==='#s-intro')?'none':'block'}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2800)}
function sparkleAt(node,n){const r=node.getBoundingClientRect();for(let i=0;i<n;i++){const s=el('div','sparkle');s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';const a=Math.random()*6.28,d=50+Math.random()*120;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');s.style.animationDelay=(Math.random()*.3)+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),1400)}}

/* ---------- Start und Intro ---------- */
$('#btn-start').onclick=()=>{ac();musicOn();if(st.act)beginIntro();else access().then(ok=>ok&&beginIntro())};
const INTRO=['Rabenfels, in der längsten Nacht des Jahres.','Seit tausend Wintern leuchtet der Winterstern über unserer Akademie.','Doch heute Nacht ist er erloschen.','Ein Schneesturm legt sich um die Burg, und ein Fenster nach dem anderen wird dunkel.','Nur eine alte Formel kann ihn wieder entzünden.','Ich habe ihre Buchstaben in 24 Rätseln versteckt.','Und ich brauche deine Hilfe, junger Lehrling.'];
let introRun=0;
const IMARKS=[0,4.1,8.6,11.3,16.8,20.0,24.0];
async function beginIntro(){const run=++introRun;SFX.magic();show('#s-intro');storm(.1);startWind();
 const v=$('#ivid');try{v.currentTime=0}catch(e){}v.muted=true;v.play().catch(()=>{});
 const said=say('intro');const D=(said&&VOX.intro)?VOX.intro[1]:27.5;const tot=INTRO.join(' ').length;let acc=0;const marks=IMARKS||INTRO.map(l=>{const m=acc/tot*D;acc+=l.length+1;return m});
 const it=$('#intro-text');const T0=performance.now();let li=-1;const END=Math.max(D,v.duration||0)+.6;
 while(run===introRun){const t=(performance.now()-T0)/1000;let k=-1;marks.forEach((m,i)=>{if(t>=m)k=i});
  if(k!==li){li=k;it.style.opacity=0;await sleep(350);if(run!==introRun)return;it.textContent=INTRO[k]||'';it.style.opacity=1;
   if(k===2)noise(2.5,300,.8,.12,0,'lowpass');
   if(k===3)storm(1)}
  if(t>END)break;await sleep(120)}
 if(run===introRun)goDesk()}
$('#btn-skip').onclick=goDesk;
function goDesk(){introRun++;hush();try{$('#ivid').pause()}catch(e){}storm(1);startWind();renderDesk();show('#s-desk');musicOn()}
$('#btn-sound').onclick=()=>{ac();setSound(!st.sound);musicOn()};
setSound(st.sound);
$('#btn-book').onclick=()=>{SFX.paper();const n=$('#numtab');n.innerHTML='';'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c,i)=>n.appendChild(el('div','','<b>'+c+'</b><br>'+(i+1))));show('#s-book')};
$('#btn-book-back').onclick=()=>{SFX.paper();show('#s-desk')};

/* ---------- Sternenhimmel und Briefe ---------- */
const DP=hexPts(200,118,92);
function renderSky(newD){const n=Object.keys(st.done).length;let s='<svg viewBox="0 0 400 300">'+glow('sg2')+bgStars(60,400,230,5);
 s+='<g transform="translate(200 118)" opacity="'+(n?0.10:0.05)+'"><path d="'+DP.map((p,i)=>(i?'L':'M')+(p[0]-200).toFixed(1)+' '+(p[1]-118).toFixed(1)).join('')+'Z" fill="none" stroke="#c9d3ff" stroke-width="1" stroke-dasharray="2 5"/></g>';
 for(let d=1;d<=24;d++){const [x,y]=DP[d-1];if(st.done[d]){s+='<g class="st-star'+(d===newD?' new':'')+'" style="transform-origin:'+x+'px '+y+'px"><circle cx="'+x+'" cy="'+y+'" r="15" fill="url(#sg2)" opacity=".85"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="14" fill="#2a1d10">'+SOL[d-1]+'</text></g>'}
  else s+='<circle cx="'+x+'" cy="'+y+'" r="1.6" fill="#9fb0e6" opacity=".55"/>'}
 s+='</svg>';const sb=$('#skybox');sb.innerHTML=s;sb.classList.toggle('lit',n>=24);sb.style.setProperty('--glow',(0.15+0.85*n/24).toFixed(2));
 $('#skylab').textContent=n?'Dein Sternenhimmel · '+n+' von 24 Sternen leuchten':'Dein Sternenhimmel · noch ist es dunkel';const pc=pipCount();$('#skylab').innerHTML+=pc?' <span class="pipc"><img src="ic/pip_wave.webp" alt="">'+pc+'</span>':''}
function sealSVG(){return '<svg viewBox="-50 -50 100 100"><circle r="44" fill="url(#wx)"/><defs><radialGradient id="wx" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4766b8"/><stop offset="1" stop-color="#14204f"/></radialGradient></defs><circle r="34" fill="none" stroke="#e0b961" stroke-width="2" opacity=".7"/><path d="'+starPath(22,8)+'" fill="#e0b961"/></svg>'}
const SEALURL='siegel.svg';
function renderDesk(newD){renderSky(newD);const g=$('#grid');g.innerHTML='';const td=todayNr();
 for(let d=1;d<=24;d++){const b=el('button','env');b.style.setProperty('--r',((d*37)%7-3)*.6+'deg');const u=unlocked(d);
  if(st.done[d])b.classList.add('open');else if(!u)b.classList.add('locked');if(d===td&&!st.done[d])b.classList.add('today');
  b.appendChild(el('span','num',d));b.appendChild(el('span','wax',st.done[d]?'<b class="solvedmark">'+IC.star+'</b>':'<img src="'+SEALURL+'" alt="">'+(u?'':'<i>'+IC.lock+'</i>')));
  b.onclick=()=>{if(!unlocked(d)){SFX.no();toast('Dieser Eulenbrief bleibt bis zum '+d+'. Dezember versiegelt.');return}SFX.tap();if(st.done[d]||st.open[d])openCase(d);else openEnv(d)};g.appendChild(b)}
 const n=Object.keys(st.done).length;$('#deskfoot').textContent=n===24?'Alle 24 Sterne leuchten. Öffne Brief 24 für die Sternennacht.':n+' von 24 Rätseln gelöst. Jeden Tag im Dezember bringt die Eule einen neuen Brief.'}

/* ---------- Eulenbrief mit Rune ---------- */
const RUNES=[[[65,10],[35,40],[65,60],[35,90]],[[66,14],[34,50],[66,86]],[[36,90],[36,12],[68,30],[36,48],[68,64]],[[50,10],[80,50],[50,90],[20,50],[50,10]],[[36,90],[36,10],[66,26],[36,46],[68,90]],[[30,90],[30,10],[70,35],[70,90]],[[50,92],[50,10],[22,38]],[[20,16],[80,84],[80,16],[20,84],[20,16]],[[40,90],[40,10],[70,34]],[[50,8],[76,90],[8,38],[92,38],[24,90],[50,8]]];
let curDay=0,trace=null;
function openEnv(d){curDay=d;const L=$('#letter'),O=$('#owl');L.className='letter';O.className='owl';void L.offsetWidth;
 $('#env-date').textContent=d==='secret'?'Persönlich für '+(gift&&gift.an||'dich'):d+'. Dezember';$('#lt-card').innerHTML='<i class="lc-orn"></i><small>Akademie zu Rabenfels</small><b>'+(d==='secret'?'Persönlich':'Eulenbrief')+'</b><em>'+(d==='secret'?'nur für dich':'Nr. '+d+' · '+d+'. Dezember')+'</em><span>An meine lieben Lehrlinge</span><i class="lc-orn lc-b"></i>';
 $('#env-hint').textContent='Die Eule bringt deinen Brief …';$('#env-hint').style.visibility='visible';show('#s-env');if(st.sound)smp('wind',.45);
 O.style.transform='';O.classList.add('fly');L.classList.add('in');SFX.wing();setTimeout(()=>{if(curDay!==d)return;O.classList.remove('fly');O.style.transform='none';O.classList.add('rest')},1650);setTimeout(()=>{if(curDay!==d)return;O.classList.remove('rest');O.classList.add('away');SFX.wing()},3300);
 const pts=d==='secret'?RUNES[9]:RUNES[(d-1)%9];buildRune(pts);setTimeout(()=>{if(curDay===d)$('#env-hint').textContent='Fahr mit dem Finger die leuchtende Rune auf dem Siegel nach'},1800)}
function buildRune(pts){const R=$('#rune');R.className='rune';
 const samp=[];for(let i=0;i<pts.length-1;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1],len=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.round(len/3));for(let k=0;k<n;k++)samp.push([x1+(x2-x1)*k/n,y1+(y2-y1)*k/n])}samp.push(pts[pts.length-1]);
 const d='M'+pts.map(p=>p.join(' ')).join(' L');
 R.innerHTML='<svg viewBox="-10 -10 120 120"><defs><radialGradient id="wx2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4c6cc2"/><stop offset="1" stop-color="#121c48"/></radialGradient><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
 '<image href="z/siegel_blau.webp" x="-14" y="-14" width="128" height="128"/>'+
 '<path d="'+d+'" fill="none" stroke="#e0b961" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".28"/>'+
 '<path id="rprog" d="'+d+'" fill="none" stroke="#fff3c4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#gl)"/>'+
 '<circle id="rdot" r="7" fill="#fff3c4" filter="url(#gl)"><animate attributeName="r" values="5;9;5" dur="1.2s" repeatCount="indefinite"/></circle></svg>';
 const sv=R.querySelector('svg'),pr=R.querySelector('#rprog'),dot=R.querySelector('#rdot'),TL=pr.getTotalLength();pr.style.strokeDasharray=TL;pr.style.strokeDashoffset=TL;
 trace={samp,i:0,done:false,on:false};const T=trace;const upd=()=>{const f=T.i/(samp.length-1);pr.style.strokeDashoffset=TL*(1-f);const p=samp[Math.min(T.i,samp.length-1)];dot.setAttribute('cx',p[0]);dot.setAttribute('cy',p[1])};upd();
 const toV=e=>{const m=sv.getScreenCTM().inverse(),p=sv.createSVGPoint();const q=e.touches?e.touches[0]:e;p.x=q.clientX;p.y=q.clientY;const r=p.matrixTransform(m);return [r.x,r.y]};
 let lastS=0;
 const mv=e=>{if(!T.on||T.done)return;e.preventDefault();const [x,y]=toV(e);let best=-1;for(let k=T.i;k<Math.min(samp.length,T.i+9);k++){if(Math.hypot(samp[k][0]-x,samp[k][1]-y)<15)best=k}
  if(best>=T.i){T.i=best+1;upd();const now=performance.now();if(now-lastS>60){lastS=now;tone(700+T.i*14,.08,'sine',.05)}if(navigator.vibrate&&Math.random()<.1)navigator.vibrate(5);if(T.i>=samp.length-2){T.i=samp.length-1;upd();runeDone()}}};
 const dn=e=>{if(T.done)return;ac();const [x,y]=toV(e);const p=samp[T.i];if(Math.hypot(p[0]-x,p[1]-y)<22||T.i>0){T.on=true;mv(e)}else{toast('Beginne am leuchtenden Punkt.')}};
 const up=()=>{T.on=false};
 sv.addEventListener('pointerdown',dn);sv.addEventListener('pointermove',mv);addEventListener('pointerup',up);sv.addEventListener('touchmove',e=>e.preventDefault(),{passive:false})}
function runeDone(){if(!trace||trace.done)return;trace.done=true;const R=$('#rune'),L=$('#letter');$('#env-hint').style.visibility='hidden';SFX.magic();if(navigator.vibrate)navigator.vibrate([20,40,60]);sparkleAt(R,22);
 setTimeout(()=>{SFX.seal();R.classList.add('broken')},500);setTimeout(()=>{SFX.paper();L.classList.add('opened')},1300);
 setTimeout(()=>{if(curDay==='secret'){showSecret();return}st.open[curDay]=1;save();openCase(curDay)},3900)}
$('#btn-env-back').onclick=()=>{if(curDay==='secret'){show('#s-final');return}renderDesk();show('#s-desk')};

/* ---------- Rätselseite ---------- */
let typer=null;
function typeText(node,txt,cb){clearInterval(typer);node.innerHTML='';let i=0;const cur=el('span','cur','&nbsp;');node.appendChild(cur);
 typer=setInterval(()=>{if(i>=txt.length){clearInterval(typer);cur.remove();cb&&cb();return}cur.before(txt[i]);if(txt[i]!==' '&&i%3===0)noise(.025,6000,4,.05);i++},20);
 node.onclick=()=>{if(i<txt.length){clearInterval(typer);i=txt.length;node.textContent=txt;cb&&cb()}}}
const norm=s=>(s||'').toUpperCase().replace(/Ä/g,'AE').replace(/Ö/g,'OE').replace(/Ü/g,'UE').replace(/ß/g,'SS').replace(/[^A-Z0-9]/g,'');
function openCase(d){curDay=d;const D=DAYS[d-1];show('#s-case');placePip(d);setTimeout(()=>say('d'+d+'a'),400);
 $('#c-date').textContent=d+'. Dezember';$('#c-nr').textContent=d;$('#c-title').textContent=D.t;$('#c-q').textContent=D.q;$('#c-hint').textContent='';
 const sv=$('#c-solved');sv.style.display='none';
 const W=$('#c-widget');W.innerHTML='';const A=$('#c-answer');A.innerHTML='';
 const ctx={d,D,W,A,solved:!!st.done[d]};
 function check(v){const ok=v==='__OK__'||(D.a||[]).some(a=>norm(a)===norm(v));
  if(ok){if(!st.done[d])showSolved(true);return true}SFX.no();const p=$('#s-case .paper');p.classList.remove('shake');void p.offsetWidth;p.classList.add('shake');if(navigator.vibrate)navigator.vibrate([40,40,40]);toast(v==='x'?'Noch nicht ganz. Versuch es noch einmal.':'Das passt noch nicht. Schau dir das Rätsel noch einmal an.');return false}
 ctx.check=check;
 typeText($('#c-story'),D.s);
 try{(window.WIDGETS[D.w.k]||function(){})(ctx)}catch(e){console.error(e)}
 if(D.a&&!ctx.noInput){const inp=el('input');inp.placeholder='Lösung';inp.autocomplete='off';inp.setAttribute('autocapitalize','characters');inp.setAttribute('autocorrect','off');inp.spellcheck=false;
  const b=el('button','btn','Prüfen');b.onclick=()=>check(inp.value);inp.onkeydown=e=>{if(e.key==='Enter')check(inp.value)};A.append(inp,b);ctx.input=inp}
 $('#btn-h1').onclick=()=>{SFX.paper();$('#c-hint').textContent='Meisterin Eibenhain: '+D.h[0];say('d'+d+'h1')};
 $('#btn-h2').onclick=()=>{SFX.paper();$('#c-hint').textContent='Meisterin Eibenhain: '+D.h[1];say('d'+d+'h2')};
 $('#btn-say').onclick=()=>{if(!voice.paused){hush();return}if(st.voice===false){st.voice=true;save()}say('d'+d+'a')};
 if(st.done[d])showSolved(false);
 function showSolved(fresh){const L=D.L;sv.innerHTML='<span class="stamp2">Gelöst</span>Dein Stern leuchtet mit dem Buchstaben<b class="big">'+L+'</b><span style="font-size:16px">'+D.how+'. Er steht jetzt an deinem Sternenhimmel. An Heiligabend verbindest du alle Sterne.</span>';sv.style.display='block';
  if(fresh){st.done[d]=1;save();SFX.ok();const fl=el('div','flystar',IC.star+' '+L);document.body.appendChild(fl);setTimeout(()=>fl.remove(),1800);sparkleAt(sv,16);if(navigator.vibrate)navigator.vibrate([20,60,20]);setTimeout(()=>sv.scrollIntoView({behavior:'smooth',block:'center'}),400)}
  if(d===24&&Object.keys(st.done).length===24){const fb=el('button','btn','Zur Sternennacht');fb.style.marginTop='14px';fb.onclick=finale;sv.appendChild(el('br'));sv.appendChild(fb)}
  else if(d===24){const n=24-Object.keys(st.done).length;sv.appendChild(el('p','','Dir fehlen noch '+n+' Sterne. Löse zuerst alle Rätsel, dann beginnt die Sternennacht.'))}}}
$('#btn-case-back').onclick=()=>{hush();SFX.paper();const d=curDay;renderDesk(st.done[d]&&!st.seen?.[d]?d:0);st.seen=st.seen||{};if(st.done[d])st.seen[d]=1;save();show('#s-desk');if(st.done[d])setTimeout(()=>bell(1568,1.5,.08),500)};

/* ---------- Finale: Sterne verbinden ---------- */
const FP=hexPts(200,168,128);let finRun=0;
async function finale(){const run=++finRun;hush();show('#s-final');storm(1);['#verdict','#cert-wrap','#secret-wrap'].forEach(x=>$(x).classList.remove('on'));
 const F=$('#formula');F.className='formula';F.innerHTML='';let i=0;WORDS.forEach(w=>{const g=el('div','word');for(let k=0;k<w;k++){const s=el('div','slot');s.dataset.i=i++;g.appendChild(s)}F.appendChild(g)});const slots=[...F.querySelectorAll('.slot')];
 let s='<svg viewBox="0 0 400 400" id="fsvg">'+glow('sg3')+'<defs><radialGradient id="big"><stop offset="0" stop-color="#fffbe8"/><stop offset=".25" stop-color="#ffe08a" stop-opacity=".95"/><stop offset=".6" stop-color="#ffb92e" stop-opacity=".35"/><stop offset="1" stop-color="#ffb92e" stop-opacity="0"/></radialGradient></defs>'+'<image href="z/t_himmel.jpg" x="0" y="0" width="400" height="400" preserveAspectRatio="xMidYMax slice"/><rect id="fdim" width="400" height="400" fill="#0b1230" opacity=".45"/>'+bgStars(40,400,260,9)+
  '<g id="fblaze" opacity="0" style="transform-origin:200px 168px"><circle cx="200" cy="168" r="200" fill="url(#big)"/></g><g id="flines"></g><path id="fpoly" fill="none" stroke="#fff3c4" stroke-width="3" opacity="0"/><g id="fstars">';
 FP.forEach(([x,y],k)=>{s+='<g class="fs" data-k="'+k+'"><circle cx="'+x+'" cy="'+y+'" r="16" fill="url(#sg3)"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="14" fill="#2a1d10">'+SOL[k]+'</text><text x="'+(x+(x<200?-14:14))+'" y="'+(y-12)+'" text-anchor="middle" font-family="Cinzel" font-size="10" fill="#c9d3ff" opacity=".85">'+(k+1)+'</text></g>'});
 s+='</g><circle id="fnext" cx="'+FP[0][0]+'" cy="'+FP[0][1]+'" r="21" fill="none" stroke="#9ff0b8" stroke-width="3"><animate attributeName="r" values="19;26;19" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.4;1" dur="1.3s" repeatCount="indefinite"/></circle><text id="fstart" x="'+FP[0][0]+'" y="'+(FP[0][1]-30)+'" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="12" fill="#9ff0b8">START</text><g id="fcircle"></g><g id="fcastle"></g></svg>';$('#finsky').innerHTML=s;
 $('#fin-help').style.display='flex';$('#btn-auto').style.display='inline-block';
 const hint=$('#fin-hint');hint.textContent='Verbinde die Sterne der Reihe nach mit dem Finger, vom ersten bis zum vierundzwanzigsten.';
 await sleep(500);if(run!==finRun)return;say('sterne');
 const sv=$('#fsvg'),lines=$('#flines');let n=0,on=false,done=false;
 const toV=e=>{const m=sv.getScreenCTM().inverse(),p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const r=p.matrixTransform(m);return [r.x,r.y]};
 const link=k=>{const a=FP[k-1],b=FP[k];const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',a[0]);l.setAttribute('y1',a[1]);l.setAttribute('x2',b[0]);l.setAttribute('y2',b[1]);l.setAttribute('stroke','#ffe9a8');l.setAttribute('stroke-width','2.5');l.setAttribute('stroke-linecap','round');lines.appendChild(l)};
 const hit=k=>{n=k+1;{const nx=document.getElementById('fnext');if(n<24){nx.setAttribute('cx',FP[n][0]);nx.setAttribute('cy',FP[n][1])}else nx.style.display='none';if(n===1)document.getElementById('fstart').style.display='none'}if(k>0)link(k);bell(523*Math.pow(2,(k%12)/12)*(k>=12?2:1),1.2,.08);const sl=slots[k];sl.textContent=SOL[k];sl.classList.add('new');const g=sv.querySelector('.fs[data-k="'+k+'"] circle');g.setAttribute('r','22');if(n===24)closeStar()};
 const near=([x,y])=>{let best=-1,bd=24;FP.forEach((p,k)=>{const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd){bd=d;best=k}});return best};
 let wrongT=0;
 const tryAt=e=>{if(done)return;const k=near(toV(e));if(k<0)return;if(k===n){hit(k)}else if(k>n&&performance.now()-wrongT>900){wrongT=performance.now();SFX.no();toast('Als Nächstes kommt Stern '+(n+1)+'.')}};
 sv.addEventListener('pointerdown',e=>{ac();on=true;tryAt(e)});sv.addEventListener('pointermove',e=>{if(on)tryAt(e)});addEventListener('pointerup',()=>on=false);
 $('#btn-auto').onclick=async()=>{$('#btn-auto').style.display='none';while(n<24&&!done&&run===finRun){hit(n);await sleep(110)}};
 async function closeStar(){done=true;$('#fin-help').style.display='none';const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',FP[23][0]);l.setAttribute('y1',FP[23][1]);l.setAttribute('x2',FP[0][0]);l.setAttribute('y2',FP[0][1]);l.setAttribute('stroke','#ffe9a8');l.setAttribute('stroke-width','2.5');lines.appendChild(l);
  SFX.ok();F.classList.add('glow');lines.style.filter='drop-shadow(0 0 6px #ffd56a)';await sleep(900);if(run!==finRun)return;
  hint.innerHTML='<b>WINTERSTERN ERSTRAHLE HELL</b><br>Sprich die Formel laut aus und zeichne mit deinem Finger einen Kreis um den Stern. Du kannst auch dein Handy schütteln.';say('kreis');
  try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function')DeviceMotionEvent.requestPermission().catch(()=>{})}catch(e){}
  await wandCircle(sv,run);if(run!==finRun)return;blaze(run)}}
function wandCircle(sv,run){return new Promise(res=>{const C=[200,168];let sum=0,la=null,on=false,shakes=0,lastS=0;const g=$('#fcircle');let pts=[];
 const toV=e=>{const m=sv.getScreenCTM().inverse(),p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const r=p.matrixTransform(m);return [r.x,r.y]};
 const draw=()=>{g.innerHTML='<path d="M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join(' L')+'" fill="none" stroke="#fff3c4" stroke-width="4" stroke-linecap="round" opacity=".9" style="filter:drop-shadow(0 0 6px #ffd56a)"/>'};
 const dn=e=>{on=true;la=null;sum=0;pts=[]};
 const mv=e=>{if(!on)return;const v=toV(e);const a=Math.atan2(v[1]-C[1],v[0]-C[0]);const r=Math.hypot(v[0]-C[0],v[1]-C[1]);if(r<40)return;if(la!==null){let da=a-la;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;sum+=da}la=a;pts.push(v);if(pts.length>160)pts.shift();draw();if(Math.random()<.3)tone(900+Math.abs(sum)*120,.06,'sine',.04);if(Math.abs(sum)>Math.PI*1.75)fin()};
 const up=()=>{on=false;if(Math.abs(sum)<Math.PI*1.75){g.innerHTML='';if(Math.abs(sum)>1)toast('Fast! Zieh einen ganzen Kreis um den Stern.')}};
 const mo=e=>{const a=e.accelerationIncludingGravity||e.acceleration;if(!a)return;const m=Math.hypot(a.x||0,a.y||0,a.z||0);const now=performance.now();if(m>22&&now-lastS>250){lastS=now;shakes++;bell(1200+shakes*150,.5,.06);if(shakes>=4)fin()}};
 let fired=false;function fin(){if(fired)return;fired=true;sv.removeEventListener('pointerdown',dn);sv.removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('devicemotion',mo);res()}
 sv.addEventListener('pointerdown',dn);sv.addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('devicemotion',mo)})}
async function blaze(run){const b=$('#fblaze'),g=$('#fcircle');$('#fin-hint').textContent='';g.innerHTML='';SFX.whoosh();if(navigator.vibrate)navigator.vibrate([40,60,120]);
 b.style.transition='opacity 2.2s';b.setAttribute('opacity','1');b.animate([{transform:'scale(.2)'},{transform:'scale(1)'}],{duration:2200,easing:'ease-out'});
 setTimeout(()=>SFX.chime(),400);sparkleAt($('#finsky'),40);
 let v=1;const iv=setInterval(()=>{v=Math.max(.06,v-.05);storm(v);if(v<=.06)clearInterval(iv)},140);
 await sleep(1600);{const fd=document.getElementById('fdim');if(fd){fd.style.transition='opacity 3s';fd.style.opacity='.05'}}const w=[...document.querySelectorAll('#fcastle .win')];w.forEach((x,i)=>setTimeout(()=>{x.setAttribute('fill',x.tagName==='path'?'#c98f3a':'#ffcf6a');tone(800+i*60,.4,'sine',.03)},i*180));
 await sleep(2200);if(run!==finRun)return;verdict()}
function verdict(){const v=$('#verdict');const said=say('fin');
 v.innerHTML='<div class="kick" style="color:var(--gold2);text-align:center">Rabenfels · Heiligabend</div><h2 style="text-align:center;margin:6px 0">Der Winterstern leuchtet</h2><p class="story">Der Sturm legt sich, und in allen Fenstern von Rabenfels gehen die Lichter an. Über dem höchsten Turm strahlt der Winterstern so hell wie seit tausend Wintern nicht mehr.</p><p class="story">Meisterin Eibenhain lässt ausrichten: Ohne dich wäre es in dieser Nacht dunkel geblieben. Sie ist sehr stolz auf dich.</p><p class="story center"><b>Frohe Weihnachten!</b></p>'+(gift&&gift.von?'<p class="story center" style="font-size:16px">Diesen Zauber hat dir '+esc(gift.von)+' geschenkt.</p>':'');
 v.classList.add('on');setTimeout(()=>v.scrollIntoView({behavior:'smooth',block:'start'}),200);
 setTimeout(showCert,((said&&VOX.fin)?VOX.fin[1]*1000:7000)+700)}

/* ---------- Urkunde ---------- */
function certName(){return (st.name||(gift&&gift.an)||'').trim()}
function rank(){return st.rank||'Meister der Winterzauberei'}
function showCert(){const w=$('#cert-wrap');w.classList.add('on');const n=certName();$('#cert-name').textContent=n||'Lehrling';$('#cert-rank').textContent=rank();$('#cert-edit').style.display=n?'none':'flex';
 document.querySelectorAll('#rankpick button').forEach(b=>b.classList.toggle('sel',b.dataset.r===rank()));SFX.paper();sealState();setTimeout(()=>{w.scrollIntoView({behavior:'smooth',block:'start'});say('cert')},300)}
document.querySelectorAll('#rankpick button').forEach(b=>b.onclick=()=>{SFX.tap();st.rank=b.dataset.r;save();$('#cert-rank').textContent=rank();document.querySelectorAll('#rankpick button').forEach(x=>x.classList.toggle('sel',x===b))});
function sealState(){const s=$('.cert-seal'),ok=!!st.sealed;s.classList.toggle('empty',!ok);$('.cert-btns').style.display=ok?'flex':'none';
 $('.cert-tap').textContent=ok?'Tipp auf die Urkunde, um sie groß anzusehen und als PDF zu speichern.':'Halte deinen Finger auf das leere Siegelfeld, um deine Urkunde zu besiegeln.';if(ok)secretState()}
(function(){const s=$('.cert-seal');let t0=0,raf=0,on=false;const H=1300;
 const stop=()=>{on=false;cancelAnimationFrame(raf);if(!st.sealed){s.style.setProperty('--p','0')}};
 const step=n=>{if(!on)return;const p=Math.min(1,(n-t0)/H);s.style.setProperty('--p',p.toFixed(3));if(Math.random()<.25)tone(400+p*900,.05,'sine',.03);if(p>=1){on=false;stamp();return}raf=requestAnimationFrame(step)};
 const start=e=>{if(st.sealed||!$('#cert-wrap').classList.contains('on'))return;e.preventDefault();e.stopPropagation();ac();on=true;t0=performance.now();if(navigator.vibrate)navigator.vibrate(15);raf=requestAnimationFrame(step)};
 function stamp(){st.sealed=1;save();SFX.seal();SFX.magic();if(navigator.vibrate)navigator.vibrate([20,30,90]);sparkleAt(s,18);setTimeout(sealState,500)}
 s.addEventListener('pointerdown',start);s.addEventListener('pointerup',stop);s.addEventListener('pointerleave',stop);s.addEventListener('pointercancel',stop);s.addEventListener('click',e=>e.stopPropagation());s.addEventListener('contextmenu',e=>e.preventDefault())})();
function secretState(){const w=$('#secret-wrap');if(!gift||!gift.sec){w.classList.remove('on');return}
 $('#secret-from').textContent=gift.von?'Von '+gift.von:'Von jemandem, der dich lieb hat';$('#secret-open').textContent=st.secretRead?'Brief noch einmal lesen':'Brief öffnen';
 if(!w.classList.contains('on')){setTimeout(()=>{w.classList.add('on');SFX.wing();setTimeout(()=>w.scrollIntoView({behavior:'smooth',block:'center'}),200)},st.secretRead?0:1200)}}
$('#secret-open').onclick=()=>{SFX.tap();openEnv('secret')};
function showSecret(){st.secretRead=1;save();show('#s-secret');$('#secret-to').textContent='Für '+(gift.an||'dich');$('#secret-text').textContent=gift.sec;$('#secret-sign').textContent=gift.von||'';
 SFX.chime();const l=$('#secret-letter');l.classList.remove('in');void l.offsetWidth;l.classList.add('in');setTimeout(()=>sparkleAt(l,30),500)}
$('#secret-back').onclick=()=>{SFX.tap();show('#s-final');secretState();setTimeout(()=>$('#cert-wrap').scrollIntoView({block:'start'}),50)};
$('#cert-set').onclick=()=>{const v=$('#cert-input').value.trim();if(!v){toast('Bitte trag einen Namen ein.');return}st.name=v;save();$('#cert-name').textContent=v;$('#cert-edit').style.display='none';SFX.seal();sparkleAt($('#cert-name'),10)};
async function certCanvas(){try{await document.fonts.ready}catch(e){}const W=1600,H=1130,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#f8f0dc');g.addColorStop(1,'#e8d7ad');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.strokeStyle='#1d2f6b';x.lineWidth=12;x.strokeRect(40,40,W-80,H-80);x.strokeStyle='#b8893a';x.lineWidth=3;x.strokeRect(66,66,W-132,H-132);
 x.fillStyle='#b8893a';[[66,66],[W-66,66],[66,H-66],[W-66,H-66]].forEach(([a,b])=>{x.save();x.translate(a,b);x.beginPath();for(let i=0;i<16;i++){const an=-Math.PI/2+i*Math.PI/8,r=i%2?7:20;x.lineTo(Math.cos(an)*r,Math.sin(an)*r)}x.closePath();x.fill();x.restore()});
 const t=(s,y,font,col)=>{x.font=font;x.fillStyle=col;x.textAlign='center';x.fillText(s,W/2,y)};
 t('AKADEMIE ZU RABENFELS',165,'700 30px Cinzel','#1d2f6b');
 t('Urkunde',290,'700 112px "Cinzel Decorative"','#2b2340');t('Hiermit wird',372,'italic 500 40px "Cormorant Garamond"','#4a3f5e');
 t($('#cert-name').textContent,470,'700 84px Cinzel','#1d2f6b');t('ernannt zum Titel',540,'italic 500 40px "Cormorant Garamond"','#4a3f5e');
 t(rank().toUpperCase(),628,'700 62px Cinzel','#2b2340');
 x.font='500 36px "Cormorant Garamond"';x.fillStyle='#2b2340';const txt='In 24 Nächten wurden alle Rätsel gelöst, die alte Formel gefunden und der Winterstern von Rabenfels wieder entzündet.';
 let line='',y=715;txt.split(' ').forEach(wd=>{if(x.measureText(line+wd).width>1080){x.fillText(line,W/2,y);line='';y+=48}line+=wd+' '});x.fillText(line,W/2,y);
 x.textAlign='center';x.font='700 50px "Cinzel Decorative"';x.fillStyle='#2b2340';x.fillText('Eibenhain',380,960);x.fillText('24.12.',1220,960);
 x.strokeStyle='#2b2340';x.lineWidth=2;[[250,510],[1090,1350]].forEach(([a,b])=>{x.beginPath();x.moveTo(a,985);x.lineTo(b,985);x.stroke()});
 x.font='500 30px "Cormorant Garamond"';x.fillText('Meisterin Eibenhain',380,1024);x.fillText('Rabenfels',1220,1024);
 await new Promise(res=>{const im=new Image();im.onload=()=>{x.drawImage(im,690,850,220,220);res()};im.onerror=res;im.src=SEALURL});return cv}
$('#cert-save').onclick=async()=>{SFX.tap();const cv=await certCanvas();cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='Urkunde_Winterzauberei.png';document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),500);toast('Urkunde gespeichert')},'image/png')};
$('#cert-share').onclick=async()=>{SFX.tap();const cv=await certCanvas();cv.toBlob(async b=>{const f=new File([b],'Urkunde_Winterzauberei.png',{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Der Winterstern leuchtet!',text:'Ich habe den Winterstern von Rabenfels wieder entzündet!'});return}}catch(e){if(e&&e.name==='AbortError')return}$('#cert-save').click()},'image/png')};
$('#final-back').onclick=()=>{hush();SFX.paper();renderDesk();show('#s-desk')};
function kzPdf(jpg,w,h){const enc=new TextEncoder(),parts=[],offs=[];let len=0;const add=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};
 const PW=842,PH=595,M=24,sc=Math.min((PW-2*M)/w,(PH-2*M)/h),dw=(w*sc).toFixed(2),dh=(h*sc).toFixed(2),dx=((PW-w*sc)/2).toFixed(2),dy=((PH-h*sc)/2).toFixed(2);
 const cs=`q ${dw} 0 0 ${dh} ${dx} ${dy} cm /Im0 Do Q`;add('%PDF-1.4\n');
 const obj=(n,body)=>{offs[n]=len;add(n+' 0 obj\n');add(body);add('\nendobj\n')};
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
 obj(4,`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
 offs[5]=len;add(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);add(jpg);add('\nendstream\nendobj\n');
 const xr=len;let t='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)t+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
 add(t+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`);return new Blob(parts,{type:'application/pdf'})}
async function certOpen(){if(!st.sealed)return;SFX.paper();const cv=await certCanvas();$('#cert-big').src=cv.toDataURL('image/png');const m=$('#cert-modal');m.classList.add('on');m.setAttribute('aria-hidden','false')}
function certClose(){const m=$('#cert-modal');m.classList.remove('on');m.setAttribute('aria-hidden','true')}
$('#cert').addEventListener('click',certOpen);$('#cert-close').onclick=()=>{SFX.tap();certClose()};
$('#cert-modal').addEventListener('click',e=>{if(e.target.id==='cert-modal')certClose()});
$('#cert-pdf').onclick=async()=>{SFX.tap();const cv=await certCanvas();const url=cv.toDataURL('image/jpeg',.94);const bin=atob(url.split(',')[1]);const jpg=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)jpg[i]=bin.charCodeAt(i);
 const blob=kzPdf(jpg,cv.width,cv.height),name='Urkunde_Winterzauberei.pdf';
 try{const f=new File([blob],name,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[f]})&&/iPhone|iPad|Android/i.test(navigator.userAgent)){await navigator.share({files:[f],title:'Urkunde Winterzauberei'});return}}catch(e){if(e&&e.name==='AbortError')return}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);toast('Urkunde als PDF gespeichert')};

// Testmodus: direkt zum Finale (nur mit gültigem probe)
if(params.get('fin')==='1'&&params.get('probe')){$('#btn-start').textContent='Zur Sternennacht';$('#btn-start').onclick=async()=>{ac();const q=params.get('probe');if(await kzSha(q)!=='f4c4125bb77f6326d8e44b3769bda526842e4f0ec9f36aeb3c9c12bd830806d9'){toast('Testmodus nicht verfügbar');return}st.act=1;for(let d=1;d<=24;d++){st.done[d]=1;st.open[d]=1}st.sealed=0;save();$('#codebox').style.display='none';startWind();musicOn();finale()}}
else if(Object.keys(st.open).length&&!params.get('intro')){$('#btn-start').textContent='Weiter zaubern';$('#btn-start').onclick=()=>{ac();if(st.act)goDesk();else access().then(ok=>ok&&goDesk())}}
$('#btn-book').innerHTML=IC.book;$('#btn-say').innerHTML=IC.sound;
// Für die Rätsel
window.Z={el,tone,bell,noise,SFX,toast,ac,sparkleAt,starPath,castle,sleep,clip};
window.ZDEBUG={finale,openCase,openEnv,st,save,renderDesk,show};
})();
