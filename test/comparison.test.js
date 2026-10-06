import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveAddress, compareParcel} from '../src/comparison.js';
for (const [address,state] of [['','invalid'],['123 real street','unresolved'],['Demo Dallas','unsupported'],['Demo Two Flats','ambiguous'],['100 Demo Oak Lane','resolved']]) {
  test(`address ${address || '(empty)'} returns ${state}`,()=>assert.equal(resolveAddress(address).state,state));
}
test('comparison uses reproducible synthetic evidence and hand-checked differences',()=>{
 const r=compareParcel('demo-oak');
 assert.equal(r.state,'available'); assert.equal(r.subject.assessment,36000); assert.equal(r.median,30000); assert.equal(r.difference,6000);
 assert.equal(r.comparables.length,3); assert.deepEqual(r,compareParcel('demo-oak')); assert.match(r.explanation,/not proof/i);
});
test('no apparent difference remains distinct from inadequate evidence',()=>{
 assert.equal(compareParcel('demo-even').interpretation,'no-apparent-difference');
 assert.equal(compareParcel('demo-sparse').state,'insufficient');
 assert.equal(compareParcel('demo-period').state,'insufficient');
 assert.equal(compareParcel('demo-outage').state,'source-failure');
 assert.equal(compareParcel('demo-no-provider').providers.length,0);
 assert.equal(compareParcel('not-real').state,'unresolved');
});
