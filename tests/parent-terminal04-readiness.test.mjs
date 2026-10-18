import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const expect=(value,message)=>{if(!value)throw new Error(message)};

const parentPath="assets/khaemenes-parent-action-center.js";
const terminalPath="assets/khaemenes-terminal04-readiness.js";
const manifestPath="shared-integration/terminal-04-academy-readiness.json";

for(const p of [parentPath,terminalPath,manifestPath,"index.html","family/index.html","student/index.html","adult/index.html","teacher-admin/index.html"]){
  expect(fs.existsSync(path.join(ROOT,p)),"Missing required Academy readiness file: "+p);
}

const parent=read(parentPath);
const terminal=read(terminalPath);
const manifest=JSON.parse(read(manifestPath));

for(const [label,source] of [["Parent Action Center",parent],["Terminal 04 adapter",terminal]]){
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
expect(!/localStorage\.setItem\([^\n]*(grade|mastery|placement)/i.test(parent),"Parent Action Center must not write grade/mastery/placement state.");

// Terminal 04 remains dormant and transport-free.
expect(terminal.includes('const LIVE=false'),"Terminal 04 adapter is not explicitly dormant.");
expect(terminal.includes('const TRANSPORT="unconfigured"'),"Terminal 04 transport must remain unconfigured.");
expect(terminal.includes("commissioned:false"),"Terminal 04 adapter must report commissioned=false.");
expect(terminal.includes("canTransmit:false"),"Terminal 04 adapter unexpectedly allows transmission.");
expect(terminal.includes("canActivate:false"),"Terminal 04 adapter unexpectedly allows activation.");
expect(terminal.includes("networkIO:false"),"Terminal 04 network I/O boundary missing.");
expect(terminal.includes("stosStorageWrites:false"),"Terminal 04 STOS storage-write boundary missing.");
expect(terminal.includes("academyStorageSeparate:true"),"Terminal 04 Academy/STOS storage separation missing.");
for(const primitive of ["fetch(","WebSocket","EventSource","sendBeacon","XMLHttpRequest"]){
  expect(!terminal.includes(primitive),"Terminal 04 adapter contains network primitive: "+primitive);
}
for(const primitive of ["localStorage.setItem","sessionStorage.setItem"]){
  expect(!terminal.includes(primitive),"Terminal 04 adapter contains storage write: "+primitive);
}
for(const forbidden of ["password","email","privateLearnerReflectionsExcluded:true","childConversationsExcluded:true","assessmentResponsesExcluded:true","answerKeysExcluded:true"]){
  expect(terminal.toLowerCase().includes(forbidden.toLowerCase()),"Terminal 04 privacy contract missing: "+forbidden);
}

// Manifest mirrors code boundaries.
expect(manifest.terminalId==="04","Terminal manifest ID drifted.");
expect(manifest.state==="dormant-readiness","Terminal manifest must remain dormant-readiness.");
expect(manifest.live===false,"Terminal manifest live flag must be false.");
expect(manifest.commissioned===false,"Terminal manifest commissioned flag must be false.");
expect(manifest.transport==="unconfigured","Terminal manifest transport must remain unconfigured.");
expect(manifest.academy?.stosStorageSeparate===true,"Terminal manifest lost storage separation.");
expect(manifest.authority?.changesGrades===false,"Terminal manifest lost grade boundary.");
expect(manifest.authority?.changesPlacement===false,"Terminal manifest lost placement boundary.");
expect(Array.isArray(manifest.cutoverGates)&&manifest.cutoverGates.length>=5,"Terminal manifest cutover gates are incomplete.");

// Main account-bearing surfaces carry the dormant readiness adapter.
for(const p of ["index.html","family/index.html","student/index.html","adult/index.html","teacher-admin/index.html"]){
  expect(read(p).includes("khaemenes-terminal04-readiness.js"),p+" is missing Terminal 04 readiness.");
}
expect(read("index.html").includes("khaemenes-parent-action-center.js"),"Academy home is missing parent summary API.");
expect(read("family/index.html").includes("khaemenes-parent-action-center.js"),"Family Portal is missing Parent Action Center.");
expect(read("assets/khaemenes-home-personalization.js").includes("Parent Action Center"),"Personalized home no longer surfaces Parent Action Center.");

// Teacher Admin must keep exactly one canonical Beta fallback and no legacy fixed duplicates.
const teacher=read("teacher-admin/index.html");
expect((teacher.match(/id="vnvBetaProgramFallback"/g)||[]).length===1,"Teacher Admin must contain exactly one canonical Beta fallback.");
expect((teacher.match(/href="https:\/\/vervenveda\.com\/beta\/" aria-label="Open the Verve N Veda Beta Program" style="position:fixed;/g)||[]).length===0,"Teacher Admin still contains legacy duplicate fixed Beta controls.");

console.log("Academy Parent + Terminal 04 readiness regression: PASS");
console.log("  Parent Action Center: read-only");
console.log("  Weekly Family Brief: privacy-safe");
console.log("  Terminal 04: dormant / uncommissioned / no transport");
console.log("  Academy account storage and STOS storage: separate");
console.log("  Main account-bearing surfaces covered: 5");
console.log("  Teacher Admin Beta fallback: canonical single doorway");
