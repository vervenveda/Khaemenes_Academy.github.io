"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"../family/index.html"),"utf8");
test("family account preparation is available but strictly informational",()=>{
 assert.match(html,/id="family-account-prepare"/);
 assert.match(html,/Prepare My Family for Account Cloud Connection/);
 assert.match(html,/Current status: LOCAL PROFILE/);
 assert.match(html,/Not server-connected/);
 assert.match(html,/No automated upload/);
 assert.match(html,/No paid storage required for free learning/);
});
test("family backup continuity is linked without introducing a credential form",()=>{
 assert.match(html,/href="#family-records-controls">Family Backup Tools/);
 assert.match(html,/it is not a login credential/);
 assert.match(html,/does not contain course-owned grades/);
 assert.match(html,/browser identifiers will be reconciliation references, not proof of ownership/);
});
