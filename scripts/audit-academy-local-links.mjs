import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const allFiles=new Set();
const htmlFiles=[];

function walk(dir,rel=""){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","vendor","archive","archives","backup","backups","private"].includes(entry.name))continue;
    const nextRel=rel?path.posix.join(rel,entry.name):entry.name;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full,nextRel);
    else if(entry.isFile()){
      allFiles.add(nextRel);
      if(entry.name.toLowerCase().endsWith(".html"))htmlFiles.push(nextRel);
    }
  }
}
walk(ROOT);

function normalize(source,raw){
  raw=String(raw||"").trim();
  if(!raw||raw.startsWith("#")||raw.startsWith("?")||raw.startsWith("//")||raw.includes("${"))return null;
  if(/^(?:https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(raw))return null;
  raw=raw.split("#")[0].split("?")[0];
  if(!raw)return null;
  const academyPrefix="/Khaemenes_Academy.github.io/";
  if(raw.startsWith(academyPrefix))return raw.slice(academyPrefix.length);
  if(raw.startsWith("/"))return null; // apex Verve N Veda route, outside this repository
  return path.posix.normalize(path.posix.join(path.posix.dirname(source),raw));
}
function exists(target){
  if(allFiles.has(target))return true;
  if(allFiles.has(path.posix.join(target,"index.html")))return true;
  if(!path.posix.extname(target)&&allFiles.has(target+".html"))return true;
  return false;
}

const failures=[];
let checked=0;
for(const source of htmlFiles){
  const html=fs.readFileSync(path.join(ROOT,source),"utf8");
  const attr=/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  for(const m of html.matchAll(attr)){
    const raw=m[2].trim();
    const target=normalize(source,raw);
    if(target===null)continue;
    checked++;
    if(!exists(target))failures.push(source+": "+raw+" -> "+target);
  }
}
if(failures.length){
  console.error("Academy local-link topology FAILED ("+failures.length+" missing local reference"+(failures.length===1?"":"s")+"):");
  for(const failure of failures)console.error("- "+failure);
  process.exit(1);
}
console.log("PASS Academy local-link topology: "+htmlFiles.length+" HTML pages, "+checked+" repository-local references, 0 missing.");
