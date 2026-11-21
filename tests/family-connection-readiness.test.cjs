"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"../family/index.html"),"utf8");
test("current Family Account Connection remains informational and uncommissioned",()=>{
 assert.match(html,/id="family-account-readiness"/);
 assert.match(html,/id="family-account-prepare"/);
 assert.match(html,/Preparing for secure account connection/);
 assert.match(html,/LOCAL PROFILE — Cloud synchronization is not verified/);
 assert.match(html,/Verified sign-in and cross-device synchronization are not active/);
 assert.match(html,/Nothing is connected or purchased here/);
 assert.match(html,/independently verified account sign-in and T03 commissioning/);
});
test("existing family identity is preserved, backup controls are real and no credentials are requested",()=>{
 assert.match(html,/Choose Your Existing Family/);
 assert.match(html,/Do not create a duplicate/);
 assert.match(html,/id="family-records-controls"/);
 assert.match(html,/id="exportFamily"/);
 assert.match(html,/id="restoreFamily"/);
 assert.match(html,/family backups do not include every course record/);
 assert.match(html,/Browser identifiers are not credentials or proof of guardianship/);
 assert.match(html,/Do not enter passwords, PINs or recovery codes into the local-only enrollment form/);
});
