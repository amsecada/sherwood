import test from 'node:test';
import assert from 'node:assert/strict';
import {createCookViewer} from '../src/cookviewer.js';
const parcel={PIN14:'01011000250000',street_address:'100 TEST ST',township_name:'Test Township',TAXYR:2026,BCLASS:'203',NBHD:12,BLDGSQFT:1248,BLDGAGE:96,CURRENTVALUE_TOTAL:37000,current_value_desc:'2026 Assessor Valuation',current_procname:'CCAOVALUE',last_edited_date:1786546704000};
function scripted(responses) {
 const urls=[];
 const client=createCookViewer({fetchImpl:async(url,options)=>{
  urls.push(new URL(url));assert.ok(options.signal);assert.equal(options.redirect,'error');
  const next=responses.shift();if(next instanceof Error)throw next;
  return new Response(typeof next==='string'?next:JSON.stringify(next),{status:200,headers:{'Content-Type':'application/json'}});
 }});
 return {client,urls};
}
const data=(...rows)=>({features:rows.map(attributes=>({attributes}))});
test('address query escapes quotes, uses field allowlist and returns provenance without owner data',async()=>{
 const {client,urls}=scripted([data({...parcel,OWNER:'not permitted',class_description:null})]);
 const r=await client.lookup({type:'address',value:"100 O'BRIEN ST"});
 assert.equal(urls[0].origin,'https://gis.cookcountyil.gov');
 assert.equal(urls[0].searchParams.get('where'),"UPPER(street_address) = '100 O''BRIEN ST'");
 assert.equal(urls[0].searchParams.get('resultRecordCount'),'10');assert.equal(urls[0].searchParams.get('returnGeometry'),'false');
 assert.equal(r.state,'matches');assert.equal(r.records[0].PIN14,'01011000250000');assert.equal(r.records[0].OWNER,undefined);assert.equal(r.records[0].class_description,null);assert.ok(r.retrievedAt);assert.match(r.source,/CookViewer3Parcels/);
});
test('formatted PIN lookup normalizes digits while invalid inputs make no requests',async()=>{
 const {client,urls}=scripted([data(parcel)]);
 await client.lookup({type:'pin',value:'01-01-100-025-0000'});assert.equal(urls[0].searchParams.get('where'),"PIN14 = '01011000250000'");
 for(const q of [{type:'pin',value:'1 OR 1=1'},{type:'pin',value:'123'},{type:'address',value:'%'},{type:'address',value:''},{type:'address',value:'a'.repeat(101)},{type:'url',value:'https://evil.test'},{type:'address',value:null}])await assert.rejects(client.lookup(q),e=>e.status===400);
 assert.equal(urls.length,1);
});
test('empty and truncated lookup states remain explicit',async()=>{
 const {client}=scripted([data(),{...data(parcel),exceededTransferLimit:true}]);
 assert.equal((await client.lookup({type:'address',value:'100 TEST ST'})).state,'not-found');
 assert.equal((await client.lookup({type:'pin',value:parcel.PIN14})).truncated,true);
});
test('candidate query re-fetches source subject and requires compatible class, neighborhood, year and stage',async()=>{
 const {client,urls}=scripted([data(parcel),data({...parcel,PIN14:'01011000430000',BLDGSQFT:1366})]);
 const r=await client.candidates(parcel.PIN14);
 const where=urls[1].searchParams.get('where');
 for(const clause of ["PIN14 <> '01011000250000'","township_name = 'Test Township'",'NBHD = 12',"BCLASS = '203'",'TAXYR = 2026',"current_procname = 'CCAOVALUE'","current_value_desc = '2026 Assessor Valuation'",'BLDGSQFT BETWEEN 999 AND 1497'])assert.ok(where.includes(clause),clause);
 assert.equal(urls[1].searchParams.get('resultRecordCount'),'20');assert.equal(r.records.length,1);assert.equal(r.subject.PIN14,parcel.PIN14);assert.match(r.limitation,/not.*comparables/i);
});
test('missing fields never become zero or a broader candidate query',async()=>{
 for(const key of ['NBHD','TAXYR','BCLASS','BLDGSQFT','township_name','current_procname','current_value_desc']){
  const {client,urls}=scripted([data({...parcel,[key]:null})]);const r=await client.candidates(parcel.PIN14);assert.equal(r.state,'insufficient-fields');assert.equal(urls.length,1);assert.ok(r.missing.includes(key));
 }
});
test('returned candidates are validated even if upstream filter is ignored',async()=>{
 const {client}=scripted([data(parcel),data({...parcel,PIN14:'01011000430000',TAXYR:2025},{...parcel,PIN14:'01011000450000',BLDGSQFT:null},parcel)]);
 const r=await client.candidates(parcel.PIN14);assert.equal(r.records.length,0);assert.equal(r.excludedCount,3);assert.equal(r.state,'no-candidates');
});
test('ArcGIS errors, malformed responses and network failures never become empty evidence',async()=>{
 for(const response of [{error:{code:499,message:'Token required'}},'not-json',{},new TypeError('fetch failed'),new DOMException('timeout','TimeoutError')]){
  const {client}=scripted([response]);await assert.rejects(client.lookup({type:'address',value:'100 TEST ST'}),e=>[502,504].includes(e.status));
 }
});
test('raw source strings are not silently shortened',async()=>{
 const {client}=scripted([data({...parcel,street_address:'A'.repeat(201)})]);
 const r=await client.lookup({type:'pin',value:parcel.PIN14});
 assert.equal(r.records[0].street_address.length,201);assert.equal(r.truncated,false);
});
test('non-success HTTP status is an error even if response contains an empty feature list',async()=>{
 const client=createCookViewer({fetchImpl:async()=>new Response(JSON.stringify(data()),{status:503})});
 await assert.rejects(client.lookup({type:'pin',value:parcel.PIN14}),e=>e.status===502);
});
test('local query concurrency is bounded and releases capacity after completion',async()=>{
 const releases=[];
 const client=createCookViewer({fetchImpl:async()=>new Promise(resolve=>releases.push(()=>resolve(new Response(JSON.stringify(data(parcel))))))});
 const first=client.lookup({type:'pin',value:parcel.PIN14}),second=client.lookup({type:'pin',value:parcel.PIN14});
 await assert.rejects(client.lookup({type:'pin',value:parcel.PIN14}),e=>e.status===429);
 for(const release of releases)release();await Promise.all([first,second]);
 const next=client.lookup({type:'pin',value:parcel.PIN14});releases.at(-1)();assert.equal((await next).state,'matches');
});
test('coordinate pair is allowlisted and unusable locations do not discard property evidence',async()=>{
 for(const [latitude,longitude,expected] of [[42.153581,-88.138673,42.153581],[null,-88,null],[0,0,null],[42,'-88',null],[43,-88,null]]){
  const {client,urls}=scripted([data({...parcel,latitude,longitude})]);const r=await client.lookup({type:'pin',value:parcel.PIN14});
  assert.equal(r.records[0].latitude,expected);assert.equal(r.records[0].longitude,expected===null?null:longitude);
  assert.equal(r.records[0].CURRENTVALUE_TOTAL,37000);assert.ok(urls[0].searchParams.get('outFields').includes('latitude'));
 }
});
test('source request starts are globally bounded per rolling minute and invalid inputs consume none',async()=>{
 let clock=0,count=0;const client=createCookViewer({now:()=>clock,fetchImpl:async()=>{count++;return new Response(JSON.stringify(data(parcel)));}});
 await assert.rejects(client.lookup({type:'pin',value:'bad'}));
 for(let i=0;i<60;i++)await client.lookup({type:'pin',value:parcel.PIN14});
 await assert.rejects(client.lookup({type:'pin',value:parcel.PIN14}),e=>e.status===429);assert.equal(count,60);
 clock=60000;await client.lookup({type:'pin',value:parcel.PIN14});assert.equal(count,61);
});

test('aborted browser lookup stops before a source call',async()=>{
 let calls=0;const reader=createCookViewer({fetchImpl:async()=>{calls++;return new Response(JSON.stringify({features:[]}));}});
 const controller=new AbortController();controller.abort();
 await assert.rejects(reader.lookup({type:'pin',value:'01011000250000'},{signal:controller.signal}),{name:'AbortError'});
 assert.equal(calls,0);
});
