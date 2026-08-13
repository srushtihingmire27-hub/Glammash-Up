/* =====================================================================
   SVG SHAPE LIBRARY
   =====================================================================
   Draws the default placeholder clothing icons used until a category
   has real uploaded photos. Shared by index.html (Tops/Bottoms/
   Jewellery/Shoes) and dresses.html (Dresses) via a <script> tag.
   ===================================================================== */

function svgWrap(inner){
  return `<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}
function dots(cx,cy,n,r,color){
  let s='';
  for(let i=0;i<n;i++){
    const x = cx + (i%4)*16 - 24;
    const y = cy + Math.floor(i/4)*16 - 8;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
  }
  return s;
}
function stripes(x,y,w,h,color,gap){
  let s='';
  for(let i=0;i<w;i+=gap){
    s += `<rect x="${x+i}" y="${y}" width="${gap/2}" height="${h}" fill="${color}" opacity="0.55"/>`;
  }
  return s;
}

/* ---- TOPS ---- */
function topCrop(c1,c2,pat){
  return svgWrap(`
    <path d="M40 40 L20 55 L35 75 L45 60 L45 130 Q80 145 115 130 L115 60 L125 75 L140 55 L120 40 Q100 55 80 55 Q60 55 40 40 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='dots'?dots(80,95,8,4,c2):''}
    ${pat==='stripe'?stripes(45,60,70,60,c2,14):''}
  `);
}
function topTank(c1,c2,pat){
  return svgWrap(`
    <path d="M55 35 L50 55 L60 60 L65 45 L95 45 L100 60 L110 55 L105 35 Q80 25 55 35 Z" fill="${c2}"/>
    <path d="M60 55 Q80 65 100 55 L112 140 Q80 155 48 140 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='dots'?dots(80,100,8,4,c2):''}
  `);
}
function topBlouse(c1,c2,pat){
  return svgWrap(`
    <path d="M35 45 Q45 30 65 35 L80 48 L95 35 Q115 30 125 45 L140 65 L120 80 L112 65 L118 150 Q80 165 42 150 L48 65 L40 80 L20 65 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <circle cx="80" cy="70" r="4" fill="${c2}"/>
    <circle cx="80" cy="90" r="4" fill="${c2}"/>
    <circle cx="80" cy="110" r="4" fill="${c2}"/>
    ${pat==='stripe'?stripes(45,60,70,80,c2,12):''}
  `);
}
function topHalter(c1,c2,pat){
  return svgWrap(`
    <path d="M80 30 L70 45 L90 45 Z" fill="${c2}"/>
    <path d="M55 50 Q80 40 105 50 L112 145 Q80 158 48 145 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='dots'?dots(80,100,8,4,c2):''}
  `);
}
function topSweater(c1,c2,pat){
  return svgWrap(`
    <path d="M35 45 L20 65 L35 78 L45 62 L45 140 Q80 155 115 140 L115 62 L125 78 L140 65 L125 45 Q100 60 80 60 Q60 60 35 45 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <path d="M45 65 h70 M45 85 h70 M45 105 h70 M45 125 h70" stroke="${c2}" stroke-width="2" opacity="0.5"/>
  `);
}
const topShapeFns = [topCrop, topTank, topBlouse, topHalter, topSweater];

/* ---- BOTTOMS (jeans + skirts) ---- */
function bottomSkinny(c1,c2,pat){
  return svgWrap(`
    <path d="M50 30 h60 l4 40 -10 100 -18 0 -6 -70 -6 70 -18 0 -10 -100 z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='stripe'?stripes(50,30,60,40,c2,10):''}
    <rect x="50" y="30" width="60" height="14" fill="${c2}" opacity="0.6"/>
  `);
}
function bottomWide(c1,c2,pat){
  return svgWrap(`
    <path d="M48 30 h64 l10 45 8 95 -22 0 -18 -85 -18 85 -22 0 8 -95 z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <rect x="48" y="30" width="64" height="14" fill="${c2}" opacity="0.6"/>
    ${pat==='dots'?dots(80,110,6,4,c2):''}
  `);
}
function bottomMiniSkirt(c1,c2,pat){
  return svgWrap(`
    <path d="M45 40 h70 l14 70 -98 0 z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <rect x="45" y="40" width="70" height="12" fill="${c2}" opacity="0.6"/>
    ${pat==='pleat'?`<path d="M55 45 L50 108 M70 44 L67 110 M85 44 L88 110 M100 45 L108 108" stroke="${c2}" stroke-width="2" opacity="0.5"/>`:''}
  `);
}
function bottomPleatSkirt(c1,c2,pat){
  return svgWrap(`
    <path d="M42 38 h76 l18 78 -112 0 z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <path d="M50 42 L38 112 M64 40 L56 114 M80 40 L80 116 M96 40 L104 114 M110 42 L122 112" stroke="${c2}" stroke-width="2" opacity="0.55"/>
    <rect x="42" y="38" width="76" height="10" fill="${c2}" opacity="0.6"/>
  `);
}
function bottomCargo(c1,c2,pat){
  return svgWrap(`
    <path d="M50 30 h60 l4 40 -10 100 -18 0 -6 -70 -6 70 -18 0 -10 -100 z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <rect x="40" y="90" width="20" height="24" rx="4" fill="${c2}" opacity="0.7"/>
    <rect x="100" y="90" width="20" height="24" rx="4" fill="${c2}" opacity="0.7"/>
  `);
}
const bottomShapeFns = [bottomSkinny, bottomWide, bottomMiniSkirt, bottomPleatSkirt, bottomCargo];

/* ---- JEWELLERY ---- */
function jewelNecklace(c1,c2,pat){
  return svgWrap(`
    <path d="M40 40 Q80 100 120 40" fill="none" stroke="${c1}" stroke-width="5"/>
    <circle cx="80" cy="105" r="10" fill="${c2}" stroke="${c1}" stroke-width="2"/>
  `);
}
function jewelChoker(c1,c2,pat){
  return svgWrap(`
    <path d="M35 60 Q80 90 125 60" fill="none" stroke="${c1}" stroke-width="8"/>
    ${dots(80,72,4,3,c2)}
  `);
}
function jewelHoops(c1,c2,pat){
  return svgWrap(`
    <circle cx="55" cy="90" r="28" fill="none" stroke="${c1}" stroke-width="7"/>
    <circle cx="105" cy="90" r="28" fill="none" stroke="${c1}" stroke-width="7"/>
    <circle cx="55" cy="62" r="4" fill="${c2}"/>
    <circle cx="105" cy="62" r="4" fill="${c2}"/>
  `);
}
function jewelBracelets(c1,c2,pat){
  return svgWrap(`
    <ellipse cx="80" cy="70" rx="38" ry="14" fill="none" stroke="${c1}" stroke-width="6"/>
    <ellipse cx="80" cy="95" rx="38" ry="14" fill="none" stroke="${c2}" stroke-width="6"/>
    <ellipse cx="80" cy="120" rx="38" ry="14" fill="none" stroke="${c1}" stroke-width="6"/>
  `);
}
function jewelRings(c1,c2,pat){
  return svgWrap(`
    <circle cx="55" cy="80" r="14" fill="none" stroke="${c1}" stroke-width="6"/>
    <circle cx="55" cy="66" r="5" fill="${c2}"/>
    <circle cx="100" cy="100" r="16" fill="none" stroke="${c2}" stroke-width="6"/>
    <circle cx="100" cy="84" r="6" fill="${c1}"/>
  `);
}
const jewelShapeFns = [jewelNecklace, jewelChoker, jewelHoops, jewelBracelets, jewelRings];

/* ---- SHOES ---- */
function shoeSneaker(c1,c2,pat){
  return svgWrap(`
    <path d="M20 140 Q20 120 45 118 L70 100 L110 108 Q135 112 140 130 L140 150 L20 150 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <path d="M45 118 L70 100 L80 112 L60 128 Z" fill="${c2}" opacity="0.7"/>
    ${pat==='stripe'?`<path d="M50 130 h70" stroke="${c2}" stroke-width="4"/>`:''}
  `);
}
function shoeHeel(c1,c2,pat){
  return svgWrap(`
    <path d="M35 100 Q60 95 95 105 L120 112 L118 130 L45 140 Q30 138 30 125 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <path d="M118 130 L128 165 L112 168 L110 132 Z" fill="${c2}"/>
    ${pat==='dots'?dots(75,118,4,3,c2):''}
  `);
}
function shoeSandal(c1,c2,pat){
  return svgWrap(`
    <ellipse cx="80" cy="135" rx="55" ry="16" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <path d="M50 122 Q80 100 110 122" fill="none" stroke="${c2}" stroke-width="6"/>
    <path d="M65 122 L65 100 M95 122 L95 100" stroke="${c2}" stroke-width="4"/>
  `);
}
function shoeBoot(c1,c2,pat){
  return svgWrap(`
    <path d="M55 50 h35 v75 l35 10 v18 h-105 v-18 z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='stripe'?stripes(55,55,35,60,c2,10):''}
    <rect x="55" y="120" width="35" height="8" fill="${c2}" opacity="0.6"/>
  `);
}
function shoeFlat(c1,c2,pat){
  return svgWrap(`
    <path d="M25 130 Q30 112 55 112 L100 118 Q135 122 135 138 L135 145 L25 145 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <circle cx="60" cy="118" r="6" fill="${c2}"/>
  `);
}
const shoeShapeFns = [shoeSneaker, shoeHeel, shoeSandal, shoeBoot, shoeFlat];

/* ---- DRESSES ---- */
function dressSlip(c1,c2,pat){
  return svgWrap(`
    <path d="M60 30 L52 45 L60 55 L55 175 Q80 190 105 175 L100 55 L108 45 L100 30 Q80 40 60 30 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='dots'?dots(80,110,8,4,c2):''}
  `);
}
function dressPuff(c1,c2,pat){
  return svgWrap(`
    <circle cx="40" cy="45" r="14" fill="${c2}"/>
    <circle cx="120" cy="45" r="14" fill="${c2}"/>
    <path d="M55 40 Q80 30 105 40 L100 70 Q80 62 60 70 Z" fill="${c1}"/>
    <path d="M60 68 Q80 78 100 68 L112 175 Q80 190 48 175 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
  `);
}
function dressWrap(c1,c2,pat){
  return svgWrap(`
    <path d="M55 35 L45 60 L75 90 L50 175 Q80 192 110 175 L85 90 L115 60 L105 35 Q80 55 55 35 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    <path d="M55 35 L85 90" stroke="${c2}" stroke-width="2" opacity="0.5"/>
  `);
}
function dressTulle(c1,c2,pat){
  return svgWrap(`
    <path d="M62 32 L58 50 L102 50 L98 32 Q80 42 62 32 Z" fill="${c1}"/>
    <path d="M50 50 Q80 65 110 50 L135 175 Q80 200 25 175 Z" fill="${c1}" stroke="${c2}" stroke-width="3" opacity="0.9"/>
    ${dots(80,120,8,3,c2)}
  `);
}
function dressMaxiHalter(c1,c2,pat){
  return svgWrap(`
    <path d="M80 28 L65 45 L95 45 Z" fill="${c2}"/>
    <path d="M60 50 Q80 42 100 50 L118 190 L42 190 Z" fill="${c1}" stroke="${c2}" stroke-width="3"/>
    ${pat==='stripe'?stripes(45,60,70,120,c2,14):''}
  `);
}
const dressShapeFns = [dressSlip, dressPuff, dressWrap, dressTulle, dressMaxiHalter];

/* ---- shared palette + pattern helpers ---- */
const palettes = [
  ['#ff9fce','#e91e8c'], ['#ffe08a','#d4af37'], ['#c9a6ff','#7a3fd4'],
  ['#a8e6cf','#3fa887'], ['#ffb199','#e05c3d'], ['#9ecbff','#3f7fd4'],
  ['#f7c6d9','#b03d6b'], ['#fff3b0','#c99a1f'], ['#d3b8ff','#5e2ea6'],
  ['#ffd6a5','#c9711a']
];
const patterns = ['plain','dots','stripe','pleat'];

// builds 10 default placeholder items for a category from its 5 shape
// functions + names, cycling through the shared palettes/patterns
function buildDefaultItems(names, shapeFns){
  const items = [];
  for(let i=0;i<10;i++){
    const shapeFn = shapeFns[i % shapeFns.length];
    const [c1,c2] = palettes[i % palettes.length];
    const pat = patterns[i % patterns.length];
    items.push({ name: names[i], svg: shapeFn(c1,c2,pat) });
  }
  return items;
}
