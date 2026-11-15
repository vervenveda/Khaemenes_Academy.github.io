#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const ROOT=process.cwd(),WRITE=process.argv.includes("--write");
const TAG='  <script src="/Khaemenes_Academy.github.io/assets/academy-core-global-standard-v1.js" defer data-academy-core-global-standard="16-33-66-chrome-semantics"></script>\n';
const LOADER=/academy-core-global-standard-v1\.js/i;
function walk(dir){const out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){if([".git","node_modules"].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())out.push(...walk(f));else out.push(path.relative(ROOT,f).split(path.sep).join("/"))}return out}
function inject(s){if(LOADER.test(s))return s;if(/<\/head>/i.test(s))return s.replace(/<\/head>/i,TAG+"</head>");if(/<body\b/i.test(s))return s.replace(/<body\b/i,TAG+"<body");return TAG+s}
const files=walk(ROOT).filter(f=>/\.html?$/i.test(f)).sort();let covered=0,changed=0;
for(const file of files){const abs=path.join(ROOT,file);let s=fs.readFileSync(abs,"utf8");if(LOADER.test(s)){covered++;continue}if(WRITE){s=inject(s);fs.writeFileSync(abs,s);covered++;changed++}}
const guard=fs.readFileSync(path.join(ROOT,"assets/academy-core-global-standard-v1.js"),"utf8");
const checks=[
 ["16px readable floor",/size<16[\s\S]{0,180}font-size","16px","important"/],
 ["33px heading rule",/font-size:33px!important/],["66px primary-title rule",/font-size:66px!important/],
 ["333 ticker",/vnv-333-ticker\.js/],["AutoPopulate ticker",/vnv-ticker-autopopulate\.js/],
 ["official header",/vnv-header-autopopulate\.js[\s\S]*VNV_HEADER/],["official toolbar",/vnv-ecosystem-toolbar\.js[\s\S]*vnvEcosystemUtilityDock/],
 ["semantic authority",/khaemenesHierarchy="title-description-v1"/]
];
const failures=checks.filter(([,re])=>!re.test(guard)).map(([n])=>n);
console.log(JSON.stringify({mode:WRITE?"write":"check",htmlFiles:files.length,covered,changed,missing:files.length-covered,assertionFailures:failures},null,2));
if(files.length!==covered||failures.length)process.exitCode=1;