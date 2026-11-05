#!/usr/bin/env node
/* Anonymous, read-only public delivery check for Academy Pages.
 * No credentials, cookies, protected account APIs, storage writes, or STOS actions.
 * This checks GET availability and expected content, not interactive correctness. */
import fs from "node:fs";

const BASE=process.env.ACADEMY_PUBLIC_BASE||"https://vervenveda.com/Khaemenes_Academy.github.io/";
const HOME="https://vervenveda.com/KhaemenesAcademy_Home.github.io/";
const htmlPaths=[
  "index.html",
  "Health_learning/Health_is_wealth_6weeks_index.html",
  "Health_learning/Trivia_Health_index.html",
  "Health_learning/wellness_workshop_index.html",
  "Health_learning/workout_builder_index.html",
  "Parent_resources/Art_studio_index.html",
  "Parent_resources/Diploma_generator_index.html",
  "Parent_resources/Family_photo_album_index.html",
  "Parent_resources/Homeschool_compass_index.html",
  "Parent_resources/Transcript_generator_index.html",
  "adult/enroll/index.html","adult/index.html",
  "diagnostics/front-door/index.html",
  "family/accept/index.html","family/enroll/index.html","family/index.html",
  "mentor/index.html","offline/index.html",
  "student/index.html","student/profile.html",
  "teacher-admin/index.html",
  "tools/Keyboard_index.html","tools/song_embedder_index.html",
  "tour/index.html","verify/index.html"
];
const aliases=[
  "", "student/","family/","family/enroll/","family/accept/",
  "adult/","adult/enroll/","mentor/","offline/","teacher-admin/",
  "tour/","verify/"
];
const assetPaths=[
  "assets/khaemenes-family-registry.js",
  "assets/khaemenes-learner-context.js",
  "assets/khaemenes-naib-mentor-router.js",
  "assets/khaemenes-front-door-router.js",
  "assets/khaemenes-learning-continuation.js",
  "assets/khaemenes-parent-action-center.js",
  "assets/khaemenes-terminal03-readiness.js",
  "assets/khaemenes-home-personalization.js",
  "assets/khaemenes-learning-science.js",
  "assets/khaemenes-account-connection-status.js",
  "assets/khaemenes-campus-phrases.js",
  "assets/khaemenes-interlingual-core.js",
  "assets/vnv-language.js"
];
const routes=[
  ...htmlPaths.map(path=>({label:path,url:new URL(path,BASE).href,kind:"html"})),
  ...aliases.map(path=>({label:"alias:"+path,url:new URL(path,BASE).href,kind:"html"})),
  ...assetPaths.map(path=>({label:path,url:new URL(path,BASE).href,kind:"js"})),
  {label:"new-public-front-door",url:HOME,kind:"html"}
];

const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function probe(item){
  let last=null;
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(item.url,{
        redirect:"follow",cache:"no-store",credentials:"omit",
        headers:{"Accept":item.kind==="js"?"text/javascript,application/javascript,*/*":"text/html,*/*"},
        signal:AbortSignal.timeout(12000)
      });
      const text=await response.text();
      const contentType=response.headers.get("content-type")||"";
      const looksHtml=/<(?:!doctype\s+html|html|head|title)\b/i.test(text.slice(0,1600));
      const pageGood=item.kind==="html" && looksHtml && /html/i.test(contentType);
      const jsGood=item.kind==="js" && !looksHtml &&
        /(?:javascript|ecmascript|text\/plain|application\/octet-stream)/i.test(contentType) &&
        text.trim().length>100;
      const good=response.status===200 && (pageGood||jsGood);
      last={path:item.label,url:item.url,kind:item.kind,ok:good,status:response.status,contentType,bytes:text.length,finalUrl:response.url,attempt};
      if(good)break;
    }catch(error){
      last={path:item.label,url:item.url,kind:item.kind,ok:false,error:String(error?.message||error),attempt};
    }
    if(attempt<3)await pause(1300*attempt);
  }
  console.log((last.ok?"PASS ":"FAIL ")+item.label+" "+(last.status??last.error)+" "+(last.finalUrl||""));
  return last;
}

const results=[];
const concurrency=5;
let next=0;
await Promise.all(Array.from({length:concurrency},async()=>{
  while(next<routes.length){
    const i=next++;
    results[i]=await probe(routes[i]);
  }
}));
const summary={
  schema:"academy-public-delivery-check-v1",
  checkedAt:new Date().toISOString(),
  base:BASE,
  noAuthentication:true,
  total:results.length,passed:results.filter(r=>r.ok).length,
  failed:results.filter(r=>!r.ok).length,
  results
};
fs.writeFileSync("academy-public-route-receipt.json",JSON.stringify(summary,null,2)+"\n");
console.log("ACADEMY_PUBLIC_DELIVERY="+(summary.failed?"FAIL":"PASS")+" "+summary.passed+"/"+summary.total);
if(summary.failed)process.exitCode=1;
