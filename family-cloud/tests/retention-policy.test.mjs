import {planTemporaryCleanup} from "../core/retention-policy.mjs";
import assert from "node:assert/strict";
const fixture={id:"preview-1",kind:"resource-preview",disposable:true,reconstructible:true,authoritative:false,pending:false,synced:true,bytes:30,expiresAt:10};
const arr=[fixture,{...fixture,id:"lesson-1",kind:"lesson-draft"},{...fixture,id:"pending",pending:true},{...fixture,id:"family",kind:"family-record"},{...fixture,id:"future",expiresAt:999}];
const p=(a=arr,used=100,limit=100)=>planTemporaryCleanup(a,used,limit,20);
const checks=[
["under-threshold",()=>assert.equal(p(arr,79).evictionCandidates.length,0)],
["at-threshold",()=>assert.deepEqual(p(arr,80).evictionCandidates,["preview-1"])],
["not-lesson",()=>assert(!p().evictionCandidates.includes("lesson-1"))],
["not-family",()=>assert(!p().evictionCandidates.includes("family"))],
["not-pending",()=>assert(!p().evictionCandidates.includes("pending"))],
["not-unexpired",()=>assert(!p().evictionCandidates.includes("future"))],
["holds-at-capacity",()=>assert.equal(p().action,"TEMP_WRITES_HOLD")],
["never-deletes",()=>assert.equal(p().automaticDeletionEnabled,false)],
["dedupe",()=>assert.equal(p([fixture,fixture]).evictionCandidates.length,1)],
["no-unknown-kind",()=>assert.equal(p([{...fixture,kind:"transcript"}]).evictionCandidates.length,0)],
["no-unsynced",()=>assert.equal(p([{...fixture,synced:false}]).evictionCandidates.length,0)],
["no-protected",()=>assert.equal(p([{...fixture,protected:true}]).evictionCandidates.length,0)],
["no-authoritative",()=>assert.equal(p([{...fixture,authoritative:true}]).evictionCandidates.length,0)],
["reject-bad-quota",()=>assert.throws(()=>p([],20,0),/INVALID_PLAN_INPUT/)],
["ninety-pressure",()=>assert.equal(p(arr,90).action,"AGGRESSIVE_ELIGIBLE_ONLY")]
];
for(const [name,check] of checks){check();console.log("PASS",name)}
console.log("FAMILY_CLOUD_RETENTION_SYNTHETIC_PASS="+checks.length+" AUTO_DELETE=DISABLED");
