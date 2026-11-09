"use strict";
// Synthetic parent photo adapter checks: node assets/khaemenes-family-parent-look-adapter.test.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const src=fs.readFileSync(path.join(__dirname,"khaemenes-family-parent-look-adapter.js"),"utf8");
class Storage{
 constructor(){this.items=new Map();this.fail=false}
 getItem(k){return this.items.get(k)??null}
 setItem(k,v){if(this.fail)throw Error("simulated quota");this.items.set(k,String(v))}
 removeItem(k){if(this.fail)throw Error("simulated quota");this.items.delete(k)}
}
const store=new Storage();
let selected="adult-a",refreshes=0,adapter=null;
const adults={"adult-a":{adultId:"adult-a",displayName:"Parent A"},"adult-b":{adultId:"adult-b",displayName:"Parent B"}};
const registry={activeIds(){return{adultId:selected}},getAdult(){return adults[selected]||null}};
const core={register(next){adapter=next;return true},open(){return true}};
const win={localStorage:store,KhaemenesFamilyRegistry:registry,KhaemenesUniversalProfileLookEditor:core,KhaemenesFamilyParentHero:{refresh(){refreshes++}}};
vm.runInNewContext(src,{window:win,encodeURIComponent,JSON,Object});
assert.ok(adapter);
const look={frame:"oval",badge:"★",background:"forest",cardColor:"#243038",nameFont:"academy",displayName:"Parent A"};
const key=id=>"khaemenes.parent.profile.appearance.v1:"+encodeURIComponent(id);
const photoKey=id=>"khaemenes.parent.profile.photo.v1:"+encodeURIComponent(id);
assert.equal(adapter.commit({id:"adult-a",look,photo:null}),true);
assert.equal(JSON.parse(store.getItem(key("adult-a"))).frame,"oval");
assert.equal(adapter.commit({id:"adult-b",look,photo:null}),false);
assert.equal(adapter.commit({id:"adult-a",look:{...look,frame:"incorrect"},photo:null}),false);
assert.equal(adapter.commit({id:"adult-a",look:{...look,unauthorizedRole:"admin"},photo:null}),true);
assert.equal(JSON.parse(store.getItem(key("adult-a"))).unauthorizedRole,undefined);
assert.equal(adapter.commit({id:"adult-a",look,photo:"https://untrusted.test/photo.jpg"}),false);
const sample="data:image/jpeg;base64,ZmFrZQ==";
assert.equal(adapter.commit({id:"adult-a",look,photo:sample}),true);
assert.equal(store.getItem(photoKey("adult-a")),sample);
selected="adult-b";
assert.equal(adapter.readLook("adult-a").frame,undefined);
assert.equal(adapter.readPhoto("adult-a"),"");
assert.equal(adapter.commit({id:"adult-b",look:{...look,displayName:"Parent B"},photo:null}),true);
assert.equal(adapter.readPhoto("adult-b"),null);
assert.equal(store.getItem(photoKey("adult-a")),sample);
selected="adult-a";
const original=store.getItem(key("adult-a"));
store.fail=true;
assert.equal(adapter.commit({id:"adult-a",look:{...look,displayName:"New Name"},photo:null}),false);
store.fail=false;
assert.equal(store.getItem(key("adult-a")),original);
assert.equal(adapter.commit({id:"adult-a",look,photo:""}),true);
assert.equal(store.getItem(photoKey("adult-a")),null);
assert.equal(win.KhaemenesFamilyParentLookStudio.open("picture"),true);
adapter.refresh();assert.equal(refreshes,1);
console.log("PASS: parent photo isolation, allowlist, save/readback, failed-write preservation, and removal (synthetic)");
