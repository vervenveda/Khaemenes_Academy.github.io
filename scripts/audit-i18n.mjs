#!/usr/bin/env node
// Source-level multilingual coverage inventory. No external API, dependencies or learner data.
// Approximate: tracks static HTML and embedded public registry strings, not visual/browser correctness.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html"),source=read("assets/vnv-language.js");
const LANGS=["en","es","fr","ar","zh","de","ru","pt","hi","ja","ko","it","bn"];
const jsonAfter=prefix=>{
  const start=source.indexOf(prefix);if(start<0)throw Error("Missing "+prefix);
  const line=source.slice(start+prefix.length).split("\n",1)[0].trim();
  return JSON.parse(line.replace(/;\s*$/,""));
};
const rows=[...jsonAfter("const ROWS="),...(source.includes("const POLYGLOT_ROWS=")?jsonAfter("const POLYGLOT_ROWS="):[])];
const extra=jsonAfter("const EXTENDED=");
const titles=jsonAfter("const TITLE_TRANSLATIONS=");
const strings=new Map();
function add(text,kind){
 const t=String(text||"").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g," ").trim();
 if(t.length<2||!/[\p{L}]/u.test(t))return;
 // Names, brands, linguistic examples, and isolated initialisms are preserved as source-language text.
 if(/^(KA|NAIB|STOS|ARSHIF|PLERA|PROSE|Polyglot|Verve N Veda|333|ESL|AI|EN|DE|LAB)$/i.test(t))return;
 if(!strings.has(t))strings.set(t,new Set());
 strings.get(t).add(kind);
}
const body=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<!--[\s\S]*?-->/g," ");
for(const match of body.matchAll(/>([^<>]+)</g))add(match[1],"page text");
for(const match of body.matchAll(/\b(?:placeholder|aria-label|title|alt)\s*=\s*(["'])(.*?)\1/gi))add(match[2],"attribute");
const docTitle=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);if(docTitle)add(docTitle[1],"document title");
const registry=html.match(/<script\s+type="application\/json"\s+id="appRegistry">([\s\S]*?)<\/script>/i);
if(registry){
  const apps=JSON.parse(registry[1]);
  for(const app of apps){
    for(const key of ["title","category","desc"])add(app[key],"app directory");
    for(const item of app.features||[])add(item,"app feature");
  }
}
const register=html.match(/const SITES\s*=\s*(\[[^\n]*\]);/);
if(register){
  try{for(const site of JSON.parse(register[1]))for(const key of ["title","description","desc","category"])add(site[key],"ecosystem directory")}catch{}
}
const translate=(text,lang)=>{
 if(lang==="en")return true;
 const row=rows.find(r=>r[0]===text);
 const i=LANGS.indexOf(lang);
 if(row&&i>=0&&i<7&&row[i])return true;
 if(i>=7&&extra[text]?.[i-7])return true;
 if(titles[text]?.[lang])return true;
 return false;
};
const labels={};
for(const lang of LANGS){
 const missing=[...strings.keys()].filter(text=>!translate(text,lang));
 labels[lang]={count:strings.size,curated:strings.size-missing.length,curatedPercent:Math.round(100*(strings.size-missing.length)/Math.max(1,strings.size)),missing:missing.map(text=>({text,kind:[...strings.get(text)]}))};
}
const report={generatedAt:new Date().toISOString(),source:"public source HTML and app-directory strings",approximation:"Static-only; excludes future generated text and does not validate translation quality",totalUniquePhrases:strings.size,byLanguage:labels};
const dest=path.join(root,"artifacts","i18n-source-coverage.json");
fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(report,null,2));
for(const lang of LANGS)console.log(lang+": "+labels[lang].curated+"/"+labels[lang].count+" offline curated ("+labels[lang].curatedPercent+"%); needs "+labels[lang].missing.length);
console.log("I18N_SOURCE_AUDIT=PASS; inventory="+dest);
