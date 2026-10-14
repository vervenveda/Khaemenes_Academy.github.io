#!/usr/bin/env node
/* Browser smoke test for the exact public index.html and shared locale module.
   Test-only: no dependencies in the published website. Does not validate content quality. */
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import {spawnSync,spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const browsers=["google-chrome","chromium","chromium-browser"];
const browser=browsers.find(x=>spawnSync("which",[x],{encoding:"utf8"}).status===0);
if(!browser){console.error("BROWSER_I18N=FAIL: Chromium or Chrome unavailable");process.exit(1)}
const testCode=String.raw`
<script data-test-only>
(function(){
  function run(){
    const result={};
    try{
      const api=window.VNVLanguage;
      result.engine=!!api;
      result.options=document.getElementById("vnv-language-select")?.options.length===13;
      if(!api)throw Error("missing VNVLanguage");
      api.setLanguage("es");
      result.selected=api.getLanguage()==="es";
      result.title=!(["Verve N Veda | Public Gateway","Khaemenes Academy | Front Desk","Polyglot | Khaemenes Academy Linguistics & World Language Campus"].includes(document.title));
      result.coverage=api.coverage().language==="es";
      const button=document.createElement("button");
      button.id="i18n-browser-test-button";button.textContent="Welcome Home";
      button.setAttribute("aria-label","Open navigation");document.body.append(button);
      setTimeout(function(){
        result.dynamic=button.textContent==="Bienvenidos a casa";
        result.attribute=button.getAttribute("aria-label")==="Abrir navegación";
        button.setAttribute("aria-label","Switch color theme");
        setTimeout(function(){
          result.attributeChanged=button.getAttribute("aria-label")==="Cambiar tema visual";
          api.setLanguage("fr");
          result.french=button.textContent==="Bienvenue chez vous";
          api.setLanguage("en");
          result.restore=button.textContent==="Welcome Home";
          result.audit=typeof api.exportAudit==="function";
          document.body.dataset.i18nSmoke=Object.values(result).every(Boolean)?"PASS":"FAIL";
          document.body.dataset.i18nDetails=JSON.stringify(result);
        },90);
      },90);
    }catch(e){
      document.body.dataset.i18nSmoke="FAIL";
      document.body.dataset.i18nDetails=String(e.message);
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(run,350),{once:true});
  else setTimeout(run,350);
})();
</script>
`;
const mime={".html":"text/html",".js":"text/javascript",".json":"application/json",".css":"text/css",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  const p=path.resolve(root,"."+pathname);
  if(!p.startsWith(root+path.sep)&&p!==root){res.writeHead(403);res.end();return}
  let file=p;if(!path.extname(file))file=path.join(file,"index.html");
  fs.readFile(file,(err,body)=>{
    if(err){res.writeHead(404);res.end("not found");return}
    const isHome=pathname==="/"||pathname==="/index.html";
    let content=body;
    if(isHome){
      const page=body.toString("utf8"),at=page.lastIndexOf("</body>");
      if(at<0)throw Error("HTML missing closing body");
      content=Buffer.from(page.slice(0,at)+testCode+"\n"+page.slice(at));
    }
    res.writeHead(200,{"Content-Type":(mime[path.extname(file)]||"application/octet-stream")+"; charset=utf-8","Cache-Control":"no-store"});
    res.end(content);
  });
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port;
const result=await new Promise(resolve=>{
 let stdout="",stderr="",ended=false;
 const child=spawn(browser,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run","--no-default-browser-check","--virtual-time-budget=6500","--dump-dom","http://127.0.0.1:"+port+"/index.html"]);
 const stop=setTimeout(()=>{if(!ended)child.kill("SIGKILL")},25000);
 child.stdout.on("data",chunk=>{stdout+=chunk.toString()});
 child.stderr.on("data",chunk=>{if(stderr.length<20000)stderr+=chunk.toString()});
 child.on("error",error=>{ended=true;clearTimeout(stop);resolve({status:1,error,stdout,stderr})});
 child.on("close",status=>{if(ended)return;ended=true;clearTimeout(stop);resolve({status,stdout,stderr})});
});
server.close();
const page=result.stdout||"";
const marker=page.match(/data-i18n-smoke="([^"]+)"/);
const details=page.match(/data-i18n-details="([^"]+)"/);
if(result.error||result.status!==0||marker?.[1]!=="PASS"){
 console.error("BROWSER_I18N=FAIL",{status:result.status,result:marker?.[1],details:details?.[1],error:result.error?.message,stderr:(result.stderr||"").slice(-1200)});
 process.exitCode=1;
}else console.log("BROWSER_I18N=PASS; 13 locale options, Spanish, French, dynamic label changes and English restore");
