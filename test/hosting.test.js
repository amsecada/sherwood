import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer,startServer} from '../src/server.js';
test('hosted origin accepts only configured HTTPS host and health exposes no private state',async t=>{
 const server=createServer({publicOrigin:'https://gallery.example',operatorToken:'x'.repeat(32)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const call=(path,headers={})=>new Promise((resolve,reject)=>{http.get({host:'127.0.0.1',port:server.address().port,path,headers},r=>{let body='';r.on('data',c=>body+=c);r.on('end',()=>resolve({status:r.statusCode,body}));}).on('error',reject);});
 assert.equal((await call('/',{Host:'gallery.example',Origin:'https://gallery.example'})).status,200);
 for(const headers of [{Host:'evil.example'},{Host:'gallery.example',Origin:'http://gallery.example'},{Host:'gallery.example:123'},{Host:'evil.example','X-Forwarded-Host':'gallery.example','X-Forwarded-Proto':'https'}])assert.equal((await call('/',headers)).status,403);
 assert.deepEqual(JSON.parse((await call('/healthz',{Host:'internal-probe'})).body),{status:'ok'});
 assert.equal((await call('/api/operator/requests',{Host:'gallery.example'})).status,404);
});
test('public binding requires an HTTPS origin',async()=>{
 await assert.rejects(startServer({host:'0.0.0.0',port:0}));
 for(const publicOrigin of ['http://gallery.example','https://user:pass@gallery.example','https://gallery.example/path','https://gallery.example?secret=1'])assert.throws(()=>createServer({publicOrigin}));
});
