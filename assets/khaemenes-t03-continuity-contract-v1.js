/* Khaemenes Academy · T03 continuity contract v1
 * Pure, offline-safe planning contract. No browser storage, network, uploads, imports,
 * authorization decisions, or runtime activation. Never treats browser-local progress
 * as confirmed academic mastery. A future authenticated authority must validate all
 * records, provenance, and durable transaction receipts before promotion.
 */
(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.KhaemenesT03ContinuityContract=api})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const SCHEMA="khaemenes.account-continuity.intent.v1",TERMINAL="03";
const ALLOWED_TYPES=new Set(["learner-profile","family-link","course-enrollment","course-progress","schedule-selection","course-evidence","portfolio-item","daily-report"]);
const MAX_RECORDS=2000,MAX_ID=160,MAX_COURSE=140;
function id(value,max=MAX_ID){return typeof value==="string"&&value.trim()===value&&value.length>0&&value.length<=max&&!/[\u0000-\u001f\u007f]/.test(value)?value:null}
function freeze(obj){return Object.freeze(obj)}
function validateRecord(record,context){
 if(!record||typeof record!=="object"||Array.isArray(record))throw Error("Invalid record descriptor");
 const type=record.type;
 if(!ALLOWED_TYPES.has(type))throw Error("Unsupported academic record type");
 const sourceOrigin=id(record.sourceOrigin,255);
 if(!sourceOrigin||!/^https:\/\/[a-z0-9.-]+(?::[0-9]+)?$/i.test(sourceOrigin))throw Error("Explicit HTTPS source origin required");
 const sourceKey=id(record.sourceKey,240),courseId=record.courseId===null||record.courseId===undefined?null:id(record.courseId,MAX_COURSE);
 if(!sourceKey)throw Error("Source key required");
 if(record.courseId!==null&&record.courseId!==undefined&&!courseId)throw Error("Invalid course ID");
 if(!id(record.learnerId)||record.learnerId!==context.learnerId)throw Error("Cross-learner or missing learner identity");
 if(record.familyId!==context.familyId)throw Error("Cross-family record");
 const revision=record.revision===undefined?null:id(record.revision,120);
 if(record.revision!==undefined&&!revision)throw Error("Invalid source revision");
 if(record.provenance!=="browser-local-unverified"&&record.provenance!=="authenticated-source-verified")throw Error("Explicit source provenance required");
 if(record.provenance==="authenticated-source-verified")throw Error("Authenticated evidence cannot be asserted by browser planning code");
 return freeze({type,sourceOrigin,sourceKey,courseId,learnerId:context.learnerId,
   familyId:context.familyId,revision,provenance:"browser-local-unverified",
   disposition:"preserve-pending-authenticated-review",officialMastery:false});
}
function plan(input){
 if(!input||typeof input!=="object"||Array.isArray(input))throw Error("Invalid continuity input");
 const familyId=id(input.familyId),learnerId=id(input.learnerId);
 if(!familyId||!learnerId)throw Error("Stable family and learner IDs required");
 if(!Array.isArray(input.records)||input.records.length>MAX_RECORDS)throw Error("Invalid or oversized source manifest");
 const ctx={familyId,learnerId},seen=new Set();
 const records=input.records.map(x=>{
  const record=validateRecord(x,ctx),identity=JSON.stringify([record.type,record.sourceOrigin,record.sourceKey]);
  if(seen.has(identity))throw Error("Duplicate source identity requires conflict review");
  seen.add(identity);return record;
 });
 return freeze({schema:SCHEMA,terminalId:TERMINAL,mode:"PREPARE_ONLY",version:1,
  familyId,learnerId,records:freeze(records),sourceRecordCount:records.length,
  transportConfigured:false,sessionAuthenticated:false,ownershipVerified:false,
  canUpload:false,canImport:false,canClaimBackupComplete:false,
  synchronization:"not-active",transactionReceipt:null,
  requiredGates:freeze(["authenticated-family-learner-session","learner-consent-and-authorization",
   "complete-source-inventory","verified-record-provenance","idempotent-mutation-id",
   "durable-atomic-record-audit-receipt","conflict-safe-merge","independent-second-device-restore"]),
  warning:"This is a data-free preservation intent, not a backup or synchronized academic record."});
}
function receiptGate(receipt,expected){
 // Future compatibility check for durable receipts; this never authorizes writes.
 if(!receipt||!expected||typeof receipt!=="object"||typeof expected!=="object")return freeze({accepted:false,reason:"missing-receipt"});
 if(receipt.terminalId!==TERMINAL||receipt.familyId!==expected.familyId||receipt.learnerId!==expected.learnerId)return freeze({accepted:false,reason:"identity-or-terminal-mismatch"});
 if(!id(receipt.mutationId)||!id(receipt.recordDigest)||!id(receipt.auditDigest)||receipt.atomicCommit!==true||
    receipt.durable!==true||receipt.serverAuthenticated!==true)
   return freeze({accepted:false,reason:"incomplete-durable-transaction-evidence"});
 return freeze({accepted:false,reason:"receipt-structure-only-requires-server-verification"});
}
return freeze({version:"1.0",schema:SCHEMA,terminalId:TERMINAL,plan,receiptGate,allowedTypes:freeze([...ALLOWED_TYPES])});
});
