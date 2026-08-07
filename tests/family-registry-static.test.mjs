import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const registry=fs.readFileSync(new URL("../Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js",import.meta.url),"utf8");
const invite=fs.readFileSync(new URL("../Khaemenes_Academy.github.io/assets/khaemenes-family-invite-client.js",import.meta.url),"utf8");
const portal=fs.readFileSync(new URL("../Khaemenes_Academy.github.io/family/index.html",import.meta.url),"utf8");

test("family registry supports many adults and many learners",()=>{
  assert.match(registry,/families:\{\}/);
  assert.match(registry,/adults:\{\}/);
  assert.match(registry,/learners:\{\}/);
  assert.match(registry,/learnerAdultAccess:\{\}/);
  assert.match(registry,/function addAdultLocal/);
  assert.match(registry,/function registerLearner/);
});

test("each learner gets separate stable learner and account IDs",()=>{
  assert.match(registry,/const learnerId=existingLearnerId \|\| id\("learner"\)/);
  assert.match(registry,/const accountId=id\("learneracct"\)/);
});

test("adult permissions can be scoped to selected learner IDs",()=>{
  assert.match(registry,/learnerAdultAccess/);
  assert.match(registry,/permissionPreset/);
  assert.match(registry,/revokeAdultAccess/);
});

test("email invite service is disabled honestly in static mode",()=>{
  assert.match(invite,/enabled:false/);
  assert.match(invite,/family-account-server-not-connected/);
  assert.match(portal,/Nothing was sent and no access was granted/);
});

test("invite tokens are never written to local storage by invitation client",()=>{
  assert.doesNotMatch(invite,/localStorage/);
});

test("server invitation requests use secure cookie credentials",()=>{
  assert.match(invite,/credentials:"include"/);
  assert.match(invite,/https-required/);
});

test("family portal supports selected children for email invitation",()=>{
  assert.match(portal,/Which learner accounts may this adult access/);
  assert.match(portal,/permission level/i);
  assert.match(portal,/authorized to grant this adult access/i);
});

test("legacy preschool learner can migrate non-destructively",()=>{
  assert.match(registry,/khaemenes_preschool_profile_v1/);
  assert.match(registry,/migrateLegacyPreschool/);
});
