// Ton: blockierte Wiedergabe beim nächsten Antippen nachholen, im Hintergrund anhalten und danach an derselben Stelle weiter
(function(){
const live=new Set(),ctxs=new Set(),queue=new Map();let hid=[],hidCtx=[];
const P=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){live.add(this);const el=this;queue.delete(el);const r=P.apply(this,arguments);
 if(r&&r.catch){r.catch(e=>{if(e&&e.name==='NotAllowedError'&&!document.hidden)queue.set(el,Date.now())})}return r};
const PA=HTMLMediaElement.prototype.pause;
HTMLMediaElement.prototype.pause=function(){queue.delete(this);return PA.apply(this,arguments)};
['AudioContext','webkitAudioContext'].forEach(k=>{const C=window[k];if(!C)return;const W=function(){const c=new C(...arguments);ctxs.add(c);return c};W.prototype=C.prototype;try{window[k]=W}catch(e){}});
function gesture(){ctxs.forEach(c=>{try{if(c.state==='suspended')c.resume()}catch(e){}});
 if(queue.size){const now=Date.now(),q=[...queue];queue.clear();q.forEach(([el,t])=>{if(now-t>20000||el.ended)return;try{P.call(el).catch(()=>{})}catch(e){}})}}
['touchend','pointerup','click','keydown'].forEach(e=>document.addEventListener(e,gesture,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){hid=[];live.forEach(el=>{if(!el.paused&&!el.ended){hid.push(el);try{PA.call(el)}catch(e){}}});
  hidCtx=[];ctxs.forEach(c=>{if(c.state==='running'){hidCtx.push(c);try{c.suspend()}catch(e){}}})}
 else{hidCtx.forEach(c=>{try{c.resume()}catch(e){}});hidCtx=[];
  hid.forEach(el=>{try{const r=P.call(el);r&&r.catch&&r.catch(()=>queue.set(el,Date.now()))}catch(e){}});hid=[]}});
window.addEventListener('pageshow',()=>ctxs.forEach(c=>{try{if(c.state==='suspended')c.resume()}catch(e){}}));
})();
