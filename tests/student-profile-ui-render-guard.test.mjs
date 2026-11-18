import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const ui = fs.readFileSync(new URL("../assets/khaemenes-student-profile-ui-v2.js", import.meta.url), "utf8");
const model = fs.readFileSync(new URL("../assets/khaemenes-student-profile-v2.js", import.meta.url), "utf8");

test("Student Portfolio render is protected from synchronous profile-change re-entry", () => {
  assert.match(ui, /let rendering=false;\s*function render\(\)\s*\{\s*\/\/[\s\S]*?if\(rendering\)return;\s*rendering=true;\s*try\s*\{/);
  assert.match(ui, /bind\(\);\s*\}finally\{rendering=false\}/);
});

test("Course evidence still synchronizes but source model alone owns persistence", () => {
  assert.match(ui, /function render\(\)[\s\S]*?syncContinuationEvidence\(\)/);
  assert.match(ui, /global\.addEventListener\("khaemenes-student-profile-changed"/);
  assert.match(model, /function syncCourseEvidence\(items,target\)/);
  assert.match(model, /if\(!changed\)return true;/);
});
