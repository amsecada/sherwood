import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from '../src/server.js';
async function fixture(t) {
 const property={PIN14:'01011000250000',CURRENTVALUE_TOTAL:100,TAXYR:2026,current_procname:'test',current_value_desc:'County'};
 const server=createServer({operatorToken:'test-operator-token',cookViewer:{candidates:async()=>({subject:property,records:[{...property,CURRENTVALUE_TOTAL:90}],source:'fixture'})}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(()=>new Promise(r=>server.close(r)));
 const base=`http://127.0.0.1:${server.address().port}`;
 const call=async(path,{method='GET',body,token,origin,raw}={})=>{
 const response=await fetch(base+path,{method,headers:{...(body||raw?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`} : {}),...(origin?{Origin:origin}:{})},body:raw??(body?JSON.stringify(body):undefined)});
 return {status:response.status,data:await response.json()};
 };
 const e=await call('/api/live/candidates',{method:'POST',body:{pin:property.PIN14}});
 return {call,payload:{reference:e.data.reference,providerId:'demo-professional',consent:true,consentVersion:'live-demo-consent-2'}};
}
test('operator interface and APIs are retired',async t=>{
 const {call}=await fixture(t);
 for(const path of ['/operator','/operator.js','/api/operator/requests']) assert.equal((await call(path)).status,404);
 assert.equal((await call('/api/operator/reset',{method:'POST',body:{}})).status,404);
});
