import fs from "node:fs";
import assert from "node:assert/strict";

const routerPath="assets/khaemenes-naib-mentor-router.js";
const contractPath="ACADEMY_MASTERY_ACCESS_CONTRACT_V1.md";
const router=fs.readFileSync(routerPath,"utf8");
const contract=fs.readFileSync(contractPath,"utf8");

for(const stage of ["preschool","kindergarten","elementary","middle","high","higher"]){
  assert.match(router,new RegExp(`\\b${stage}\\b`),`router must include stage ${stage}`);
}

for(const policy of [
  'preschool:"archaemenes"',
  'kindergarten:"archaemenes"',
  'elementary:"archaemenes"',
  'middle:"archaemenes"',
  'high:"archaemenes"',
  'higher:"archaemenes"'
]) assert.ok(router.includes(policy),`missing mentor policy ${policy}`);

assert.ok(router.includes("masteryThresholdMinimum:80"),"NAIB authority contract must publish the Academy 80% minimum");
assert.ok(router.includes("bypassesPrerequisites:false"),"mentor must not bypass prerequisites");
assert.ok(router.includes("revealsLockedAssessments:false"),"mentor must not reveal locked assessments");
assert.ok(router.includes('higher:`${base}/Khaemenes_Higher_Learning.github.io/start/`'),"Higher Learning learner routing must exist");

assert.match(contract,/universal free education platform/i,"contract must state universal free education mission");
assert.match(contract,/Open Preschool Learning Garden/i,"contract must preserve open Preschool exploration");
assert.match(contract,/Formal Preschool Curriculum/i,"contract must distinguish formal Preschool curriculum");
assert.match(contract,/80% mastery/i,"contract must state 80% mastery");
assert.match(contract,/Review is not mastery/i,"contract must separate review from mastery");
assert.match(contract,/Direct URL entry must not create an unlock/i,"contract must prohibit direct-URL progression bypass");
assert.match(contract,/Assessment exposure rule/i,"contract must define locked assessment exposure policy");
assert.match(contract,/Beta participation cannot unlock curriculum/i,"Beta must not be a progression authority");

console.log("Khaemenes lifelong mentor + mastery contract: PASS");
