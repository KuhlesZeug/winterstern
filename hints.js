/* Hinweiskarten: Zeichnungen von Meisterin Eibenhain, antippbar zum Vergrößern */
(function(){
const INK='#2b2340',NAVY='#1f2a5c',GOLD='#b8893a',PAP='#f7eedb',LINE='rgba(43,35,64,.3)';
const T=(x,y,s,o)=>`<text x="${x}" y="${y}" ${o||''}>${s}</text>`;
const H=`font-family="'Cinzel',serif" font-weight="700"`;
function card(title,body,note){return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="'Cormorant Garamond',Georgia,serif" fill="${INK}">`+
 `<defs><radialGradient id="hpg" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#fbf5e6"/><stop offset="1" stop-color="#ead9b3"/></radialGradient></defs>`+
 `<rect x="3" y="3" width="314" height="234" rx="10" fill="url(#hpg)" stroke="${GOLD}" stroke-width="1.6"/>`+
 `<rect x="10" y="10" width="300" height="220" rx="6" fill="none" stroke="${GOLD}" stroke-width=".7" opacity=".7"/>`+
 [[18,18],[302,18],[18,222],[302,222]].map(([x,y])=>`<path d="M${x} ${y-5} L${x+2} ${y-1} L${x+6} ${y} L${x+2} ${y+1} L${x} ${y+5} L${x-2} ${y+1} L${x-6} ${y} L${x-2} ${y-1}Z" fill="${GOLD}"/>`).join('')+
 `<text x="160" y="33" text-anchor="middle" ${H} font-size="12.5" letter-spacing="1.5" fill="${NAVY}">${title}</text>`+
 `<path d="M95 41 H150 M170 41 H225" stroke="${GOLD}" stroke-width=".9"/><path d="M160 37 l3 4 -3 4 -3 -4z" fill="${GOLD}"/>`+body+
 (note?`<text x="160" y="220" text-anchor="middle" font-size="13" font-style="italic" fill="#5b4a7a">${note}</text>`:'')+`</svg>`}

/* Regenbogen */
const cols=[['Rot','#c8372d'],['Orange','#e2832e'],['Gelb','#e8c13d'],['Grün','#4f9d4a'],['Blau','#4a7fd4']];
let rb='';cols.forEach(([n,c],i)=>{const r=92-i*13;rb+=`<path d="M${200-r} 186 A${r} ${r} 0 0 1 ${200+r} 186" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="butt"/>`});
cols.forEach(([n,c],i)=>{rb+=`<circle cx="${30}" cy="${70+i*20}" r="6" fill="${c}"/>`+T(42,75+i*20,(i+1)+'. '+n,'font-size="14" font-weight="700"')});
rb+=`<path d="M236 72 C256 62 276 72 284 90" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3"/><path d="M284 90 l-7 -2 4 -6z" fill="${INK}"/>`+T(262,64,'außen zuerst','text-anchor="middle" font-size="12" font-style="italic"');
const RAINBOW=card('DIE FARBEN DES REGENBOGENS',rb,'Erst Rot, ganz zuletzt Blau.');

/* Mondphasen, abnehmend: links leuchtet */
function moon(cx,cy,r,k){/* k: 1 voll, 0 neu, Anteil der beleuchteten linken Fläche als Terminator */
 let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2a2f55"/>`;
 if(k>=1)return s+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f6e7b0"/>`;if(k<=0)return s+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f6e7b0" stroke-width=".8" opacity=".5"/>`;
 const rx=Math.abs(2*k-1)*r,sw=k>.5?0:1;
 return s+`<path d="M${cx} ${cy-r} A${r} ${r} 0 0 0 ${cx} ${cy+r} A${rx.toFixed(1)} ${r} 0 0 ${sw} ${cx} ${cy-r}Z" fill="#f6e7b0"/>`}
let mo='';const ph=[[1,'Vollmond'],[.75,''],[.5,'Halbmond'],[.2,'Sichel'],[0,'Neumond']];
ph.forEach(([k,n],i)=>{const x=38+i*61;mo+=moon(x,110,22,k)+(n?T(x,150,n,'text-anchor="middle" font-size="13" font-weight="700"'):'')});
mo+=`<path d="M30 172 H290" stroke="${GOLD}" stroke-width="1.5"/><path d="M290 172 l-9 -5 v10z" fill="${GOLD}"/>`+T(160,190,'der Mond nimmt ab, Nacht für Nacht','text-anchor="middle" font-size="13.5" font-style="italic"');
mo+=T(160,66,'Beim abnehmenden Mond leuchtet die linke Seite.','text-anchor="middle" font-size="13.5" font-weight="700"');
const MOON=card('SILBERHAARS MONDBUCH',mo,'');

/* Waage */
const egg=(x,y)=>`<image href="z/i_drachenei.webp" x="${x-16}" y="${y-20}" width="32" height="40"/>`;
const cry=(x,y)=>`<image href="ic/crystal.webp" x="${x-15}" y="${y-17}" width="30" height="34"/>`;
const ms=(x,y)=>`<image href="z/i_mondstein.webp" x="${x-13}" y="${y-13}" width="26" height="26"/>`;
let wg=egg(40,86)+T(66,92,'=','font-size="22" font-weight="700"')+cry(96,86)+T(116,92,'+','font-size="20"')+cry(136,86)+T(156,92,'+','font-size="20"')+ms(178,86);
wg+=T(204,80,'Ein Drachenei','font-size="13" font-weight="700"')+T(204,96,'wiegt zwei Kristalle','font-size="12"')+T(204,110,'und einen Mondstein','font-size="12"');
wg+=cry(40,150)+T(66,156,'=','font-size="22" font-weight="700"')+ms(96,150)+T(116,156,'+','font-size="20"')+ms(136,150);
wg+=T(204,146,'Ein Kristall','font-size="13" font-weight="700"')+T(204,162,'wiegt zwei','font-size="12"')+T(204,176,'Mondsteine','font-size="12"');
wg+=`<path d="M20 122 H300" stroke="${GOLD}" stroke-width=".7" stroke-dasharray="3 4"/>`;
const SCALE=card('MEISTER KESSLERS REZEPTBUCH',wg,'Tausche jeden Kristall gegen zwei Mondsteine.');

/* Tastenfeld */
let kp='';for(let i=0;i<9;i++){const c=i%3,r=Math.floor(i/3),x=52+c*42,y=78+r*42;kp+=`<circle cx="${x}" cy="${y}" r="13" fill="#fbf5e6" stroke="${NAVY}" stroke-width="1.6"/>`+T(x,y+5,i+1,`text-anchor="middle" ${H} font-size="14" fill="${NAVY}"`)}
kp+=T(176,92,'Oben links ist die 1,','font-size="14"')+T(176,110,'unten rechts die 9.','font-size="14"')+T(176,140,'Wie auf einem','font-size="13" font-style="italic"')+T(176,156,'Telefon zählt man','font-size="13" font-style="italic"')+T(176,172,'Zeile für Zeile.','font-size="13" font-style="italic"');
const KEYPAD=card('DIE NEUN PUNKTE IM ZAUBERBUCH',kp,'Setz den Stab ab, wenn das Muster es sagt.');

/* Kompass mit Sonne */
let cp=`<g transform="translate(112 120)"><circle r="52" fill="#fbf5e6" stroke="${NAVY}" stroke-width="1.6"/><path d="M0-44 L8 0 L0 44 L-8 0Z" fill="${NAVY}"/><path d="M-44 0 L0 8 L44 0 L0 -8Z" fill="${NAVY}" opacity=".45"/><path d="M0-44 L8 0 L-8 0Z" fill="${GOLD}"/>`+
 T(0,-58,'Norden','text-anchor="middle" font-size="13" font-weight="700"')+T(0,68,'Süden','text-anchor="middle" font-size="13" font-weight="700"')+T(-80,4,'Westen','text-anchor="middle" font-size="13" font-weight="700"')+T(80,4,'Osten','text-anchor="middle" font-size="13" font-weight="700"')+'</g>';
cp+=`<g transform="translate(250 100)"><circle r="13" fill="#f2b84a"/>`+[0,45,90,135,180,225,270,315].map(a=>`<line x1="0" y1="-17" x2="0" y2="-23" stroke="#f2b84a" stroke-width="2" transform="rotate(${a})"/>`).join('')+`<path d="M-30 14 H30" stroke="${NAVY}" stroke-width="1.5"/></g>`;
cp+=T(250,150,'Hier geht die','text-anchor="middle" font-size="13" font-style="italic"')+T(250,166,'Sonne auf.','text-anchor="middle" font-size="13" font-style="italic"');
const COMPASS=card('DIE HIMMELSRICHTUNGEN',cp,'Norden oben, Osten rechts, Westen links.');

/* Halbieren */
let hv='';const nums=['96','48','24','?'];nums.forEach((n,i)=>{const x=46+i*76;hv+=`<g transform="translate(${x} 112)"><path d="M-16 18 h32 l-4 -26 a12 12 0 0 0 -24 0z" fill="${GOLD}" opacity=".85"/><circle cy="20" r="3.5" fill="${INK}"/></g>`+T(x,160,n,`text-anchor="middle" ${H} font-size="20" fill="${n==='?'?'#8a2a3a':NAVY}"`)+
 T(x,182,['Montag','Dienstag','Mittwoch','Donnerstag'][i],'text-anchor="middle" font-size="12.5" font-style="italic"');
 if(i<3)hv+=`<path d="M${x+20} 70 Q${x+38} 56 ${x+56} 70" fill="none" stroke="${INK}" stroke-width="1.2"/><path d="M${x+56} 70 l-7 -1 4 -5z" fill="${INK}"/>`+T(x+38,58,'halb so oft','text-anchor="middle" font-size="11.5"')});
const HALF=card('DIE TURMGLOCKE',hv,'Jeden Abend die Hälfte vom Abend davor.');

window.HVIS={'2_1':RAINBOW,'5_1':MOON,'12_1':SCALE,'17_1':KEYPAD,'18_1':COMPASS,'23_1':HALF};
window.HVIS_WHO='Zeichnung von Meisterin Eibenhain';
})();
