import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeCandidates} from '../public/live-metrics.js';
const subject={TAXYR:2026,current_procname:'test',current_value_desc:'County',CURRENTVALUE_TOTAL:100};
test('analysis counts only compatible shown values without treating missing evidence as equal',()=>{
 const r=summarizeCandidates(subject,[90,100,110,null].map(CURRENTVALUE_TOTAL=>({...subject,CURRENTVALUE_TOTAL})).concat({...subject,TAXYR:2025}));
 assert.deepEqual([r.shown,r.usable,r.omitted,r.lower,r.equal,r.higher],[5,3,2,1,1,1]);
 assert.equal(r.state,'available');assert.match(r.explanation,/3 shown candidates/);assert.doesNotMatch(r.explanation,/expert-approved/);
 assert.equal(summarizeCandidates(subject,[]).state,'unavailable');
 assert.equal(summarizeCandidates(subject,[{...subject,CURRENTVALUE_TOTAL:null}]).state,'unavailable');
 assert.equal(summarizeCandidates({...subject,CURRENTVALUE_TOTAL:0},[subject]).higher,1);
});
test('approved median bands use all compatible values and exact boundaries',()=>{
 for(const [value,band] of [[90,'at-or-below'],[100,'at-or-below'],[104.999,'small'],[105,'noticeable'],[114.999,'noticeable'],[115,'substantial']]) {
  const r=summarizeCandidates({...subject,CURRENTVALUE_TOTAL:value},[80,100,120].map(CURRENTVALUE_TOTAL=>({...subject,CURRENTVALUE_TOTAL})));
  assert.equal(r.disparity.band,band);assert.equal(r.disparity.median,100);
  assert.doesNotMatch(r.explanation,/expert-approved/);
 }
 const even=summarizeCandidates(subject,[60,80,120,140].map(CURRENTVALUE_TOTAL=>({...subject,CURRENTVALUE_TOTAL})));
 assert.equal(even.disparity.median,100);
});
test('insufficient or unusable baselines never get enthusiastic messages',()=>{
 for(const values of [[],[80,90],[0,0,0],[null,NaN,Infinity]]) {
  const r=summarizeCandidates(subject,values.map(CURRENTVALUE_TOTAL=>({...subject,CURRENTVALUE_TOTAL})));
  assert.equal(r.disparity.band,null);
 }
 const incompatible=summarizeCandidates(subject,[80,90,100].map(CURRENTVALUE_TOTAL=>({...subject,TAXYR:2025,CURRENTVALUE_TOTAL})));
 assert.equal(incompatible.disparity.band,null);
});
