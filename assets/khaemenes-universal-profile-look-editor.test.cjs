"use strict";
// Node: node assets/khaemenes-universal-profile-look-editor.test.cjs
// Uses fictional learner, mock DOM and no network / real browser storage.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"khaemenes-universal-profile-look-editor.js"),"utf8");
const elements=new Map();
function element(tag="div"){
 const listeners={};
 const node={tagName:tag,children:[],dataset:{},attributes:{},value:"",hidden:false,open:false,
  style:{props:{},setProperty(k,v,priority){this.props[k]={value:v,priority:priority||""}},getPropertyValue(k){return this.props[k]?.value||""}},
  setAttribute(k,v){this.attributes[k]=String(v)},
  addEventListener(k,fn){(listeners[k]??=[]).push(fn)},
  trigger(k){for(const fn of listeners[k]||[])fn()},
  append(...nodes){this.children.push(...nodes)},
  replaceChildren(...nodes){this.children=nodes},
  focus(){this.focused=true},
  closest(){return{hidden:false}},
  querySelector(selector){return selector===".kpls-preview"?elements.get("kplsPreview"):null},
  showModal(){this.open=true},
  close(){this.open=false;this.trigger("close")}
 };
 let markup="";
 Object.defineProperty(node,"innerHTML",{get(){return markup},set(v){
  markup=v;
  for(const m of v.matchAll(/id="([^"]+)"/g))elements.set(m[1],element());
  elements.set("kplsPreview",element());
 }});
 return node;
}
const document={head:element("head"),body:element("body"),activeElement:{isConnected:true,focus(){}},
 createElement:element,getElementById(id){return elements.get(id)||null}};
const window={};
vm.runInNewContext(source,{window,document,URL,Image:class{}});
const core=window.KhaemenesUniversalProfileLookEditor;
assert.ok(core);
let stored=null,chooser=null,launched=null;
window.KhaemenesYearbookProfileImages={
 choose(id,fn){chooser={id,fn};return true},
 openYearbook(id){launched=id;return true}
};
const current={id:"fictional-learner",displayName:"Student"};
const adapter={allowYearbook:true,readHeroImage(){return""},getIdentity(){return current},
 readLook(){return{badge:"★",frame:"circle",background:"forest",cardColor:"",nameFont:"academy"}},
 readPhoto(){return""},commit(p){stored=p;return true},refresh(){}};
assert.equal(core.register(adapter),true);
assert.equal(core.open("picture"),true);
const colors=elements.get("kplsColors").children;
assert.equal(colors.length,24);
for(const swatch of colors){
 assert.equal(swatch.style.getPropertyValue("background-color"),swatch.dataset.color);
 assert.equal(swatch.style.props["background-color"].priority,"important");
 assert.ok(swatch.attributes["aria-label"]?.includes(swatch.dataset.color));
}
assert.equal(elements.get("kplsFrames").children.length,10);
colors[8].trigger("click");
elements.get("kplsSave").trigger("click");
assert.equal(stored.look.cardColor,colors[8].dataset.color);
assert.equal(stored.heroImage,null);
assert.equal(core.open("picture"),true);
elements.get("kplsYearbookPhoto").trigger("click");
assert.equal(chooser.id,"fictional-learner");
(async()=>{
 assert.equal(await chooser.fn("data:image/jpeg;base64,ZmFrZQ==","fictional-learner"),true);
 elements.get("kplsSave").trigger("click");
 assert.equal(stored.photo,"data:image/jpeg;base64,ZmFrZQ==");
 assert.equal(core.open("picture"),true);
 elements.get("kplsYearbookHero").trigger("click");
 assert.equal(await chooser.fn("data:image/jpeg;base64,ZmFrZQ==","fictional-learner"),true);
 elements.get("kplsSave").trigger("click");
 assert.equal(stored.heroImage,"data:image/jpeg;base64,ZmFrZQ==");
 assert.equal(core.open("picture"),true);
 elements.get("kplsOpenYearbook").trigger("click");
 assert.equal(launched,"fictional-learner");
 elements.get("kplsRemoveHero").trigger("click");
 elements.get("kplsSave").trigger("click");
 assert.equal(stored.heroImage,"");
 console.log("PASS shared modal: 24 visible swatches, 10 frames, saved colors, Yearbook picture/hero selection and hero removal");
})().catch(e=>{console.error(e);process.exitCode=1});
