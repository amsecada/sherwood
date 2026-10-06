import test from 'node:test';
import assert from 'node:assert/strict';
import {createSimulation} from '../public/simulation.js';
test('page-local request clones evidence, preserves original identity, withdraws and deletes',()=>{
 let now=100;const simulation=createSimulation({now:()=>now});
 const evidence={subject:{PIN14:'123',street_address:'Test'},analysis:{state:'available',explanation:'Original'},expiresAt:1000,provider:{name:'Fictional'}};
 assert.throws(()=>simulation.create(evidence,false));
 const result=simulation.create(evidence,true);evidence.subject.street_address='Changed';
 assert.equal(result.subject.street_address,'Test');assert.equal(simulation.read().status,'created');
 assert.throws(()=>simulation.create(evidence,true));
 assert.equal(simulation.withdraw().status,'withdrawn');simulation.delete();assert.equal(simulation.read(),null);
 now=1000;assert.throws(()=>simulation.create(evidence,true));
});
test('requests expire and separate page models share no state',()=>{
 let now=0;const model=createSimulation({now:()=>now});
 model.create({subject:{PIN14:'123'},provider:{name:'Test'},analysis:{state:'available'},expiresAt:900000},true);
 assert.equal(createSimulation().read(),null);now=3600000;assert.equal(model.read(),null);
});
