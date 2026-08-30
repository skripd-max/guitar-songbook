import{isChord}from'./chord-engine.js';
const JUNK=/^(ultimate guitar|shots|articles|forums|publish tab|pro|login|sign up|favorite|autoscroll|transpose|font size|simplify|edit|add to playlist|report bad tab|comments?|страница|реклама|поделиться)$/i;
export function parseSong(raw){let text=raw.replace(/\r/g,'').replace(/\u00a0/g,' ').trim();const lines=text.split('\n').map(x=>x.trimEnd()).filter((x,i,a)=>!(x===''&&a[i-1]===''));
 let title='',artist='',key='',capo=0;for(let i=0;i<Math.min(lines.length,35);i++){const l=lines[i].trim();let m=l.match(/^(.+?)\s+(?:Chords|Tabs)\s+by\s+(.+)$/i);if(m&&!title){title=m[1].trim();artist=m[2].trim()}m=l.match(/^(?:title|название|песня)\s*[:—-]\s*(.+)$/i);if(m)title=m[1];m=l.match(/^(?:artist|исполнитель)\s*[:—-]\s*(.+)$/i);if(m)artist=m[1];m=l.match(/^(?:key|тональность)\s*[:—-]\s*([A-G][#b]?m?)/i);if(m)key=m[1];m=l.match(/^(?:capo|каподастр)\s*[:—-]?\s*(\d+)/i);if(m)capo=+m[1]}
 const tabIndex=lines.findIndex(l=>/^(?:chords?|аккорды|текст песни)\s*$/i.test(l.trim()));let bodyLines=(tabIndex>=0?lines.slice(tabIndex+1):lines).filter(l=>!JUNK.test(l.trim()));
 if(!title){const candidates=lines.slice(0,15).map(x=>x.trim()).filter(x=>x&&x.length<100&&!JUNK.test(x)&&!isChord(x)&&!/[|]{2}/.test(x)&&!/^\d[\d,]*\s+views?/i.test(x));title=candidates[0]||'Без названия'}
 const firstMusical=bodyLines.findIndex(l=>/\[[A-G][#b]?/.test(l)||l.trim().split(/\s+/).filter(isChord).length>=2);if(firstMusical>2)bodyLines=bodyLines.slice(firstMusical);
 return{title,artist,key,capo,body:bodyLines.join('\n').trim()}}
