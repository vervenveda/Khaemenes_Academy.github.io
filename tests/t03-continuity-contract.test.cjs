"use strict";
/* Synthetic records only. Run: node --test tests/t03-continuity-contract.test.cjs */
const test=require("node:test"),assert=require("node:assert/strict");
const contract=require("../assets/khaemenes-t03-continuity-contract-v1.js");
const base={familyId:"family-demo",learnerId:"learner-demo",records:[
 {type:"course-progress",familyId:"family-demo",learnerId:"learner-demo",
  sourceOrigin:"https://vervenveda.com",sourceKey:"demo-course-progress:learner:learner-demo",
  courseId:"english-9",revision:"rev-001",provenance:"browser-local-unverified"}
]};
test("creates a bounded, data-free preservation intent without uploading",()=>{
 const out=contract.plan(base);
 assert.equal(out.schema,"khaemenes.account-continuity.intent.v1");
 assert.equal(out.terminalId,"03");
 assert.equal(out.sourceRecordCount,1);
 assert.equal(out.canUpload,false);
 assert.equal(out.canImport,false);
 assert.equal(out.ownershipVerified,false);
 assert.equal(out.synchronization,"not-active");
 assert.equal(out.records[0].officialMastery,false);
 assert.equal(out.records[0].disposition,"preserve-pending-authenticated-review");
 assert.ok(!JSON.stringify(out).includes("courseAnswer"));
});
test("rejects mixed-family or mixed-learner records",()=>{
 assert.throws(()=>contract.plan({...base,records:[{...base.records[0],learnerId:"sibling-demo"}]}),/Cross-learner/);
 assert.throws(()=>contract.plan({...base,records:[{...base.records[0],familyId:"other-family"}]}),/Cross-family/);
});
test("rejects duplicate keys in the same record authority",()=>{
 assert.throws(()=>contract.plan({...base,records:[base.records[0],{...base.records[0]}]}),/Duplicate source identity/);
});
test("rejects insecure origins or fake authenticated evidence",()=>{
 assert.throws(()=>contract.plan({...base,records:[{...base.records[0],sourceOrigin:"http://vervenveda.com"}]}),/HTTPS/);
 assert.throws(()=>contract.plan({...base,records:[{...base.records[0],provenance:"authenticated-source-verified"}]}),/cannot be asserted/);
});
test("incomplete receipt never establishes durable synchronization",()=>{
 const r=contract.receiptGate({terminalId:"03",familyId:"family-demo",learnerId:"learner-demo",mutationId:"m1"},base);
 assert.equal(r.accepted,false);
 assert.equal(r.reason,"incomplete-durable-transaction-evidence");
});
test("even a plausible receipt requires independent server verification",()=>{
 const receipt={terminalId:"03",familyId:"family-demo",learnerId:"learner-demo",mutationId:"m1",
 recordDigest:"sha256-example",auditDigest:"sha256-example2",atomicCommit:true,durable:true,serverAuthenticated:true};
 const result=contract.receiptGate(receipt,base);
 assert.equal(result.accepted,false);
 assert.equal(result.reason,"receipt-structure-only-requires-server-verification");
});
test("source module performs no storage or network operations",()=>{
 const fs=require("node:fs"),path=require("node:path");
 const source=fs.readFileSync(path.join(__dirname,"../assets/khaemenes-t03-continuity-contract-v1.js"),"utf8");
 assert.ok(!/\b(localStorage|sessionStorage|fetch|XMLHttpRequest|WebSocket|sendBeacon)\b/.test(source));
 assert.ok(!/\.setItem\(|\.removeItem\(/.test(source));
});
