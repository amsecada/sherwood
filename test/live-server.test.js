import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from '../src/server.js';
import {createCookViewer} from '../src/cookviewer.js';
const property={PIN14:'01011000250000',street_address:'100 TEST ST',township_name:'Test',TAXYR:2026,BCLASS:'203',NBHD:12,BLDGSQFT:1000,CURRENTVALUE_TOTAL:37000,current_procname:'CCAOVALUE',current_value_desc:'2026 Assessor Valuation'};
async function setup(t,fetchImpl) {
 const server=createServer({cookViewer:createCookViewer({fetchImpl}),operatorToken:'test-only'});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const url=`http://127.0.0.1:${server.address().port}`;
 return {url,post:async(path,body,origin)=>{
  const response=await fetch(url+path,{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify(body)});
  return {status:response.status,data:await response.json()};
 }};
}
test('live lookup and candidate routes query real reader while rejecting real contact creation',async t=>{
 const f=async u=>new Response(JSON.stringify({features:[{attributes:new URL(u).searchParams.get('where').includes('<>')?{...property,PIN14:'01011000430000'}:property}]}));
 const {post}=await setup(t,f);
 const r=await post('/api/live/lookup',{type:'pin',value:property.PIN14});assert.equal(r.status,200);assert.equal(r.data.records[0].CURRENTVALUE_TOTAL,37000);
 const c=await post('/api/live/candidates',{pin:property.PIN14});assert.equal(c.status,200);assert.equal(c.data.state,'candidates');assert.equal(c.data.records.length,1);
 assert.equal((await post('/api/requests',{parcelId:property.PIN14,providerId:'demo-professional',name:'Test',email:'test@example.test',consent:true,consentVersion:'demo-consent-1'})).status,404);
});
test('live route surfaces source error and validates input before external querying',async t=>{
 const {post}=await setup(t,async()=>{throw new TypeError('fetch failed');});
 assert.equal((await post('/api/live/lookup',{type:'pin',value:'123'})).status,400);
 assert.equal((await post('/api/live/candidates',{pin:'https://evil.test'})).status,400);
 assert.equal((await post('/api/live/lookup',{type:'address',value:'100 TEST ST'})).status,502);
 assert.equal((await post('/api/live/lookup',{type:'address',value:'100 TEST ST'},'https://evil.test')).status,403);
});
