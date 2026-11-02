// Eigene Linien-Icons im Stil der Akademie (keine Emojis)
(function(){
const S=(d,extra)=>'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+(extra||'')+'</svg>';
window.IC={
 book:S('<path d="M3 5.5c3-1.2 6-1 9 1 3-2 6-2.2 9-1V19c-3-1.2-6-1-9 1-3-2-6-2.2-9-1z"/><path d="M12 6.5V20"/><path d="M6 9h3M6 12h3M15 9h3M15 12h3" opacity=".6"/>'),
 sound:S('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
 mute:S('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
 lock:S('<rect x="5.5" y="11" width="13" height="9.5" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/><path d="M12 14.5v2.5"/>'),
 key:S('<circle cx="7.5" cy="12" r="3.8"/><circle cx="7.5" cy="12" r="1.2"/><path d="M11.3 12H21M18 12v3M21 12v2.2"/>'),
 star:'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16.6l-5.8 3.5 1.6-6.5-5.1-4.4 6.7-.5z" fill="currentColor"/></svg>',
 chest:S('<path d="M3.5 11h17v8.5h-17z"/><path d="M3.5 11c0-4 3-6.5 8.5-6.5s8.5 2.5 8.5 6.5"/><path d="M3.5 14h17" opacity=".6"/><rect x="10.5" y="12.5" width="3" height="4" rx=".6"/>'),
 lantern:S('<path d="M12 1.8v2M9 3.8h6"/><path d="M7.5 7l2-3.2h5l2 3.2"/><path d="M7.5 7h9l-1 11.5h-7z"/><path d="M9.5 21h5M10 18.5v2.5M14 18.5v2.5"/>','<path d="M12 9.5c1.6 1.8 1.6 3.6 0 5.3-1.6-1.7-1.6-3.5 0-5.3z" fill="currentColor" stroke="none"/>'),
 bell:S('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2z"/><path d="M10 20.3a2.1 2.1 0 0 0 4 0"/><path d="M12 3v2"/>'),
 bellOff:S('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2z"/><path d="M10 20.3a2.1 2.1 0 0 0 4 0"/><path d="M4 4l16 16"/>'),
 castle:S('<path d="M3 21V10h2.5V8H7v2h2V8h1.5v2H12V5.5l2-2.5 2 2.5V10h1.5V8H19v2h2v11z"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/><path d="M6 13.5h1.5M16.5 13.5H18M13.2 7.5h-2.4"/>'),
 door:S('<path d="M5.5 21V9a6.5 6.5 0 0 1 13 0v12z"/><path d="M12 2.5V21" opacity=".5"/><circle cx="14.5" cy="13.5" r=".8" fill="currentColor"/><path d="M3.5 21h17"/>'),
 egg:S('<path d="M12 2.5c4 0 7 6.8 7 11.2a7 7 0 0 1-14 0C5 9.3 8 2.5 12 2.5z"/><path d="M9 11l1.6 1.4M13.5 8.5l1 1.5M14.5 14.5l1.5.8M9.5 16l1-1" opacity=".7"/>'),
 crystal:S('<path d="M12 2.5l6 6.5-6 12.5L6 9z"/><path d="M6 9h12M9.3 9L12 21.5 14.7 9M9.3 9L12 2.5 14.7 9"/>'),
 moon:'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.2a8.8 8.8 0 1 0 5.6 13.3A7.2 7.2 0 0 1 15.5 3.2z" fill="currentColor" opacity=".9"/></svg>',
 phone:S('<rect x="7.5" y="3" width="9" height="18" rx="2"/><path d="M11 18h2"/><path d="M3.5 9c-.8 1-.8 5 0 6M20.5 9c.8 1 .8 5 0 6"/>'),
 up:S('<path d="M6 15l6-6 6 6"/>'),down:S('<path d="M6 9l6 6 6-6"/>'),left:S('<path d="M15 6l-6 6 6 6"/>'),right:S('<path d="M9 6l6 6-6 6"/>'),
 rotL:S('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 3.5V8h4.5"/>'),rotR:S('<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 3.5V8h-4.5"/>'),
 hedgehog:'<svg class="ic" viewBox="0 0 48 30" aria-hidden="true"><path d="M6 24c0-9 7-16 17-16 7 0 12 3 15 8l4 1.5c1.3.5 1.3 2.3 0 2.8L38 22c-1 2-3 3-6 3H8c-1.2 0-2-.5-2-1z" fill="currentColor" opacity=".25"/><path d="M8 23l-2-5 4 1-1-6 5 3 1-6 4 4 2-6 3 5 3-5 2 6 4-3 0 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M38 16l4 1.5c1.3.5 1.3 2.3 0 2.8L38 22M12 25v2.5M30 25v2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="36" cy="17.5" r="1.1" fill="currentColor"/><circle cx="43.6" cy="18.8" r="1" fill="currentColor"/></svg>',
 candle:'<svg viewBox="0 0 40 64" aria-hidden="true"><defs><radialGradient id="cfl" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff7d6"/><stop offset=".45" stop-color="#ffcf5a"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient></defs><ellipse cx="20" cy="14" rx="13" ry="16" fill="url(#cfl)" opacity=".55"/><path d="M20 3c4.5 5.5 5 9.5 2.5 13.5-1 1.6-4 1.6-5 0C15 12.5 15.5 8.5 20 3z" fill="#ffd56a"/><path d="M20 8c2 2.8 2.2 5 1 7-.5.8-1.5.8-2 0-1.2-2-1-4.2 1-7z" fill="#fff7d6"/><path d="M20 17v4" stroke="#3b2a1e" stroke-width="1.4"/><rect x="13" y="21" width="14" height="34" rx="2" fill="#f2e6c8"/><path d="M13 25c2 2 4 0 6 2s4 0 8-1" fill="none" stroke="#e0d0a8" stroke-width="1.4"/><path d="M8 55h24l-3 5H11z" fill="#b8893a"/></svg>',
 bust:function(kind){const head='<circle cx="30" cy="27" r="11"/><path d="M12 62c0-12 8-20 18-20s18 8 18 20"/>';
  const acc={crown:'<path d="M19 15l4-7 4 5 3-7 3 7 4-5 4 7z" fill="currentColor" opacity=".85"/><path d="M26 37c2 1.5 6 1.5 8 0" opacity=".7"/>',
   shield:'<path d="M18 24c0-9 5-14 12-14s12 5 12 14H18z" fill="currentColor" opacity=".55"/><path d="M30 10v14"/><path d="M40 46l8-2v9c0 4-4 6-8 7-4-1-8-3-8-7v-9z" fill="currentColor" opacity=".35"/>',
   scroll:'<path d="M17 18l13-8 13 8-13 6z" fill="currentColor" opacity=".7"/><path d="M42 18v6"/><path d="M24 34c3 3 9 3 12 0" opacity=".7"/><path d="M44 48h10M44 48c-2 0-2 6 0 6h10c2 0 2-6 0-6" opacity=".8"/>'}[kind]||'';
  return '<svg class="bust" viewBox="0 0 60 62" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+head+acc+'</svg>'}
};
})();
