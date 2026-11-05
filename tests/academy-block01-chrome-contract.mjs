/* Block 01 canonical chrome contract: source-only, no learner data. */
import assert from "node:assert/strict";
import fs from "node:fs";
const files=[
  "Health_learning/Health_is_wealth_6weeks_index.html",
  "Health_learning/Trivia_Health_index.html",
  "Health_learning/wellness_workshop_index.html",
  "Health_learning/workout_builder_index.html",
  "Parent_resources/Art_studio_index.html",
  "Parent_resources/Diploma_generator_index.html",
  "Parent_resources/Family_photo_album_index.html",
  "Parent_resources/Homeschool_compass_index.html",
  "Parent_resources/Transcript_generator_index.html",
  "adult/enroll/index.html"
];
const supportPages=new Set([
  "Health_learning/wellness_workshop_index.html",
  "Health_learning/workout_builder_index.html",
  "Parent_resources/Diploma_generator_index.html",
  "Parent_resources/Homeschool_compass_index.html",
  "Parent_resources/Transcript_generator_index.html",
  "adult/enroll/index.html"
]);
for(const path of files){
 const html=fs.readFileSync(path,"utf8");
 const count=needle=>html.split(needle).length-1;
 for(const asset of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-ecosystem-toolbar.js"]){
  assert.equal(count('src="https://vervenveda.com/assets/'+asset+'"'),1,path+": missing or duplicate "+asset);
 }
 assert.equal(count("VNV_HEADER.mount("),1,path+": duplicate canonical header mount");
 assert.equal(count("VNV_TICKER.autoPopulate("),1,path+": duplicate AutoPopulate initialization");
 if(supportPages.has(path)){
  assert.match(html,/<script[^>]+src="https:\/\/vervenveda\.com\/assets\/vnv-header-autopopulate\.js"[^>]+data-vnv-ecosystem-menu="canonical-header-owner"/,path+": support must see shared menu owner");
  assert.match(html,/src="https:\/\/vervenveda\.com\/assets\/vnv-support\.js"/,path+": preserve voluntary support functionality");
 }
}
const transcript=fs.readFileSync("Parent_resources/Transcript_generator_index.html","utf8");
assert.match(transcript,/label:"Transcript Generator Quick Links",max:14,links:\[/,"Transcript ticker needs reliable real links");
assert.doesNotMatch(transcript,/href:"\.section"/);
console.log("PASS Block 01 chrome source contract: 10 pages, 6 support/menu handoffs, transcript quick links");
