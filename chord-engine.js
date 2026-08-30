const SHARPS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLATS=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const NOTE=/^([A-G])([#b]?)(.*)$/;
export function splitChord(chord){const slash=chord.split('/');const m=slash[0].match(NOTE);if(!m)return null;return{root:m[1]+m[2],suffix:m[3],bass:slash[1]||''}}
function noteIndex(n){return SHARPS.indexOf(n)>=0?SHARPS.indexOf(n):FLATS.indexOf(n)}
export function transposeChord(chord,steps){const p=splitChord(chord);if(!p)return chord;const preferFlat=p.root.includes('b')||p.bass.includes('b');const names=preferFlat?FLATS:SHARPS;const shift=n=>names[(noteIndex(n)+steps+120)%12];return shift(p.root)+p.suffix+(p.bass?'/'+shift(p.bass):'')}
export function isChord(token){const clean=token.replace(/[()[\],:;|]/g,'');const p=splitChord(clean);return !!p&&/^(?:m|min|maj|M)?(?:\d{0,2})?(?:sus[24]?|dim\d*|aug\d*|add\d+|[#b]\d+|no\d+|\([^)]*\))*$/.test(p.suffix)}
export function extractChords(body){const found=[];const bracket=/\[([^\]]+)\]/g;for(const m of body.matchAll(bracket))if(isChord(m[1]))found.push(m[1]);for(const line of body.split('\n')){const words=line.trim().split(/\s+/).filter(Boolean);if(words.length&&words.filter(isChord).length/words.length>=.6)words.filter(isChord).forEach(x=>found.push(x.replace(/[|,]/g,'')))}return[...new Set(found)]}
export function transposeBody(body,steps){return body.replace(/\[([^\]]+)\]/g,(m,c)=>isChord(c)?`[${transposeChord(c,steps)}]`:m).split('\n').map(line=>{const words=line.trim().split(/\s+/).filter(Boolean);if(words.length&&words.filter(isChord).length/words.length>=.6)return line.replace(/\b[A-G][#b]?(?:m|min|maj|M)?(?:\d{0,2})?(?:sus[24]?|dim\d*|aug\d*|add\d+|[#b]\d+|no\d+|\([^)]*\))?(?:\/[A-G][#b]?)?\b/g,c=>transposeChord(c,steps));return line}).join('\n')}
export function normalizeKnown(s){return new Set(s.split(/[\s,;]+/).filter(Boolean))}
export function unknownFor(body,known,shift=0){return extractChords(body).map(c=>transposeChord(c,shift)).filter(c=>!known.has(c))}
export function bestTranspositions(body,known){return Array.from({length:12},(_,i)=>i-6).map(shift=>({shift,unknown:unknownFor(body,known,shift)})).sort((a,b)=>a.unknown.length-b.unknown.length||Math.abs(a.shift)-Math.abs(b.shift))}
