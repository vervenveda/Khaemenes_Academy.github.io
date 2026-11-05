#!/usr/bin/env node
/* Read-only headless Chrome check for the Academy ticker stack. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {spawn,spawnSync} from "node:child_process";
const root=process.cwd();
const chrome=["google-chrome","chromium","chromium-browser"].find(x=>spawnSync("which",[x],{encoding:"utf8"}).status===0);
if(!chrome)throw Error("Chrome/Chromium not installed");
const files=["index.html","student/index.html","family/index.html",
"Health_learning/Health_is_wealth_6weeks_index.html","Health_learning/workout_builder_index.html",
"Parent_resources/Art_studio_index.html","Parent_resources/Family_photo_album_index.html",
"diagnostics/front-door/index.html","tools/Keyboard_index.html","tools/song_embedder_index.html"];
function browserProbe(){
 function check(){
  try{
   const b=document.getElementById("vnv333NetworkTicker"),a=document.getElementById("vnvTickerAutoPopulate");
   const kids=[...document.body.children];
   const h=document.getElementById("vnvHeaderAutoPopulate")||document.querySelector("[data-khae-header],header");
   const bPause=b?.querySelector(".vnv333-control"),aPause=a?.querySelector(".vnv-ticker-control");
   const ok={
    single333:document.querySelectorAll("#vnv333NetworkTicker").length===1,
    singleAuto:document.querySelectorAll("#vnvTickerAutoPopulate").length===1,
    sequence:!!b&&!!a&&kids.indexOf(b)===0&&kids.indexOf(a)===1,
    headerBelow:!h||!kids.includes(h)||kids.indexOf(h)>kids.indexOf(a),
    sticky:!!b&&!!a&&getComputedStyle(b).position==="sticky"&&getComputedStyle(a).position==="sticky",
    visible:!!b&&!!a&&b.getBoundingClientRect().height>0&&a.getBoundingClientRect().height>0,
    clickable:!!bPause&&!!aPause,
    links:!!a&&a.querySelectorAll("a[href]").length>=2,
    viewport:innerWidth>550||document.documentElement.scrollWidth<=document.documentElement.clientWidth+3
   };
   if(bPause&&aPause){
    const bv=b.dataset.paused,av=a.dataset.paused;
    bPause.click();aPause.click();
    ok.pause=b.dataset.paused!==bv&&a.dataset.paused!==av;
    bPause.click();aPause.click();
   }else ok.pause=false;
   document.documentElement.dataset.tickerSmoke=Object.values(ok).every(Boolean)?"PASS":"FAIL";
   document.documentElement.dataset.tickerSmokeDetails=Object.keys(ok).filter(k=>!ok[k]).join(",")||"ok";
  }catch(e){
   document.documentElement.dataset.tickerSmoke="FAIL";
   document.documentElement.dataset.tickerSmokeDetails=String(e.message);
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(check,1500),{once:true});
 else setTimeout(check,1500);
}
const probe="<script data-test-only>("+browserProbe.toString()+")();</script>";
const mime={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json"};
const server=http.createServer((req,res)=>{
 const rel=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname).replace(/^\/+/,"");
 const file=path.resolve(root,rel||"index.html");
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404);res.end();return}
  const ext=path.extname(file);
  let output=data;
  if(ext===".html"){
   const html=data.toString("utf8"),at=html.lastIndexOf("</body>");
   if(at>=0)output=Buffer.from(html.slice(0,at)+probe+html.slice(at));
  }
  res.writeHead(200,{"Content-Type":(mime[ext]||"application/octet-stream")+"; charset=utf-8","Cache-Control":"no-store"});
  res.end(output);
 });
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
let failures=0;
for(const file of files){
 for(const width of [1280,390]){
  const result=await new Promise(done=>{
   const process=spawn(chrome,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run","--window-size="+width+",850","--virtual-time-budget=6000","--dump-dom","http://127.0.0.1:"+server.address().port+"/"+file]);
   let html="",stderr="";const timeout=setTimeout(()=>process.kill("SIGKILL"),22000);
   process.stdout.on("data",x=>html+=x.toString());
   process.stderr.on("data",x=>{if(stderr.length<1000)stderr+=x.toString()});
   process.on("error",e=>{clearTimeout(timeout);done({code:1,html,stderr:String(e)})});
   process.on("close",code=>{clearTimeout(timeout);done({code,html,stderr})});
  });
  const status=result.html.match(/data-ticker-smoke="([^"]+)"/)?.[1]||"NOT_RUN";
  const details=result.html.match(/data-ticker-smoke-details="([^"]+)"/)?.[1]||result.stderr.slice(-140);
  console.log(status+" "+file+" "+width+"px "+details);
  if(status!=="PASS"||result.code!==0)failures++;
 }
}
server.close();
if(failures){console.error("BROWSER_TICKER=FAIL; "+failures+" failures");process.exitCode=1;}
else console.log("BROWSER_TICKER=PASS");
