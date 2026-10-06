import test from 'node:test';
import assert from 'node:assert/strict';
import {outgoingLinks,checkLink} from '../scripts/check-links.mjs';
test('discovers anchors and source provenance without crawling assets',()=>{
 assert.deepEqual(outgoingLinks(`<a href="https://example.test/a">x</a>; credit.href = 'https://example.test/b'; const COOKVIEWER_LAYER = 'https://example.test/source'; image.src='https://tiles.test/x'; <a href="/local">x</a>`),['https://example.test/a','https://example.test/b','https://example.test/source']);
});
test('success includes final redirect destination, 404 is a failure without retry',async()=>{
 const ok=await checkLink('https://example.test',{fetchImpl:async()=>({ok:true,status:200,url:'https://example.test/new'})});assert.equal(ok.ok,true);assert.equal(ok.finalUrl,'https://example.test/new');
 let count=0;const missing=await checkLink('https://example.test',{fetchImpl:async()=>{count++;return {ok:false,status:404};}});assert.equal(missing.ok,false);assert.equal(count,1);
});
test('transient failures retry within the bound and exhaustion fails CI',async()=>{
 let count=0;const options={wait:async()=>{},fetchImpl:async()=>{count++;return {ok:count===3,status:count===3?200:503};}};
 assert.equal((await checkLink('https://example.test',options)).ok,true);assert.equal(count,3);
 assert.equal((await checkLink('https://example.test',{wait:async()=>{},fetchImpl:async()=>{throw new Error('network unavailable');}})).ok,false);
});
