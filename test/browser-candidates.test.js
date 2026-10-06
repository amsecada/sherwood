import test from 'node:test';
import assert from 'node:assert/strict';
import {createCookViewer} from '../public/cookviewer.js';
import {summarizeCandidates} from '../public/live-metrics.js';
const subject={PIN14:'01011000250000',township_name:'Test',NBHD:12,BCLASS:'203',TAXYR:2026,BLDGSQFT:1000,current_procname:'TEST',current_value_desc:'County',CURRENTVALUE_TOTAL:100};
const row=(i,value=110,size=1000)=>({...subject,PIN14:String(20000000000000+i),CURRENTVALUE_TOTAL:value,BLDGSQFT:size});
function setup(pages,control){
 const urls=[];
 const reader=createCookViewer({fetchImpl:async(url)=>{
  urls.push(new URL(url));
  const page=urls.length===1?{records:[subject]}:pages.shift();
  if(page instanceof Error)throw page;
  control?.(urls.length);
  return new Response(JSON.stringify({features:page.records.map(attributes=>({attributes})),exceededTransferLimit:page.more}));
 }});
 return {reader,urls};
}
test('finds lower records beyond the first page but retains higher records and full-pool median',async()=>{
 const {reader,urls}=setup([{records:Array.from({length:20},(_,i)=>row(i)),more:true},{records:[row(21,60,1190),row(22,90,1000)],more:false}]);
 const progress=[];const r=await reader.candidates(subject.PIN14,{onProgress:p=>progress.push(p)});
 assert.equal(r.records.length,22);
 assert.equal(r.records[0].PIN14,row(22).PIN14,'Closer size ranks ahead of cheapest value');
 assert.equal(r.records[1].PIN14,row(21).PIN14);
 assert.equal(r.search.examined,22);assert.equal(r.search.pages,2);assert.equal(r.truncated,false);
 assert.equal(urls[2].searchParams.get('resultOffset'),'20');
 assert.equal(urls[1].searchParams.get('where'),urls[2].searchParams.get('where'));
 assert.equal(summarizeCandidates(r.subject,r.records).disparity.median,110);
 assert.equal(progress.at(-1).examined,22);
});
test('search is bounded even when more records exist and all early values are lower',async()=>{
 const {reader,urls}=setup([0,20,40].map(start=>({records:Array.from({length:20},(_,i)=>row(start+i,80)),more:true})));
 const r=await reader.candidates(subject.PIN14);
 assert.equal(r.records.length,60);assert.equal(urls.length,4);assert.equal(r.truncated,true);
 assert.equal(r.search.pages,3);assert.equal(r.search.examined,60);
});
test('short complete result does not trigger a value-driven retry; unsuitable and duplicate rows excluded',async()=>{
 const {reader,urls}=setup([{records:[row(1),row(1),{...row(2),TAXYR:2025},row(3,90,1300)],more:false}]);
 const r=await reader.candidates(subject.PIN14);
 assert.equal(r.records.length,1);assert.equal(r.excludedCount,3);assert.equal(urls.length,2);
 assert.equal(r.search.examined,4);assert.equal(r.records[0].CURRENTVALUE_TOTAL,110);
});
test('later source failure does not return a complete-looking partial comparison',async()=>{
 const {reader}=setup([{records:[row(1)],more:true},new TypeError('outage')]);
 await assert.rejects(reader.candidates(subject.PIN14),e=>e.status===502);
});
test('cancellation between pages prevents another source call',async()=>{
 const controller=new AbortController();
 const {reader,urls}=setup([{records:[row(1)],more:true}],count=>{if(count===2)controller.abort();});
 await assert.rejects(reader.candidates(subject.PIN14,{signal:controller.signal}),{name:'AbortError'});
 assert.equal(urls.length,2);
});
test('invalid subject value cannot be classified as lower or higher',async()=>{
 const reader=createCookViewer({fetchImpl:async()=>new Response(JSON.stringify({features:[{attributes:{...subject,CURRENTVALUE_TOTAL:null}}]}))});
 const r=await reader.candidates(subject.PIN14);
 assert.equal(r.state,'insufficient-fields');assert.ok(r.missing.includes('CURRENTVALUE_TOTAL'));
});
test('search summary explicitly describes full examined pool and an incomplete search',()=>{
 const summary=summarizeCandidates(subject,[row(1,70),row(2,110),row(3,120)],{searched:true,truncated:true});
 assert.equal(summary.disparity.median,110);
 assert.match(summary.explanation,/all 3 examined matches/);
 assert.match(summary.explanation,/more records.*not examined/);
 assert.equal(summary.methodVersion,'live-search-median-3');
});
