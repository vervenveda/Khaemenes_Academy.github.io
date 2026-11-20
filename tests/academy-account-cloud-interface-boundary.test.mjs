import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const m=JSON.parse(read('workflow/inventories/2026-11-20-academy-core-account-cloud-route-matrix.json'));
test('Academy-only Account Cloud matrix does not authorize runtime operation',()=>{
 assert.equal(m.schema,'academy-core-account-cloud-interface-review-v1');
 assert.equal(m.academyOnly,true);
 assert.equal(m.enabled,false);
 assert.deepEqual(m.authorizedWrites,[]);
 assert.equal(m.studentRecordsTouched,false);
 assert.equal(m.stosT03Commissioning,'HOLD');
 assert.equal(m.interfaces.length,5);
 assert.ok(m.interfaces.every(x=>x.state==='HOLD'));
});
test('browser client session routes are source-aligned while client remains disabled and cookie based',()=>{
 const s=read('assets/khaemenes-account-client.js');
 assert.match(s,/enabled:false,baseUrl:null/);
 assert.match(s,/credentials:"include"/);
 assert.match(s,/async function session\(\)/);
 assert.match(s,/request\("v1\/account\/session"\)/);
 assert.match(s,/request\("v1\/account\/session",\{method:"DELETE"\}/);
 const session=m.routeCompatibility.find(x=>x.operation==='session.read');
 const logout=m.routeCompatibility.find(x=>x.operation==='session.end');
 assert.equal(session.status,'SOURCE_ALIGNED_RUNTIME_UNVERIFIED');
 assert.equal(logout.status,'SOURCE_ALIGNED_RUNTIME_UNVERIFIED');
});
test('local family identity explicitly cannot be represented as protected authority',()=>{
 const registry=read('assets/khaemenes-family-registry.js');
 const status=read('assets/khaemenes-account-connection-status.js');
 assert.match(registry,/localStorage\.getItem/);
 assert.match(registry,/localStorage\.setItem/);
 assert.match(status,/serverVerified:false/);
 assert.match(status,/Cloud synchronization not verified/);
});
test('provisional progress and enrollment remain uncertified',()=>{
 const enroll=read('family/enroll/index.html');
 const progress=read('family/progress/parent-progress.js');
 assert.match(enroll,/not verified Academy enrollment/);
 assert.match(enroll,/not an authoritative placement decision/);
 assert.match(progress,/not a certified transcript/i);
});
test('no foreign network repositories are in the Academy interface matrix',()=>{
 const body=JSON.stringify(m);
 assert.ok(!body.includes('333-Network-Private-Core'));
 assert.ok(!body.includes('spyder-cloud'));
 assert.ok(!body.includes('vervenveda/333.github.io'));
});
