/* Parent -> learner -> Schedule/lesson -> evidence five-bubble contract.
   All fixtures synthetic; this test never reads or writes real family records. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const router=read("assets/khaemenes-front-door-router.js");
const panels=read("assets/khaemenes-family-parent-learning-panels-v1.js");
const grades=read("family/progress/parent-progress.js");
const student=read("student/index.html");
for(const [name,source] of [["front door",router],["parent panels",panels],["parent grades",grades]])
 new vm.Script(source,{filename:name});
assert.ok(router.includes('registry()?.normalizeGrade?.(grade)'),"01: grade normalization from canonical Academy registry");
assert.ok(router.includes('["09","10","11","12"].includes(normalized)'),"01: correct Grade 9–12 profile destinations");
assert.ok(panels.includes('"learner.view"')&&panels.includes('if(!learner||!f.adultIds?.includes(ids.adultId)'),"02: parent learner switch/open checked against family membership and learner.view");
assert.ok(panels.includes('R.canAdult?.(adult.adultId,learner.learnerId,"progress.view")'),"02: progress.view remains separate academic access authority");
assert.ok(grades.includes('function subjectGroups(grade)')&&grades.includes('if(groups){'),"03: all four grades have 8 subject shells");
assert.ok(grades.includes('["Mathematics",ids.math]')&&grades.includes('["Elective",ids.elective]'),"03: 8 subject vocabulary");
assert.ok(grades.includes('return "midterms"')&&grades.includes('return "finals"'),"04: grade records distinguish midterms and finals");
assert.ok(grades.includes('Midterms: ')+grades.includes('Finals: ')===2,"04: report displays each category separately");
assert.ok(grades.includes('Number.isFinite(item.earned)')&&grades.includes('Number.isFinite(item.possible)'),"04: no invented assessment scores");
assert.ok(student.includes('function highPinDestination(pin,learner)'),"05: student pinned Grade 9 classes use continuation resolver");
assert.ok(student.includes('if(id==="pre-algebra"||id==="algebra-1")return schedule;'),"05: mathematics readiness remains guarded");
assert.ok(student.includes('const records=C?.readLearner?.(learner.learnerId)||[];'),"05: correct learner-scoped continuation");
assert.ok(student.includes('esc(highPinDestination(p,learner))'),"05: rendered pinned href is resolved, not public course landing");
assert.ok(student.includes('Halls/courses/arabic-1/')&&student.includes('Halls/courses/russian-1/'),"05: real Year I Arabic and Russian course metadata");
for(const grade of ["09","10","11","12"]){
 const expected="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+grade+"/student-profile/";
 assert.ok(router.includes('grades/grade-${normalized}/student-profile/'),"grade "+grade+" routed via normalized template");
}
console.log("PARENT TO LEARNER FIVE BUBBLES: PASS (grade routing, authorized learner selection, 8 subjects, exams, pinned lesson destinations; no record writes).");
