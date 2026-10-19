import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { handleAnalyze, status } from './handler';
const production=process.argv.includes('--production');
const vite=production?null:await(await import('vite')).createServer({server:{middlewareMode:true},appType:'spa'});
const root=resolve('dist');
const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml'};
createServer(async(req,res)=>{try{
 const base=`http://${req.headers.host||'localhost:5173'}`,path=new URL(req.url||'/',base).pathname;
 if(path==='/api/analyze'||path==='/api/status'){
  const chunks:Buffer[]=[];let length=0;for await(const chunk of req){length+=chunk.length;if(length>24000){res.writeHead(413,{'Cache-Control':'no-store','Content-Type':'application/json'});res.end('{"error":"validation"}');return;}chunks.push(chunk);}
  const h=new Headers();for(const[k,v]of Object.entries(req.headers))if(v)h.set(k,Array.isArray(v)?v.join(','):v);
  const request=new Request(new URL(path,base),{method:req.method,headers:h,...(!['GET','HEAD'].includes(req.method||'GET')?{body:Buffer.concat(chunks)}:{})});
  const r=path==='/api/status'?status():await handleAnalyze(request);res.writeHead(r.status,Object.fromEntries(r.headers));res.end(await r.text());return;
 }
 if(vite){vite.middlewares(req,res);return;}
 const file=resolve(root,'.'+decodeURIComponent(path==='/'?'/index.html':path));if(!file.startsWith(root+'/')&&!file.startsWith(root+'\\')){res.writeHead(403);res.end();return;}
 res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));
}catch{if(!res.headersSent)res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT)||5173,'127.0.0.1',()=>console.log('Protektahanan: http://localhost:'+(process.env.PORT||5173)));
