"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"../academy/testing/families/index.html"),"utf8");
const blocks=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
test("single self-contained sandbox script parses",()=>{
 assert.equal(blocks.length,1);
 new vm.Script(blocks[0],{filename:"naib-family-sandbox.js"});
});
test("sandbox has no production registry, storage, or external services",()=>{
 assert.doesNotMatch(html,/<script[^>]*src=/i);
 assert.doesNotMatch(html,/\bfetch\s*\(|XMLHttpRequest|sendBeacon\(|\blocalStorage\b|indexedDB/i);
 assert.doesNotMatch(html,/khaemenes_family_registry_v1|khaemenes_active_family_v1|khaemenes-family-registry\.js/);
 assert.match(html,/sessionStorage\.setItem\(KEY,/);
 assert.match(html,/sessionStorage\.getItem\(KEY\)/);
 assert.match(html,/connect-src 'none'/);
});
test("test-only controls and no sensitive fields",()=>{
 for(const id of ["create","seed","reset","export","roster"])assert.match(html,new RegExp('id="'+id+'"'));
 for(const fn of ["addFamily","addLearner","retire","render"])assert.match(html,new RegExp("function "+fn+"\\("));
 assert.doesNotMatch(html,/type="password"|type="file"/i);
 assert.match(html,/NAIB TEST ONLY/);
});
