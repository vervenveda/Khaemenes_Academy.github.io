import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const failures=[];
let htmlCount=0, officialCount=0;

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","vendor","archive","archives","backup","backups","private"].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.isFile()&&entry.name.toLowerCase().endsWith(".html"))check(full);
  }
}
function check(file){
  htmlCount++;
  const rel=path.relative(ROOT,file).replaceAll(path.sep,"/");
  const html=fs.readFileSync(file,"utf8");
  const official=[...html.matchAll(/<script\b[^>]*src=["']https:\/\/vervenveda\.com\/assets\/vnv-ecosystem-toolbar\.js["'][^>]*>\s*<\/script>/gi)];
  const legacy=[...html.matchAll(/<script\b[^>]*src=["'][^"']*(?:vnv-beta-link|khaemenes-landing-toolbar)\.js[^"']*["'][^>]*>\s*<\/script>/gi)];
  if(official.length!==1)failures.push(rel+": expected exactly one official ecosystem toolbar script, found "+official.length);
  else officialCount++;
  if(legacy.length)failures.push(rel+": legacy lower-right loader remains ("+legacy.length+")");
  if(/id=["'](?:vnvBetaProgramLink|vnvBetaProgramFallback|khaemenesLearnerUtilityToolbar|khaeLandingUtilityDock|khaemenesHomeUtilityDock)["']/i.test(html)){
    failures.push(rel+": legacy lower-right element id remains in static HTML");
  }
}
walk(ROOT);

if(failures.length){
  console.error("Academy ecosystem toolbar topology FAILED ("+failures.length+" issue"+(failures.length===1?"":"s")+"):");
  for(const failure of failures)console.error("- "+failure);
  process.exit(1);
}
console.log("PASS Academy ecosystem toolbar topology: "+officialCount+"/"+htmlCount+" HTML pages use exactly one official toolbar and no legacy floating Beta loader.");
