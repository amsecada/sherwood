import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from '../src/server.js';
import {createCookViewer} from '../src/cookviewer.js';
import {createRequests} from '../src/requests.js';
const subject={PIN14:'01011000250000',street_address:'100 TEST ST',township_name:'Test',TAXYR:2026,BCLASS:'203',NBHD:12,BLDGSQFT:1000,CURRENTVALUE_TOTAL:100,current_procname:'TEST',current_value_desc:'County',latitude:42,longitude:-88};
const candidate={...subject,PIN14:'01011000430000',CURRENTVALUE_TOTAL:90};
async function setup(t){
 let clock=0;
 const reader=createCookViewer({fetchImpl:async u=>new Response(JSON.stringify({features:[{attributes:new URL(u).searchParams.get('where').includes('<>')?candidate:subject}]}))});
 const server=createServer({operatorToken:'test-operator',cookViewer:reader,now:()=>clock});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base=`http://127.0.0.1:${server.address().port}`;
 const call=async(path,body,token,method=body?'POST':'GET')=>{const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()};};
 const evidence=async()=> (await call('/api/live/candidates',{pin:subject.PIN14})).data;
 const payload=reference=>({reference,providerId:'demo-professional',consent:true,consentVersion:'live-demo-consent-2'});
 return {call,evidence,payload,setTime:t=>clock=t,base};
}
test('live handoff uses trusted snapshot, rejects injected evidence, and remains private',async t=>{
 const {call,evidence,payload}=await setup(t);const e=await evidence();assert.equal(e.analysis.lower,1);assert.ok(e.reference);
 for(const extra of [{summary:'fake'},{email:'real@example.com'},{name:'real'},{consent:false},{consentVersion:'old'},{providerId:'wrong'}])assert.equal((await call('/api/live/requests',{...payload(e.reference),...extra})).status,400);
 const r=await call('/api/live/requests',payload(e.reference));assert.equal(r.status,201);assert.equal(r.data.status,'pending');
 assert.equal((await call('/api/live/requests',payload(e.reference))).status,409);
 assert.equal((await call(`/api/requests/${r.data.id}`,undefined,'wrong')).status,401);
 assert.equal((await call(`/api/requests/${r.data.id}`,undefined,r.data.receipt)).data.status,'pending');
 const b=await evidence();const second=await call('/api/live/requests',payload(b.reference));assert.equal(second.status,201);
 assert.equal((await call(`/api/requests/${second.data.id}`,undefined,r.data.receipt)).status,401);
 assert.equal((await call(`/api/requests/${r.data.id}/withdraw`,{},r.data.receipt)).data.status,'withdrawn');
 assert.equal((await call(`/api/operator/requests/${r.data.id}`,{action:'sent',reviewed:true},'test-operator','PATCH')).status,404);
});
test('expiry, reset and unavailable provider do not create stale requests',async t=>{
 const {call,evidence,payload,setTime}=await setup(t);let e=await evidence();setTime(900000);
 assert.equal((await call('/api/live/requests',payload(e.reference))).status,410);
 e=await evidence();const r=await call('/api/live/requests',payload(e.reference));setTime(4499999);assert.equal((await call(`/api/requests/${r.data.id}`,undefined,r.data.receipt)).status,200);
 setTime(4500000);assert.equal((await call(`/api/requests/${r.data.id}`,undefined,r.data.receipt)).status,410);

});
test('live simulation capacity and operator history remain bounded',()=>{
 let clock=0;const requests=createRequests({now:()=>clock});const snapshot={subject,records:[candidate],analysis:{state:'available',explanation:'descriptive',methodVersion:'v1'},source:'source',retrievedAt:'today'};
 const create=reference=>requests.createLive({snapshot,reference,providerId:'demo-professional',consent:true,consentVersion:'live-demo-consent-2'});
 const r=create('first');for(let i=0;i<99;i++)requests.change(r.id,{action:i%2?'reconcile':'failed',reviewed:true});
 assert.throws(()=>requests.change(r.id,{action:'reconcile',reviewed:true}),e=>e.status===409);
 for(let i=1;i<200;i++)create(String(i));assert.throws(()=>create('overflow'),e=>e.status===409);
 clock=3600000;assert.equal(requests.list().length,0);assert.equal(create('fresh').status,'pending');
});
test('primary routes share one branded live journey and demo redirects',async t=>{
 const {base}=await setup(t);
 const primary=await (await fetch(base+'/')).text();const live=await (await fetch(base+'/live')).text();
 assert.match(primary,/id="live-form"/);assert.equal(primary,live);
 const retired=await fetch(base+'/demo',{redirect:'manual'});assert.equal(retired.status,302);assert.equal(retired.headers.get('location'),'/');
 assert.match(primary,/Four simple steps/);assert.equal((await fetch(base+'/app.js')).status,404);
 assert.ok(primary.indexOf('id="raw-source"')>primary.indexOf('</footer>'));
});
