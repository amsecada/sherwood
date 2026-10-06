import test from 'node:test';
import assert from 'node:assert/strict';
import {wireDetails} from '../public/live-details.js';
// Minimal event-target surface because no browser/DOM runtime is available.
// These checks cover the real disclosure controller, not rendered layout.
function fixture(){const summary=new EventTarget(),details=new EventTarget();details.open=false;details.contains=target=>target===summary;wireDetails(details,summary);return {summary,details};}
test('hover reveals details and leaving closes unpinned content',()=>{
 const {details}=fixture();details.dispatchEvent(new Event('mouseenter'));assert.equal(details.open,true);details.dispatchEvent(new Event('mouseleave'));assert.equal(details.open,false);
});
test('focus keeps details visible after pointer exit and outside blur closes them',()=>{
 const {details}=fixture();details.dispatchEvent(new Event('focusin'));details.dispatchEvent(new Event('mouseleave'));assert.equal(details.open,true);const blur=new Event('focusout');Object.defineProperty(blur,'relatedTarget',{value:null});details.dispatchEvent(blur);assert.equal(details.open,false);
});
test('click or keyboard activation pins details; dismissal closes without removing focus',()=>{
 const {details,summary}=fixture();details.dispatchEvent(new Event('focusin'));summary.dispatchEvent(new Event('click',{cancelable:true}));details.dispatchEvent(new Event('mouseleave'));assert.equal(details.open,true);summary.dispatchEvent(new Event('click',{cancelable:true}));assert.equal(details.open,false);details.dispatchEvent(new Event('mouseenter'));assert.equal(details.open,true);details.dispatchEvent(new Event('dismiss'));assert.equal(details.open,false);
});
