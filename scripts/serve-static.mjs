import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
export function staticServer({root=resolve('public'),prefix='/'}={}) {
 return http.createServer(async(req,res)=>{
  const path = new URL(req.url,'http://localhost').pathname;
  if (!['GET','HEAD'].includes(req.method) || !path.startsWith(prefix)) {res.writeHead(404);res.end();return;}
  const name=path.slice(prefix.length)||'index.html';
  if (!/^[\w.-]+$/.test(name)) {res.writeHead(404);res.end();return;}
  try {
   const data=await readFile(resolve(root,name));
   const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[extname(name)]||'text/plain';
   res.writeHead(200,{'Content-Type':`${type}; charset=utf-8`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
  } catch {res.writeHead(404);res.end();}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const server=staticServer();server.listen(Number(process.env.PORT||3100),'127.0.0.1',()=>console.log('Static Sherwood preview ready.'));
}
