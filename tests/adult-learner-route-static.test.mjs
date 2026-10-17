import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const index=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const family=fs.readFileSync(new URL("../family/index.html",import.meta.url),"utf8");
const enroll=fs.readFileSync(new URL("../family/enroll/index.html",import.meta.url),"utf8");
const adultPortal=fs.readFileSync(new URL("../adult/index.html",import.meta.url),"utf8");
const adultEnroll=fs.readFileSync(new URL("../adult/enroll/index.html",import.meta.url),"utf8");
const registry=fs.readFileSync(new URL("../assets/khaemenes-family-registry.js",import.meta.url),"utf8");
const student=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");

test("Academy front desk exposes a first-class adult learner doorway",()=>{
  assert.match(index,/href="\.\/adult\/"[^>]*>Adult Scholar<\/a>/);
  assert.match(index,/Adult Scholar Entry/);
  assert.match(index,/<h3>Adult Scholar<\/h3>/);
});

test("family workspace keeps parent and adult-self-learning roles separate",()=>{
  assert.match(family,/I Am an Adult Learning for Myself/);
  assert.match(family,/Start Adult Learning/);
  assert.match(family,/Open Adult Learner Portal/);
  assert.match(family,/familyLearners=f\.learners\.filter\(l=>l&&!l\.selfDirectedAdult\)/);
});

test("family enrollment routes adult scholars through the Adult Learner Portal",()=>{
  assert.match(enroll,/Create My Adult Learner Path/);
  assert.match(enroll,/Open Adult Learner Portal/);
  assert.match(enroll,/location\.href="\.\.\/\.\.\/adult\//);
  assert.match(enroll,/Adults who are studying for themselves enter through Khaemenes Higher Learning rather than receiving a K–12 grade/);
});

test("adult enrollment creates a linked self-directed scholar identity then returns to the adult portal",()=>{
  assert.match(adultEnroll,/registerAdultLearner/);
  assert.match(adultEnroll,/Open Adult Learner Portal/);
  assert.match(adultEnroll,/location\.href='\.\.\/'/);
  assert.match(adultEnroll,/provisional Scholar ID/i);
});

test("Adult Learner Portal exposes study pathways without a K-12 grade assignment",()=>{
  assert.match(adultPortal,/Adult Learner Portal/);
  assert.match(adultPortal,/No artificial grade label/);
  assert.match(adultPortal,/Khaemenes_Higher_Learning\.github\.io\/start\//);
  assert.match(adultPortal,/Khaemenes_Linguistics\.github\.io\//);
  assert.match(adultPortal,/Switch to Parent \/ Family Role/);
});

test("family registry keeps adult learning separate from K-12 placement",()=>{
  assert.match(registry,/function registerAdultLearner/);
  assert.match(registry,/stage:"higher",grade:null,ageBand:"adult"/);
  assert.match(registry,/selfDirectedAdult:true/);
  assert.match(registry,/permissionPreset:"self-scholar"/);
});

test("K-12 Student Portal excludes and redirects self-directed adult scholar records",()=>{
  assert.match(student,/filter\(l=>l&&!l\.selfDirectedAdult\)/);
  assert.match(student,/learner\?\.selfDirectedAdult===true/);
  assert.match(student,/location\.replace\("\.\.\/adult\/"\)/);
});

test("Higher Learning remains the academic campus behind the adult portal",()=>{
  assert.match(adultPortal,/Khaemenes_Higher_Learning\.github\.io\/start\//);
  assert.match(registry,/Khaemenes_Higher_Learning\.github\.io\/start\//);
  assert.ok(!family.includes('href="https://vervenveda.com/Khaemenes_Higher_Learning.github.io/">Browse Higher Learning</a>'));
});
