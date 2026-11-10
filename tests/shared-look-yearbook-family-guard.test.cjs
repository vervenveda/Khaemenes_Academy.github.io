"use strict";
/* Synthetic/source contract checks; run node --test tests/shared-look-yearbook-family-guard.test.cjs */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const adapter=read("assets/khaemenes-high-school-look-adapter.js");
const editor=read("assets/khaemenes-universal-profile-look-editor.js");
const yearbook=read("assets/khaemenes-yearbook-profile-images.js");
test("high school adapter requires active family and learner membership",()=>{
 assert.ok(adapter.includes('read("khaemenes_active_family_v1")'));
 assert.ok(adapter.includes("family.learnerIds.includes(id)"));
 assert.ok(adapter.includes("activeFamily!==learner.familyId"));
});
test("universal look editor closes on learner identity change, including other tabs",()=>{
 assert.ok(editor.includes("const closeForIdentityChange=()=>"));
 assert.ok(editor.includes("dialog?.open&&(!owner||adult()?.id!==owner)"));
 assert.ok(editor.includes('w.addEventListener("khaemenes-family-changed",closeForIdentityChange)'));
 assert.ok(editor.includes('w.addEventListener("storage",event=>'));
 assert.ok(editor.includes('if(!dialog?.open||!id||id!==owner)'));
});
test("yearbook ownership requires family membership, not only a local learner pointer",()=>{
 assert.ok(yearbook.includes('localStorage.getItem("khaemenes_active_family_v1")'));
 assert.ok(yearbook.includes("family.learnerIds.includes(id)"));
 assert.ok(yearbook.includes("if((a&&a!==id)||(b&&b!==id))return null"));
});
test("yearbook picker and embedded studio close on sibling change",()=>{
 assert.ok(yearbook.includes("const closeOnLearnerChange=()=>{if(dlg.open&&owner()!==id)dlg.close()}"));
 assert.ok(yearbook.includes("const closeOnLearnerChange=()=>{if(dialog.open&&owner()!==id)dialog.close()}"));
 assert.ok(yearbook.includes('frame.src="about:blank";dialog.remove()'));
 assert.ok(yearbook.includes('w.removeEventListener("storage",onStorage)'));
});
