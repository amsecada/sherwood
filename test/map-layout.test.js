import test from 'node:test';
import assert from 'node:assert/strict';
import {fitMap} from '../public/map-layout.js';
const point={pin:'a',latitude:42,longitude:-88,isSubject:true,label:'Subject'};
test('map preserves identity, north-up orientation and fit on narrow screens',()=>{
 const r=fitMap([point,{...point,pin:'b',latitude:42.001,longitude:-87.999}],280,300);
 assert.equal(r.markers.length,2);assert.equal(r.markers[0].pin,'a');assert.ok(r.markers[1].x>r.markers[0].x);assert.ok(r.markers[1].y<r.markers[0].y);
 for(const p of r.markers){assert.ok(p.x>=40&&p.x<=240);assert.ok(p.y>=40&&p.y<=260);}
 for(const t of r.tiles){assert.ok(t.left<280&&t.left+256>0);assert.ok(t.top<300&&t.top+256>0);assert.ok(t.x>=0&&t.x<2**t.z);}
});
test('map has honest empty and invalid states, centers a point, preserves overlaps',()=>{
 assert.equal(fitMap([],600,360).markers.length,0);
 assert.equal(fitMap([{...point,latitude:null},{...point,longitude:0}],600,360).markers.length,0);
 const r=fitMap([point,{...point,pin:'overlap'}],600,360);assert.equal(r.markers.length,2);
 assert.equal(r.markers[0].x,300);assert.equal(r.markers[0].y,180);assert.equal(r.markers[1].x,300);
 assert.ok(r.zoom>=8&&r.zoom<=18);
});
