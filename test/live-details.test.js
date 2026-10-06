import test from 'node:test';
import assert from 'node:assert/strict';
import {wireDetails} from '../public/live-details.js';
test('hover and focus never open details; dismissal closes an explicit disclosure',()=>{
 const details=new EventTarget();details.open=false;wireDetails(details);
 for(const type of ['mouseenter','focusin','mouseleave','focusout']) {details.dispatchEvent(new Event(type));assert.equal(details.open,false);}
 details.open=true;details.dispatchEvent(new Event('mouseleave'));assert.equal(details.open,true);
 details.dispatchEvent(new Event('dismiss'));assert.equal(details.open,false);
});
