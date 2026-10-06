import test from 'node:test';
import assert from 'node:assert/strict';
import {candidateMetrics,formatDelta} from '../public/live-metrics.js';
const subject={CURRENTVALUE_TOTAL:40000,BLDGSQFT:1000,BLDGAGE:50,LANDSF:5000,TAXYR:2026,current_procname:'CCAOVALUE',current_value_desc:'2026 Assessor Valuation'};
test('value differences are candidate minus subject with subject-based percentage',()=>{
 const higher=candidateMetrics(subject,{...subject,CURRENTVALUE_TOTAL:44000,BLDGSQFT:1100,BLDGAGE:60});
 assert.deepEqual(higher.valueDelta,{amount:4000,percentage:10,direction:'higher'});assert.equal(higher.sizeDelta.amount,100);assert.equal(higher.ageDelta.amount,10);
 assert.equal(higher.subjectValuePerSqFt,40);assert.equal(higher.candidateValuePerSqFt,40);
 const lower=candidateMetrics(subject,{...subject,CURRENTVALUE_TOTAL:36000});assert.deepEqual(lower.valueDelta,{amount:-4000,percentage:-10,direction:'lower'});
 assert.equal(candidateMetrics(subject,subject).valueDelta.direction,'equal');
});
test('missing or nonfinite values never become zero; zero denominator suppresses percent',()=>{
 const r=candidateMetrics({...subject,CURRENTVALUE_TOTAL:null,BLDGSQFT:0},{...subject,BLDGAGE:null});
 assert.equal(r.valueDelta,null);assert.equal(r.subjectValuePerSqFt,null);assert.equal(r.ageDelta,null);
 assert.equal(candidateMetrics({...subject,CURRENTVALUE_TOTAL:0},subject).valueDelta.percentage,null);
 assert.equal(candidateMetrics(subject,{...subject,CURRENTVALUE_TOTAL:Infinity}).valueDelta,null);
 assert.equal(candidateMetrics(subject,{...subject,CURRENTVALUE_TOTAL:'44000'}).valueDelta,null);
 assert.equal(candidateMetrics({...subject,CURRENTVALUE_TOTAL:-1},subject).valueDelta,null);
});
test('value arithmetic is suppressed for incompatible or missing source concept/period',()=>{
 for(const patch of [{TAXYR:2025},{current_procname:'OTHER'},{current_value_desc:'Different concept'},{current_value_desc:null},{TAXYR:null}]){
  const r=candidateMetrics(subject,{...subject,...patch});assert.equal(r.valueDelta,null);assert.equal(r.candidateValuePerSqFt,null);assert.equal(r.valueComparable,false);
 }
});
test('delta presentation preserves signs and does not round small differences to equal',()=>{
 assert.deepEqual(formatDelta({amount:4000,percentage:10,direction:'higher'}),{amount:'+4,000 higher',percentage:'+10.0% vs subject',tone:'higher'});
 assert.equal(formatDelta({amount:-1,percentage:-0.0025,direction:'lower'}).percentage,'−<0.1% vs subject');
 assert.equal(formatDelta({amount:0,percentage:0,direction:'equal'}).amount,'0 equal');
 assert.equal(formatDelta(null).amount,'Unavailable');
 assert.equal(formatDelta({amount:5,percentage:null,direction:'higher'}).percentage,'Percentage unavailable');
});
