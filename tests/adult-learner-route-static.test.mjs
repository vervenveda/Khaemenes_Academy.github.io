import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const index=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const family=fs.readFileSync(new URL("../family/index.html",import.meta.url),"utf8");
const enroll=fs.readFileSync(new URL("../family/enroll/index.html",import.meta.url),"utf8");
const adult=fs.readFileSync(new URL("../adult/enroll/index.html",import.meta.url),"utf8");
const registry=fs.readFileSync(new URL("../assets/khaemenes-family-registry.js",import.meta.url),"utf8");
const student=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");

test("Academy front desk exposes a first-class adult scholar doorway",()=>{
  assert.match(index,/href="\.\/adult\/enroll\/"[^>]*>Adult Scholar<\/a>/);
  assert.match(index,/Adult Scholar Entry/);
  assert.match(index,/<h3>Adult Scholar<\/h3>/);
});

test("family account setup does not force adults through K-12 enrollment",()=>{
  assert.match(family,/I Am an Adult Learning for Myself/);
  assert.match(family,/Start Adult Learning/);
  assert.match(enroll,/Start My Higher Learning Path/);
  assert.match(enroll,/Adults who are studying for themselves enter through Khaemenes Higher Learning rather than receiving a K–12 grade/);
});

test("adult enrollment creates a linked self-directed scholar identity",()=>{
  assert.match(adult,/registerAdultLearner/);
  assert.match(adult,/Continue to Higher Learning/);
  assert.match(adult,/Khaemenes_Higher_Learning\.github\.io\/start\//);
  assert.match(adult,/provisional Scholar ID/i);
});

test("family registry keeps adult learning separate from K-12 placement",()=>{
  assert.match(registry,/function registerAdultLearner/);
  assert.match(registry,/stage:"higher",grade:null,ageBand:"adult"/);
  assert.match(registry,/selfDirectedAdult:true/);
  assert.match(registry,/permissionPreset:"self-scholar"/);
});

test("K-12 Student Portal intentionally excludes self-directed adult scholar records",()=>{
  assert.match(student,/filter\(l=>l&&!l\.selfDirectedAdult\)/);
});
