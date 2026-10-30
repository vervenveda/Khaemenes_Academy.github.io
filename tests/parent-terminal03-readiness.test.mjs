import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const expect=(value,message)=>{if(!value)throw new Error(message)};

const parentPath="assets/khaemenes-parent-action-center.js";
const terminalPath="assets/khaemenes-terminal03-readiness.js";
const backupPath="assets/khaemenes-family-backup-vault.js";
const registryPath="assets/khaemenes-family-registry.js";
const manifestPath="shared-integration/terminal-03-academy-readiness.json";

for(const p of [parentPath,terminalPath,backupPath,registryPath,manifestPath,"index.html","family/index.html","student/index.html","adult/index.html","teacher-admin/index.html"]){
  expect(fs.existsSync(path.join(ROOT,p)),"Missing required Academy readiness file: "+p);
}

const parent=read(parentPath);
const terminal=read(terminalPath);
const backup=read(backupPath);
const registry=read(registryPath);
const manifest=JSON.parse(read(manifestPath));

for(const [label,source] of [["Parent Action Center",parent],["Family Backup Vault",backup],["Family Registry",registry],["Terminal 03 adapter",terminal]]){
  try{new Function(source)}catch(error){throw new Error(label+" JavaScript syntax failed: "+error.message)}
}

// Parent Action Center is read-only and privacy bounded.
expect(parent.includes("changesGrades:false"),"Parent Action Center lost grade boundary.");
expect(parent.includes("awardsMastery:false"),"Parent Action Center lost mastery boundary.");
expect(parent.includes("changesPlacement:false"),"Parent Action Center lost placement boundary.");
expect(parent.includes("changesLearnerIdentity:false"),"Parent Action Center lost learner identity boundary.");
expect(parent.includes("privateReflectionsExcluded:true"),"Parent Action Center lost private reflection exclusion.");
expect(parent.includes("childConversationsExcluded:true"),"Parent Action Center lost child conversation exclusion.");
expect(parent.includes("assessmentResponsesExcluded:true"),"Parent Action Center lost assessment-response exclusion.");
expect(parent.includes("answerKeysExcluded:true"),"Parent Action Center lost answer-key exclusion.");
expect(parent.includes('"attention"')||parent.includes('level:"attention"'),"Parent Action Center lost attention categorization.");
expect(parent.includes('"celebrate"')||parent.includes('level:"celebrate"'),"Parent Action Center lost celebration categorization.");
expect(parent.includes("khaemenes-parent-weekly-brief-v1"),"Weekly family brief schema missing.");
expect(parent.includes('level:"refresh"'),"Stale continuation summaries are no longer separated into Refresh needed.");
expect(parent.includes("refreshNeeded"),"Parent Action Center lost refresh-needed counts.");
expect(parent.includes("safeStepHref"),"Parent Action Center lost safe next-step URL validation.");
expect(parent.includes("data-parent-open-step"),"Parent Action Center lost direct next-step actions.");
expect(parent.includes("data-parent-profile"),"Parent Action Center lost learner portal handoff.");
expect(parent.includes('REVIEW_KEY="khaemenes_parent_brief_review_v1"'),"Parent Action Center lost privacy-safe review-history storage.");
expect(parent.includes("function aggregateBrief("),"Parent Action Center lost aggregate-only review snapshots.");
expect(parent.includes("function markReviewed("),"Parent Action Center lost Mark Brief Reviewed.");
expect(parent.includes("reviewHistoryAggregatesOnly:true"),"Parent review history privacy boundary is missing.");
expect(!/categorized\.attention\.push\([\s\S]{0,500}?courseId:"study-support"/.test(parent),"Spaced review must not inflate formal Needs attention.");
expect(!/localStorage\.setItem\([^\n]*(grade|mastery|placement)/i.test(parent),"Parent Action Center must not write grade/mastery/placement state.");
expect(!/REVIEW_KEY[\s\S]{0,1200}?(privateReflections|childConversations|assessmentResponses|answerKeys)/.test(parent),"Parent review history must remain aggregate-only.");


// Family Backup Vault preserves browser-local family identity without claiming course authority.
expect(backup.includes('const SCHEMA="khaemenes-family-backup-v2"'),"Family Backup Vault schema missing.");
expect(backup.includes('algorithm:"SHA-256"'),"Family Backup Vault lost SHA-256 integrity checks.");
expect(backup.includes('khaemenes_family_restore_rollback_v1'),"Family Backup Vault lost pre-restore rollback snapshots.");
expect(backup.includes("verifyEnvelope"),"Family Backup Vault lost integrity verification.");
expect(backup.includes("saveRollback"),"Family Backup Vault lost pre-restore snapshot.");
expect(backup.includes("undoLastRestore"),"Family Backup Vault lost undo-last-restore support.");
expect(backup.includes("restoresCourseGrades:false"),"Family Backup Vault crossed into course-grade authority.");
expect(backup.includes("restoresAssessmentAttempts:false"),"Family Backup Vault crossed into assessment-attempt authority.");
expect(backup.includes("restoresPrivateLearnerReflections:false"),"Family Backup Vault crossed private reflection boundary.");
expect(backup.includes("restoresChildConversations:false"),"Family Backup Vault crossed child conversation boundary.");
expect(backup.includes("restoresAnswerKeys:false"),"Family Backup Vault crossed answer-key boundary.");
expect(registry.includes("function validateFamilyExport("),"Family Registry lost structural backup validation.");
expect(registry.includes("function restoreFamilyExport("),"Family Registry lost family-scoped restore.");
expect(registry.includes('audit("family.restored-from-backup"'),"Family restore audit entry missing.");
expect(registry.includes('const VERSION="1.3.2"'),"Family Registry backup/restore version drifted.");
const familyPage=read("family/index.html");
expect(familyPage.includes("Download Verified Backup"),"Family Portal lost verified backup control.");
expect(familyPage.includes("Verify / Restore Backup"),"Family Portal lost restore control.");
expect(familyPage.includes("Undo Last Restore"),"Family Portal lost rollback control.");
expect(familyPage.includes("khaemenes-family-backup-vault.js"),"Family Portal is not loading Family Backup Vault.");

// Terminal 03 is the primary/exclusive Academy designation and remains non-commissioned and transport-free.
expect(terminal.includes('const LIVE=false'),"Terminal 03 adapter must remain non-live until separately commissioned.");
expect(terminal.includes('const TRANSPORT="unconfigured"'),"Terminal 03 transport must remain unconfigured.");
expect(terminal.includes("commissioned:false"),"Terminal 03 adapter must report commissioned=false.");
expect(terminal.includes("canTransmit:false"),"Terminal 03 adapter unexpectedly allows transmission.");
expect(terminal.includes("canActivate:false"),"Terminal 03 adapter unexpectedly allows activation.");
expect(terminal.includes("networkIO:false"),"Terminal 03 network I/O boundary missing.");
expect(terminal.includes("stosStorageWrites:false"),"Terminal 03 STOS storage-write boundary missing.");
expect(terminal.includes("academyStorageSeparate:true"),"Terminal 03 Academy/STOS storage separation missing.");
expect(terminal.includes("academyTerminalPrimary:true"),"Terminal 03 primary designation missing.");
expect(terminal.includes("academyTerminalExclusive:true"),"Terminal 03 exclusive designation missing.");
expect(terminal.includes("terminal04AcademyAuthority:false"),"Terminal 04 Academy authority must remain false.");
for(const primitive of ["fetch(","WebSocket","EventSource","sendBeacon","XMLHttpRequest"]){
  expect(!terminal.includes(primitive),"Terminal 03 adapter contains network primitive: "+primitive);
}
for(const primitive of ["localStorage.setItem","sessionStorage.setItem"]){
  expect(!terminal.includes(primitive),"Terminal 03 adapter contains storage write: "+primitive);
}
for(const forbidden of ["password","email","privateLearnerReflectionsExcluded:true","childConversationsExcluded:true","assessmentResponsesExcluded:true","answerKeysExcluded:true"]){
  expect(terminal.toLowerCase().includes(forbidden.toLowerCase()),"Terminal 03 privacy contract missing: "+forbidden);
}

// Manifest mirrors code boundaries.
expect(manifest.terminalId==="03","Terminal manifest ID drifted.");
expect(manifest.state==="primary-academy-terminal-readiness-hold","Terminal manifest must remain on primary Academy readiness hold.");
expect(manifest.live===false,"Terminal manifest live flag must be false.");
expect(manifest.academyTerminalPrimary===true,"Terminal 03 must be the primary Academy terminal.");
expect(manifest.academyTerminalExclusive===true,"Terminal 03 must be the exclusive Academy terminal.");
expect(manifest.terminal04AcademyAuthority===false,"Terminal 04 must have no Academy authority.");
expect(manifest.commissioned===false,"Terminal manifest commissioned flag must be false.");
expect(manifest.transport==="unconfigured","Terminal manifest transport must remain unconfigured.");
expect(manifest.academy?.stosStorageSeparate===true,"Terminal manifest lost storage separation.");
expect(manifest.authority?.changesGrades===false,"Terminal manifest lost grade boundary.");
expect(manifest.authority?.changesPlacement===false,"Terminal manifest lost placement boundary.");
expect(Array.isArray(manifest.cutoverGates)&&manifest.cutoverGates.length>=5,"Terminal manifest cutover gates are incomplete.");

// Main account-bearing surfaces carry the dormant readiness adapter.
for(const p of ["index.html","family/index.html","student/index.html","adult/index.html","teacher-admin/index.html"]){
  expect(read(p).includes("khaemenes-terminal03-readiness.js"),p+" is missing Terminal 03 readiness.");
}
expect(read("index.html").includes("khaemenes-parent-action-center.js"),"Academy home is missing parent summary API.");
expect(read("family/index.html").includes("khaemenes-parent-action-center.js"),"Family Portal is missing Parent Action Center.");
expect(read("assets/khaemenes-home-personalization.js").includes("Parent Action Center"),"Personalized home no longer surfaces Parent Action Center.");

// Teacher Admin must use the single canonical ecosystem toolbar and no legacy Beta loader.
const teacher=read("teacher-admin/index.html");
expect((teacher.match(/https:\/\/vervenveda\.com\/assets\/vnv-ecosystem-toolbar\.js/g)||[]).length===1,"Teacher Admin must contain exactly one canonical ecosystem toolbar.");
expect(!/vnv-beta-link\.js/i.test(teacher),"Teacher Admin still contains the retired standalone Beta loader.");
expect(!/id="vnvBetaProgramFallback"/i.test(teacher),"Teacher Admin still contains a legacy Beta fallback.");

console.log("Academy Parent + Terminal 03 readiness regression: PASS");
console.log("  Parent Action Center: read-only");
console.log("  Weekly Family Brief: privacy-safe");
console.log("  Family Backup Vault: SHA-256 verified + rollback-safe");
console.log("  Terminal 03: primary + exclusive Academy designation / HOLD / uncommissioned / no transport");
console.log("  Terminal 04: no Academy authority");
console.log("  Academy account storage and STOS storage: separate");
console.log("  Main account-bearing surfaces covered: 5");
console.log("  Teacher Admin utility surface: canonical ecosystem toolbar");
