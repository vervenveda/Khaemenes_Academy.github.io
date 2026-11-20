/* Parent Profile topology & five-bubble regression. Read-only synthetic fixtures. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const page=read("family/profile/index.html");
const portal=read("family/index.html");
const panels=read("assets/khaemenes-family-parent-learning-panels-v1.js");
const dialog=read("assets/khaemenes-family-learner-dialog-v1.js");
const hero=read("assets/khaemenes-family-parent-profile-hero.js");
const profileCss=read("assets/khaemenes-parent-profile-page.css");
const baseCss=read("assets/vnv-ka-parent-canonical-v1.css");
const gradeModule=read("family/progress/parent-progress.js");
const tools=read("assets/khaemenes-parent-profile-universal-tools.js");
for(const [name,code] of [["panels",panels],["dialog",dialog],["hero",hero],["progress",gradeModule],["tool config",tools]])
 new vm.Script(code,{filename:name});
const match=(code,token,why)=>assert.ok(code.includes(token),why);
match(panels,'scope="progress.view"',"permission helper takes independent scopes");
match(panels,'permission(f,l,"learner.view")',"learner cards guarded");
match(panels,'permission(f,l,"education.manage")',"placement changes require management permission");
match(panels,'permission(R.getFamily?.(),learner,"learner.view")',"click handlers recheck current family permission");
match(panels,'R.canAdult?.(adult.adultId,learner.learnerId,scope)===true',"registry remains permission authority");
match(dialog,'learnerView:member&&registry.canAdult?.(adult.adultId,id,"learner.view")===true',"dialog checks learner.view");
match(dialog,'if(!curr.learnerView)',"dialog rechecks permission before navigating");
match(dialog,'"progress.view"',"course score permission preserved");
assert.equal((page.match(/<style(?:\\s|>)/g)||[]).length,0,"Parent Profile has no inline presentation layers");
match(page,'khaemenes-parent-profile-page.css',"single parent-profile presentation stylesheet");
match(page,'vnv-ka-parent-canonical-v1.css',"shared parent canonical base preserved");
match(hero,'function styleOnce(){return}',"hero does not inject competing presentation styles");
assert.equal((profileCss.match(/#khaeFamilyParentProfileHero/g)||[]).length>5,true,"existing hero styling retained in local stylesheet");
assert.ok(profileCss.length>10000&&baseCss.length>10000,"shared and local styles intact");
const navStart=page.indexOf('<nav class="mainnav"');
const nav=navStart<0?"":page.slice(navStart,page.indexOf("</nav>",navStart)+6);
assert.equal((nav.match(/<a /g)||[]).length,1,"single breadcrumb; actions remain in 2x4 profile toolbar");
const features=[...hero.matchAll(/^ \["([^"]+)", "(?:[^"]+)"\],?$/gm)].map(x=>x[1]);
assert.deepEqual(features,["Edit Display Name","Schedules & Progress","Family Records","Manage Learners","Daily Family Reports","My Student Profiles","Customize Background","Customize Picture"],"exactly 8 profile tools");
for(const id of ["family-records-controls","family-adult-access","family-account-readiness"])match(portal,'id="'+id+'"',"parent portal anchor "+id);
match(panels,'String(l.stage)!=="high"||Number(l.grade)!==9',"only verified Grade 9 daily-report schema read");
match(panels,'Daily family reporting for this grade is not yet connected',"unsupported grades explicitly unreported");
match(panels,'href="../progress/"',"embedded progress leads to comprehensive parent grades");
assert.ok(!panels.includes("snaps.slice(0,8)"),"no arbitrary eight-source report truncation");
match(gradeModule,"function subjectGroups(grade)","Grade 9–12 use eight course positions");
match(gradeModule,'return "midterms"',"explicit midterm bucket");
match(gradeModule,'return "finals"',"explicit final bucket");
match(gradeModule,'No course report received',"missing grades not invented");
for(const file of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-language.js","vnv-ecosystem-toolbar.js","vnv-class-tools-toolbar.js"])
 assert.equal(page.split(file).length-1,1,"one official VNV loader "+file);
match(page,'khaemenes-parent-profile-universal-tools.js',"canonical toolbar config loaded");
match(tools,'id:"ka-parent-profile"',"one isolated parent profile toolbar config");
match(tools,'label:"Language"',"translator in lower-left toolbar");
match(tools,'vnv-language-switch',"canonical translator selector reused");
assert.ok(!page.includes('actions:[{label:"HOME"'),"header hamburger-only, no second navigation menu");
const nodes={parentProgressStatus:{textContent:""},parentProgressWorkspace:{hidden:false},parentProgressLearners:{replaceChildren(){}},parentProgressDetail:{replaceChildren(){}}};
const sandbox={window:{KhaemenesFamilyRegistry:{getFamily:()=>null,getAdult:()=>null},KhaemenesLearningContinuation:{},addEventListener(){}},
 document:{getElementById:id=>nodes[id],createElement:()=>({append(){},textContent:""})},console,Date};
const exposed=gradeModule.replace(/render\(\);\s*\}\)\(\);\s*$/,'window.__check={subjectGroups,readGrades};render();})();');
assert.notEqual(exposed,gradeModule,"ability to inspect Grade 9–12 grouping without modifying production sources");
vm.runInNewContext(exposed,sandbox);
for(const grade of ["09","10","11","12"])assert.equal(sandbox.window.__check.subjectGroups(grade).length,8,"8-course model for Grade "+grade);
const grades=sandbox.window.__check.readGrades({assessments:[
 {id:"quiz-1",kind:"quiz",title:"Quiz 1",earned:8,possible:10},
 {id:"midterm",kind:"test",title:"Midterm",earned:45,possible:50},
 {id:"final",kind:"test",title:"Final Exam",earned:90,possible:100}
]});
assert.equal(grades.quizzes.count,1,"one quiz");
assert.equal(grades.midterms.count,1,"midterm isolated");
assert.equal(grades.finals.count,1,"final isolated");
assert.equal(grades.tests.count,0,"no accidental additional tests");
assert.equal(grades.overall.percent,89.4,"weighted total earned/possible points");
console.log("PARENT PROFILE FIVE BUBBLES: PASS (permissions, single CSS owner, 8-course grades, Grade 9 daily provenance, VNV universal toolbar).");
