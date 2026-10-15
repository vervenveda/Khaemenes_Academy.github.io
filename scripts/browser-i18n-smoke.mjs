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
  const EXPECTED=["en","es","fr","ar","zh","de","ru","pt","hi","ja","ko","it","bn"];
  const PREF_KEY="vnv_language_v1";

  function finish(result){
    document.body.dataset.i18nSmoke=Object.values(result).every(Boolean)?"PASS":"FAIL";
    document.body.dataset.i18nDetails=JSON.stringify(result);
  }

  function protectedClick(link){
    if(!link)return false;
    link.addEventListener("click",event=>event.preventDefault(),{once:true});
    link.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,button:0}));
    return true;
  }

  function run(){
    const result={};
    try{
      const api=window.VNVLanguage;
      result.engine=!!api;
      if(!api)throw Error("missing VNVLanguage");

      const available=api.availableLanguages();
      result.languages=JSON.stringify(available)===JSON.stringify(EXPECTED);
      result.options=document.getElementById("vnv-language-select")?.options.length===EXPECTED.length;
      result.audit=typeof api.exportAudit==="function";

      api.setLanguage("de");
      result.persistWrite=localStorage.getItem(PREF_KEY)==="de" &&
        api.getLanguage()==="de" &&
        document.documentElement.lang==="de";

      result.allLanguages=EXPECTED.every(code=>{
        api.setLanguage(code);
        return api.getLanguage()===code &&
          document.documentElement.lang===code &&
          api.coverage().language===code &&
          document.documentElement.dir===(code==="ar"?"rtl":"ltr");
      });

      api.setLanguage("ar");
      result.arabicRtl=document.documentElement.lang==="ar" &&
        document.documentElement.dir==="rtl";

      const grid=document.querySelector(".ecosystem-category-grid,.quick-grid,.school-grid");
      const child=grid?.firstElementChild;
      result.rtlGrid=!grid ||
        (getComputedStyle(grid).direction==="ltr" &&
         (!child||getComputedStyle(child).direction==="rtl"));

      const switcher=document.getElementById("vnv-language-switch");
      const rect=switcher?.getBoundingClientRect();
      result.mobileViewport=window.innerWidth<=520;
      result.mobileSwitcher=!!rect && rect.left>=-1 && rect.right<=window.innerWidth+1;
      result.noHorizontalOverflow=document.documentElement.scrollWidth<=document.documentElement.clientWidth+2;

      api.setLanguage("es");
      const dynamic=document.createElement("button");
      dynamic.id="i18n-browser-test-button";
      dynamic.textContent="Welcome Home";
      dynamic.setAttribute("aria-label","Open navigation");
      document.body.append(dynamic);

      setTimeout(function(){
        result.dynamic=dynamic.textContent==="Bienvenidos a casa";
        result.attribute=dynamic.getAttribute("aria-label")==="Abrir navegación";

        dynamic.setAttribute("aria-label","Switch color theme");

        setTimeout(function(){
          result.attributeChanged=dynamic.getAttribute("aria-label")==="Cambiar tema visual";

          const firstParty=document.createElement("a");
          firstParty.href="https://vervenveda.com/Khaemenes_Academy.github.io/student/";
          firstParty.textContent="Student Entry";
          document.body.append(firstParty);
          protectedClick(firstParty);
          result.firstPartyPropagation=new URL(firstParty.href).searchParams.get("lang")==="es";

          const thirdParty=document.createElement("a");
          thirdParty.href="https://example.com/";
          thirdParty.textContent="External";
          document.body.append(thirdParty);
          protectedClick(thirdParty);
          result.thirdPartyIsolation=!new URL(thirdParty.href).searchParams.has("lang");

          const student=document.querySelector('a[href="./student/"],a[href$="/student/"]');
          const family=document.querySelector('a[href="./family/"],a[href$="/family/"]');
          result.studentDoorway=!student||student instanceof HTMLAnchorElement;
          result.familyDoorway=!family||family instanceof HTMLAnchorElement;

          api.setLanguage("pt");
          dynamic.textContent="Language";
          api.refresh();
          result.extendedLanguage=dynamic.textContent==="Idioma";

          api.setLanguage("en");
          result.restore=document.documentElement.dir==="ltr" &&
            api.getLanguage()==="en" &&
            localStorage.getItem(PREF_KEY)==="en";

          dynamic.remove();
          firstParty.remove();
          thirdParty.remove();
          finish(result);
        },120);
      },120);
    }catch(e){
      document.body.dataset.i18nSmoke="FAIL";
      document.body.dataset.i18nDetails=String(e.message);
    }
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",()=>setTimeout(run,500),{once:true});
  }else setTimeout(run,500);
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
 const child=spawn(browser,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run","--no-default-browser-check","--window-size=390,844","--virtual-time-budget=8500","--dump-dom","http://127.0.0.1:"+port+"/index.html"]);
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
}else console.log("BROWSER_I18N=PASS; 13 languages, stored preference, Arabic RTL, narrow/mobile layout, dynamic text/attributes, first-party propagation and English restore");
