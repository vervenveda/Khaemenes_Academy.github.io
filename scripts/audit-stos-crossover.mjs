import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const fail=msg=>{throw new Error(msg)};
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");

for(const p of [
  "STOS-CROSSOVER.json",
  "STOS-CROSSOVER.md",
  "shared-integration/academy-repository-topology.json",
  "shared-integration/crossover-dependencies.json",
  "assets/README.md",
  "assets/khaemenes-terminal03-readiness.js",
  "shared-integration/terminal-03-academy-readiness.json"
]){
  if(!fs.existsSync(path.join(ROOT,p)))fail("Missing crossover file: "+p);
}

const crossover=JSON.parse(read("STOS-CROSSOVER.json"));
const topology=JSON.parse(read("shared-integration/academy-repository-topology.json"));
const deps=JSON.parse(read("shared-integration/crossover-dependencies.json"));
const t03=JSON.parse(read("shared-integration/terminal-03-academy-readiness.json"));

if(crossover.stosTarget.repositoryId!=="repo_khaemenes_academy_mthbvndg")fail("STOS repository identity drift");
if(crossover.stosTarget.terminalId!=="03")fail("Academy terminal must be 03");
if(crossover.stosTarget.terminal04AcademyAuthority!==false)fail("Terminal04 must have no Academy authority");
if(topology.terminal?.primary!=="03"||topology.terminal?.exclusive!==true)fail("Topology must designate Terminal03 exclusively");
if(topology.terminal?.terminal04AcademyAuthority!==false)fail("Topology grants Terminal04 Academy authority");
if(t03.terminalId!=="03"||t03.academyTerminalPrimary!==true||t03.academyTerminalExclusive!==true)fail("Terminal03 readiness contract drift");
if(t03.terminal04AcademyAuthority!==false)fail("Terminal04 Academy authority drift");
if(!Array.isArray(deps.forbiddenInMigrationAuthority)||deps.forbiddenInMigrationAuthority.length<5)fail("Dependency inventory incomplete");

const files=[];
function walk(dir){
  for(const name of fs.readdirSync(dir)){
    if(name===".git")continue;
    const p=path.join(dir,name);
    const st=fs.lstatSync(p);
    const rel=path.relative(ROOT,p).split(path.sep).join("/");
    if(st.isSymbolicLink())fail("Symlink forbidden in crossover tree: "+rel);
    if(st.isDirectory())walk(p);
    else if(st.isFile())files.push(rel);
  }
}
walk(ROOT);

const textFiles=files.filter(p=>/\.(?:html?|js|mjs|cjs|json|md|css|yml|yaml|py|txt)$/i.test(p));
for(const rel of textFiles){
  const s=read(rel);
  if(/\/Users\/[A-Za-z0-9._-]+\//.test(s))fail("User-specific absolute path in "+rel);
}

/* Governance documents may state that Terminal04 has no Academy authority.
   What is forbidden is the retired Academy T04 readiness implementation/path. */
for(const rel of files){
  if(/(?:^|\/)khaemenes-terminal04-readiness\.js$/i.test(rel))fail("Retired Academy Terminal04 adapter present: "+rel);
  if(/(?:^|\/)terminal-04-academy-readiness\.json$/i.test(rel))fail("Retired Academy Terminal04 manifest present: "+rel);
}
for(const rel of files.filter(p=>/\.(?:html?|js|mjs|cjs)$/i.test(p))){
  const s=read(rel);
  if(/khaemenes-terminal04-readiness\.js/i.test(s))fail("Retired Academy Terminal04 runtime reference in "+rel);
  if(/terminal-04-academy-readiness\.json/i.test(s))fail("Retired Academy Terminal04 manifest reference in "+rel);
}

for(const surface of Object.values(topology.surfaces)){
  if(!fs.existsSync(path.join(ROOT,surface)))fail("Topology surface missing: "+surface);
}

console.log("Khaemenes Academy STOS crossover validation: PASS");
console.log("  files:",files.length);
console.log("  STOS repo:",crossover.stosTarget.repositoryId);
console.log("  Academy terminal: T03 primary/exclusive");
console.log("  T04 Academy authority: false");
console.log("  symlinks: none");
console.log("  user-specific absolute paths: none");
