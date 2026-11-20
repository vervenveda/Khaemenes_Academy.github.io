import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const pages=[
 {file:"family/progress/index.html",label:"Class Progress &amp; Grades",script:"parent-progress.js",data:"parentProgressWorkspace",lab:false},
 {file:"family-cloud/index.html",label:"Family Storage OS",script:'import {planTemporaryCleanup}',data:'id="usage"',lab:true}
];
const canonical={
 ticker:"https://vervenveda.com/assets/vnv-ticker-autopopulate.js",
 header:"https://vervenveda.com/assets/vnv-header-autopopulate.js",
 classTools:"https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1",
 ecosystem:"https://vervenveda.com/assets/vnv-ecosystem-toolbar.js",
 linguistics:"https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
 language:"https://vervenveda.com/assets/vnv-language.js?v=20261108-cream-buttons"
};
const count=(html,needle)=>html.split(needle).length-1;
for(const {file,label,script,data,lab} of pages){
 const html=fs.readFileSync(path.join(root,file),"utf8");
 const refs=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)].map(x=>x[1]);
 for(const [role,url] of Object.entries(canonical)){
  assert.equal(refs.filter(x=>x===url).length,1,file+": exactly one canonical "+role);
 }
 assert.equal(refs.filter(x=>/vnv-333-ticker\.js/.test(x)).length,0,file+": no 333 ticker");
 assert.equal(refs.filter(x=>/vnv-ticker-autopopulate\.js/.test(x)).length,1,file+": one AutoPopulate engine");
 assert.equal(count(html,"VNV_TICKER.autoPopulate("),1,file+": one page ticker invocation");
 assert.equal(count(html,"VNV_HEADER.mount("),1,file+": one official header and hamburger");
 assert.match(html,/VNV_HEADER\.mount\(\{[^}]+actions:\[\]/,file+": no extra header buttons");
 assert.match(html,/KhaemenesClassToolsConfigV1=Object\.freeze\(/,file+": canonical lower-left tools config");
 assert.match(html,/window\.KhaemenesTranslatorLoader\?\.ensure\?\./,file+": linguistics resource handoff");
 assert.match(html,/class="academy-page-hero"/,file+": colorful hero");
 assert.match(html,/font:400 33px\/1\.3 Cinzel/,file+": 33px eyebrow");
 assert.match(html,/77px/,file+": 77px title maximum");
 assert.match(html,/font:400 24px\/1\.(?:35|4) Nunito/,file+": 24px descriptors");
 assert.match(html,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,file+": symmetric three descriptors");
 assert.match(html,/border-radius:7px/,file+": seven-pixel corners");
 assert.match(html,/footer/,file+": center footer retained");
 assert.ok(html.includes(label),file+": visible course title retained");
 assert.ok(html.includes(script)&&html.includes(data),file+": underlying function preserved");
 assert.doesNotMatch(html,/khaemenes-global-header\.js|khaemenes-academy-ticker\.js|high-school-global-chrome-v2\.js/,file+": retired chrome absent");
 assert.doesNotMatch(html,/VNV_333|vnv333NetworkTicker/,file+": one-ticker page has no 333 bootstrapping");
 if(lab){
  assert.match(html,/import \{planTemporaryCleanup\} from "\.\/core\/retention-policy\.mjs"/);
  assert.match(html,/does not read, modify or synchronize real family records/);
 }else{
  assert.match(html,/#parentProgressWorkspace/);
  assert.match(html,/Print Selected Learner Report|parent-progress\.js/);
  assert.match(html,/@media print/);
 }
 console.log("PASS "+file+": canonical single ticker + header + lower-left tools + translator, preserved local behavior");
}
for(const isolated of ["academy/testing/families/index.html","family/mini-cloud/index.html"]){
 const html=fs.readFileSync(path.join(root,isolated),"utf8");
 assert.match(html,/Content-Security-Policy/);
 assert.match(html,/default-src 'none'/);
 for(const url of Object.values(canonical))assert.ok(!html.includes(url),"isolated CSP page may not import remote chrome: "+isolated);
 console.log("PASS "+isolated+": isolated CSP untouched");
}
