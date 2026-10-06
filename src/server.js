import http from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createRequests,fail} from './requests.js';
import {createCookViewer} from './cookviewer.js';
import {createEvidence} from './evidence.js';
import {summarizeCandidates} from '../public/live-metrics.js';
import {providers} from './fixtures.js';
const project=fileURLToPath(new URL('../',import.meta.url));
const assets={'/':'index.html','/styles.css':'styles.css','/live':'index.html','/live.js':'live.js','/live-handoff.js':'live-handoff.js','/map-layout.js':'map-layout.js','/property-map.js':'property-map.js','/live-metrics.js':'live-metrics.js','/live-details.js':'live-details.js'};
async function body(req){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16384)fail(413,'Request is too large.');chunks.push(chunk);}try{const value=JSON.parse(Buffer.concat(chunks).toString()||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw new Error();return value;}catch{fail(400,'Send a JSON object.');}}
export function createServer({cookViewer=createCookViewer(),now=Date.now,publicOrigin}={}){
 const configured=validatePublicOrigin(publicOrigin);
 const requests=createRequests({now});
 const evidence=createEvidence({now});
 return http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://tile.openstreetmap.org; connect-src 'self' https://gis.cookcountyil.gov; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const json=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
  try{
   if(req.method==='GET'&&req.url==='/healthz')return json(200,{status:'ok'});
   const host=req.headers.host||'';
   if(configured?host!==configured.host:!/^(127\.0\.0\.1|localhost):\d+$/.test(host))fail(403,'Use the configured application address.');
   const allowedOrigin=configured?configured.origin:`http://${host}`;
   if(req.headers.origin&&req.headers.origin!==allowedOrigin)fail(403,'Cross-origin access is disabled.');
   if(req.headers['sec-fetch-site']&& !['same-origin','none'].includes(req.headers['sec-fetch-site']))fail(403,'Open this local app directly.');
   const path=new URL(req.url,`http://${host}`).pathname,method=req.method;
   const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):undefined;
   if(method==='GET'&&path==='/demo'){res.writeHead(302,{Location:'/'});res.end();return;}
   if(method==='GET'&&assets[path]){
    const filename=assets[path],mime=filename.endsWith('.html')?'text/html':filename.endsWith('.css')?'text/css':'text/javascript';
    const content=readFileSync(resolve(project,'public',filename));res.writeHead(200,{'Content-Type':`${mime}; charset=utf-8`});res.end(content);return;
   }
   if(method==='POST'&&path==='/api/live/lookup')return json(200,await cookViewer.lookup(await body(req)));
   if(method==='POST'&&path==='/api/live/candidates'){
    const result=await cookViewer.candidates((await body(req)).pin);
    const analysis=summarizeCandidates(result.subject,result.records||[]);
    const issued=analysis.state==='available'?evidence.issue(result):{analysis};
    return json(200,{...result,...issued,provider:requests.isActive()?{id:providers[0].id,name:providers[0].name}:null});
   }
   if(method==='POST'&&path==='/api/live/requests'){
    const p=await body(req);
    if(Object.keys(p).some(k=>!['reference','providerId','consent','consentVersion'].includes(k)))fail(400,'Send only the comparison reference and simulation consent.');
    const snapshot=evidence.read(p.reference);
    const request=requests.createLive({...p,snapshot});evidence.consume(p.reference);return json(201,request);
   }
   const privatePath=path.match(/^\/api\/requests\/([a-f0-9-]+)(\/withdraw)?$/);
   if(privatePath&&method==='GET'&&!privatePath[2])return json(200,requests.status(privatePath[1],token));
   if(privatePath&&method==='POST'&&privatePath[2]){await body(req);return json(200,requests.withdraw(privatePath[1],token));}
   if(privatePath&&method==='DELETE'&&!privatePath[2])return json(200,requests.delete(privatePath[1],token));
   fail(404,'Not found.');
  }catch(e){json(e.status||500,{error:e.status?e.message:'Local server error.'});}
 });
}
function validatePublicOrigin(value) {
 if(value===undefined||value==='')return null;
 let url;try{url=new URL(value);}catch{throw new Error('PUBLIC_ORIGIN must be an HTTPS origin.');}
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('PUBLIC_ORIGIN must be an HTTPS origin without credentials or a path.');
 return url;
}
export async function startServer({port=3000,host='127.0.0.1',publicOrigin}={}) {
 const configured=validatePublicOrigin(publicOrigin);
 const local=['127.0.0.1','localhost'].includes(host);
 if(!local&&!configured)throw new Error('Public binding requires PUBLIC_ORIGIN.');
 const server=createServer({publicOrigin});
 await new Promise((accept,reject)=>{
  server.once('error',reject);
  server.listen(port,host,()=>{server.removeListener('error',reject);accept();});
 });
 return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const port=Number(process.env.PORT||3000);
 if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be an integer from 1 to 65535.');
 try {
  await startServer({port,host:process.env.HOST||'127.0.0.1',publicOrigin:process.env.PUBLIC_ORIGIN});
  console.log('Sherwood live gallery ready. No messages or filings.');
 }catch(error){console.error(error.code?`Cannot start server: ${error.code}. Check the configured port and permissions.`:error.message);process.exitCode=1;}
}
