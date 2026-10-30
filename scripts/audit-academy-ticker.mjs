import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const ticker=read("assets/khaemenes-academy-ticker.js");
const compat=read("assets/khaemenes-global-header.js");

const required=[
  ["Academy Home","Khaemenes_Academy.github.io/"],
  ["Student Portal","student/"],
  ["Family Center","family/"],
  ["Enroll / Add Learner","family/enroll/"],
  ["Adult Scholar","adult/"],
  ["Teacher Admin","teacher-admin/"],
  ["Mentor","mentor/"],
  ["Verify Records","verify/"],
  ["Offline Learning","offline/"],
  ["Preschool","Khaemenes_Preschool.github.io/"],
  ["Kindergarten","Khaemenes_KinderGarden.github.io/"],
  ["Elementary","Khaemenes_Elementary.github.io/"],
  ["Middle School","Khaemenes_Middle.github.io/"],
  ["High School","Khaemenes_High.github.io/"],
  ["Higher Learning","Khaemenes_Higher_Learning.github.io/"],
  ["Linguistics","Khaemenes_Linguistics.github.io/"],
  ["Search","PLERASearch.github.io/"],
  ["Beta","/beta/"],
  ["Help","#help"]
];

assert.match(ticker,/id=ID|ticker\.id=ID/,"ticker must mount one canonical ID");
assert.match(ticker,/Khaemenes Academy Quick Links/,"ticker label missing");
assert.match(ticker,/VNV_TICKER_PAUSED/,"pause preference missing");
assert.match(ticker,/prefers-reduced-motion/,"reduced-motion support missing");
assert.match(compat,/khaemenes-academy-ticker\.js/,"legacy global-header loader must delegate to canonical ticker");

for(const [label,fragment] of required){
  assert.ok(ticker.includes(label),"ticker missing important Academy link: "+label);
  assert.ok(ticker.includes(fragment),"ticker missing expected destination fragment for "+label+": "+fragment);
}

for(const local of [
  "index.html","student/index.html","family/index.html","family/enroll/index.html",
  "adult/index.html","teacher-admin/index.html","mentor/index.html","verify/index.html","offline/index.html"
]){
  assert.ok(fs.existsSync(path.join(ROOT,local)),"ticker local destination missing: "+local);
}
assert.match(read("index.html"),/id=["']help["']/,"Academy Help ticker destination #help is missing from Home");

let htmlCount=0,toolbarCount=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","vendor","archive","archives","backup","backups","private"].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.isFile()&&entry.name.toLowerCase().endsWith(".html")){
      htmlCount++;
      const html=fs.readFileSync(full,"utf8");
      if(/https:\/\/vervenveda\.com\/assets\/vnv-ecosystem-toolbar\.js/i.test(html))toolbarCount++;
    }
  }
}
walk(ROOT);
assert.equal(toolbarCount,htmlCount,"every Academy HTML page must remain attached to the official toolbar, which mounts the Academy ticker");

console.log("PASS Academy ticker topology: "+required.length+" important links, "+toolbarCount+"/"+htmlCount+" toolbar-coupled HTML pages, canonical ticker single-source.");
