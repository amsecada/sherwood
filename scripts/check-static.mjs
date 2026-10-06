import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
const files=await readdir('dist');assert.ok(files.includes('index.html'));
assert.ok(!files.some(f=>/operator|server|fixtures|token|\.env/.test(f)));
for(const file of files){
 const text=await readFile(`dist/${file}`,'utf8');
 assert.doesNotMatch(text,/['"]\/api\//,`${file}: server API dependency`);
 assert.doesNotMatch(text,/\b(?:localStorage|sessionStorage|indexedDB)\b/,`${file}: persistent browser storage`);
 for(const match of text.matchAll(/(?:from\s+|(?:src|href)=)["']\.\/([^"']+)["']/g)) assert.ok(files.includes(match[1]),`${file}: missing ${match[1]}`);
 assert.doesNotMatch(text,/(?:src|href)=["']\/(?!\/)/,`${file}: root-only asset path`);
}
console.log('PASS: static artifact paths, no server API, no storage or private assets.');
