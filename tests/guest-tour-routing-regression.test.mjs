import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const invitation=fs.readFileSync(new URL("../assets/khaemenes-guest-tour-invitation.js",import.meta.url),"utf8");

test("guest feature protection identifies grade dashboards by their path or body marker",()=>{
 assert.ok(invitation.includes("const gradeFromPath=location.pathname.match("));
 assert.match(invitation,/const thisGrade=Number\(document\.body\?\.dataset\?\.grade\|\|gradeFromPath\?\.\[1\]\|\|0\)/);
 assert.match(invitation,/const AREA=\[9,10,11,12\]\.includes\(thisGrade\)\?"grade"/);
});
test("registered learner selection stays available without enrolling a second time",()=>{
 assert.match(invitation,/Select an Existing Student/);
 assert.match(invitation,/selectExisting\.href=ROOT\+"student\/"/);
 assert.match(invitation,/window\.KhaemenesFamilyRegistry\?\.getLearner\?\.\(\)/);
});
test("guest protection blocks personal tools but does not reopen the tour modal after dismissal",()=>{
 assert.match(invitation,/let guestPromptShown=false;/);
 assert.match(invitation,/if\(guestPromptShown\)\{/);
 assert.match(invitation,/data-guest-tools-notice/);
 assert.match(invitation,/event\.preventDefault\(\);event\.stopImmediatePropagation\(\);/);
 for(const label of ["Student Progress","Edit Background","Schedule","Creative Tools"]){
  assert.ok(invitation.includes('"'+label+'"'),label);
 }
});
