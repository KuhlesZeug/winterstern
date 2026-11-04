// Zugang: Code aus dem PDF oder persönlicher Geschenklink
window.KZ_H='0bf06a70bbfa25163e4ca20e7afe12c98cf2674d84ad108e7ad491ebdf115730';
window.kzSha=async s=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
window.kzNormCode=s=>(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
window.kzSig=async(an,von,msg)=>(await kzSha(KZ_H+'|'+an+'|'+von+'|'+(msg||''))).slice(0,12);
window.kzEnc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
window.kzDec=g=>JSON.parse(decodeURIComponent(escape(atob(g.replace(/-/g,'+').replace(/_/g,'/')))));

// Geheime Botschaft für Heiligabend: im Link nicht im Klartext lesbar
window.kzKey=()=>{const h=KZ_H;const k=[];for(let i=0;i<h.length;i+=2)k.push(parseInt(h.substr(i,2),16));return k};
window.kzHide=s=>{const b=new TextEncoder().encode(s),k=kzKey();let r='';b.forEach((x,i)=>r+=String.fromCharCode(x^k[i%k.length]^(i*7&255)));return btoa(r).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
window.kzShow=s=>{try{const r=atob(s.replace(/-/g,'+').replace(/_/g,'/')),k=kzKey(),b=new Uint8Array(r.length);for(let i=0;i<r.length;i++)b[i]=r.charCodeAt(i)^k[i%k.length]^(i*7&255);return new TextDecoder().decode(b)}catch(e){return ''}};
window.kzMsg=(m,s)=>(m||'')+(s?'\u241F'+s:'');
