import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export function outgoingLinks(text) {
 const links=new Set();
 // HTML anchors, JS-assigned hrefs and the source-layer URL used by provenance links.
 for(const match of text.matchAll(/(?:\bhref\s*=\s*|\bCOOKVIEWER_LAYER\s*=\s*)["'](https?:\/\/[^"'<>\s]+)["']/g)) links.add(match[1].replaceAll('&amp;','&'));
 return [...links];
}
export async function checkLink(url,{fetchImpl=fetch,attempts=3,wait=ms=>new Promise(r=>setTimeout(r,ms)),timeout=15000}={}) {
 let result;
 for(let attempt=0;attempt<attempts;attempt++) {
  try {
   const response=await fetchImpl(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(timeout),headers:{'User-Agent':'Sherwood-link-check/1.0 (+https://github.com/amsecada/sherwood)'}});
   await response.body?.cancel();
   result={url,finalUrl:response.url,status:response.status,ok:response.ok};
   if(response.ok || (response.status<500 && response.status!==429)) return result;
  } catch(error) {result={url,ok:false,error:error.message};}
  if(attempt+1<attempts) await wait(1000*(attempt+1));
 }
 return result;
}
async function main() {
 const links=new Set();
 for(const name of await readdir('public')) if(/\.(html|js)$/.test(name)) for(const url of outgoingLinks(await readFile(`public/${name}`,'utf8'))) links.add(url);
 if(!links.size) throw new Error('No outgoing links discovered.');
 let failures=0;
 // Serial, bounded requests: do not crawl linked pages or map tiles.
 for(const url of [...links].sort()) {
  const result=await checkLink(url);if(!result.ok) failures++;
  console.log(`${result.ok?'PASS':'FAIL'} ${url} -> ${result.status||result.error}${result.finalUrl&&result.finalUrl!==url?' '+result.finalUrl:''}`);
 }
 if(failures) process.exitCode=1;
 console.log(`${links.size} outgoing links checked; ${failures} failed. Checks HTTP reachability, not page content or fragment targets.`);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) await main();
