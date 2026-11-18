import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const ui = fs.readFileSync(new URL("../assets/khaemenes-student-profile-ui-v2.js", import.meta.url), "utf8");
const model = fs.readFileSync(new URL("../assets/khaemenes-student-profile-v2.js", import.meta.url), "utf8");
const page = fs.readFileSync(new URL("../student/profile.html", import.meta.url), "utf8");

test("render re-entry guard has a guaranteed release even after an exception", () => {
  assert.match(ui, /let rendering=false;\s*function render\(\)\s*\{[\s\S]*?if\(rendering\)return;\s*rendering=true;\s*try\s*\{/);
  assert.match(ui, /\}catch\(error\)\{[\s\S]*?\}finally\{rendering=false\}/);
});
test("guest and render failure show actionable recovery rather than infinite blank loading", () => {
  assert.match(ui, /if\(!l\?\.learnerId\)\{[\s\S]*?profileUiStatus="learner-required"/);
  assert.match(ui, /profileUiStatus="error"/);
  assert.match(ui, /role="alert"/);
  assert.match(ui, /href="\.\/"[^>]*>Open Student Portal/);
  assert.match(ui, /profileUiStatus="ready"/);
});
test("source model alone owns evidence persistence and continues to prevent unchanged writes", () => {
  assert.match(ui, /function render\(\)[\s\S]*?syncContinuationEvidence\(\)/);
  assert.match(ui, /global\.addEventListener\("khaemenes-student-profile-changed"/);
  assert.match(model, /function syncCourseEvidence\(items,target\)/);
  assert.match(model, /if\(!changed\)return true;/);
});
test("portfolio has one explicit chrome mounting strategy", () => {
  assert.doesNotMatch(page, /<script[^>]+src="[^"]*academy-core-global-standard-v1\.js"/);
  for(const file of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-ecosystem-toolbar.js"]){
    const escaped=file.replaceAll(".","\\.");
    const matches=[...page.matchAll(new RegExp('<script[^>]+src="[^"]*'+escaped+'"','g'))];
    assert.equal(matches.length,1,"expected exactly one "+file);
  }
  assert.equal((page.match(/VNV_HEADER\.mount\(/g)||[]).length,1);
  assert.equal((page.match(/VNV_TICKER\.autoPopulate\(/g)||[]).length,1);
});
test("legacy Academy header is replaced by the official VNV header", () => {
  assert.match(page, /replaceLegacy:true,legacySelectors:\["header\[data-khae-header\]"\]/);
  assert.match(page, /id="profileStudio"/);
  assert.match(page, /font-size:16px!important/);
});
