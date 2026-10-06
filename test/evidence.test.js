import test from 'node:test';
import assert from 'node:assert/strict';
import {createEvidence} from '../src/evidence.js';
const subject={PIN14:'01011000250000',TAXYR:2026,current_procname:'test',current_value_desc:'County',CURRENTVALUE_TOTAL:100};
const result=()=>({subject,records:[{...subject,PIN14:'01011000430000',CURRENTVALUE_TOTAL:90}],source:'source',retrievedAt:'2026-10-06'});
test('private snapshots expire at boundary, resist mutation and prevent replay',()=>{
 let clock=0;const store=createEvidence({now:()=>clock});const input=result(),issued=store.issue(input);
 input.records[0].CURRENTVALUE_TOTAL=999;const first=store.read(issued.reference);first.subject.CURRENTVALUE_TOTAL=999;
 assert.equal(store.read(issued.reference).subject.CURRENTVALUE_TOTAL,100);assert.equal(store.read(issued.reference).records[0].CURRENTVALUE_TOTAL,90);
 clock=899999;assert.equal(store.read(issued.reference).analysis.lower,1);
 store.consume(issued.reference);assert.throws(()=>store.read(issued.reference),e=>e.status===409);
 clock=900000;assert.throws(()=>store.read(issued.reference),e=>e.status===410);
 assert.throws(()=>store.issue({...result(),records:[]}),e=>e.status===400);
});
test('snapshot capacity is bounded, expired slots reusable and reset invalidates references',()=>{
 let clock=0;const store=createEvidence({now:()=>clock});for(let i=0;i<200;i++)store.issue(result());
 assert.throws(()=>store.issue(result()),e=>e.status===429);clock=900000;const r=store.issue(result());store.clear();
 assert.throws(()=>store.read(r.reference),e=>e.status===410);
});
