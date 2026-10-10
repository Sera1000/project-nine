import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || '';
const json = (res, status, value, origin='') => {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...(origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})});
  res.end(JSON.stringify(value));
};
const server = createServer(async (req,res) => {
  const origin = req.headers.origin || '';
  const corsOrigin = allowedOrigin && origin === allowedOrigin ? origin : '';
  if (origin && !corsOrigin) return json(res,403,{error:'Origin not allowed'});
  if (req.method === 'OPTIONS') {res.writeHead(204, {'Access-Control-Allow-Origin':corsOrigin,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'});return res.end();}
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (path === '/health' && req.method === 'GET') return json(res,200,{ok:true,service:'project-nine',version:'0.1.0'},corsOrigin);
  if (path === '/api/chat' && req.method === 'POST') {
    let raw='';for await (const chunk of req) {raw+=chunk;if(raw.length>20000)return json(res,413,{error:'Message too large'},corsOrigin);}
    let data;try{data=JSON.parse(raw)}catch{return json(res,400,{error:'Invalid JSON'},corsOrigin)}
    if(typeof data?.message !== 'string'||!data.message.trim()||data.message.length>8000)return json(res,400,{error:'Invalid message'},corsOrigin);
    return json(res,501,{error:'AI provider not connected yet',requestId:randomUUID()},corsOrigin);
  }
  json(res,404,{error:'Not found'},corsOrigin);
});
server.listen(port,'0.0.0.0',()=>console.log('Project NINE backend listening on '+port));
