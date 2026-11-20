// VNV Family Storage OS Phase 1 — browser-compatible, pure, read-only planner.
// NOT a storage backend. No deletion or network operations.
const DISPOSABLE=new Set(["render-cache","thumbnail-cache","resource-preview","completed-transfer-buffer"]);
function planTemporaryCleanup(entries,usageBytes,quotaBytes,nowMs){
 if(!Array.isArray(entries)||!Number.isSafeInteger(usageBytes)||usageBytes<0||!Number.isSafeInteger(quotaBytes)||quotaBytes<=0||!Number.isSafeInteger(nowMs)||nowMs<0)throw Error("INVALID_PLAN_INPUT");
 const pressure=usageBytes/quotaBytes;
 const target=pressure>=.8?Math.floor(quotaBytes*.7):usageBytes;
 const eligible=entries.filter(e=>e&&typeof e==="object"&&typeof e.id==="string"&&e.id.length>0&&DISPOSABLE.has(e.kind)&&e.disposable===true&&e.reconstructible===true&&e.authoritative===false&&e.pending===false&&e.protected!==true&&e.synced===true&&Number.isSafeInteger(e.bytes)&&e.bytes>=0&&Number.isSafeInteger(e.expiresAt)&&e.expiresAt<=nowMs);
 const seen=new Set();const unique=eligible.filter(e=>{if(seen.has(e.id))return false;seen.add(e.id);return true});
 unique.sort((a,b)=>a.expiresAt-b.expiresAt||a.id.localeCompare(b.id));
 let remaining=usageBytes;const ids=[];
 for(const e of unique){if(remaining<=target)break;ids.push(e.id);remaining=Math.max(0,remaining-e.bytes)}
 return Object.freeze({mode:"DRY_RUN_ONLY",pressurePercent:Math.round(pressure*100),action:pressure>=1?"TEMP_WRITES_HOLD":pressure>=.9?"AGGRESSIVE_ELIGIBLE_ONLY":pressure>=.8?"ELIGIBLE_ONLY":"NONE",evictionCandidates:Object.freeze(ids),projectedUsageBytes:remaining,automaticDeletionEnabled:false});
}
export {planTemporaryCleanup};
