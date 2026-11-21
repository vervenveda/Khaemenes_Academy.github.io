import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const m=JSON.parse(read('workflow/inventories/2026-11-20-account-cloud-academy-home-five-bubble-topology.json'));
test('five handoff bubbles are explicit and authorize no account writes',()=>{
 assert.equal(m.fiveBubbles.length,5);
 assert.deepEqual(m.authorizedWrites,[]);
 assert.equal(m.academyOnly,true);
 assert.equal(m.productionEnabled,false);
 assert.equal(m.accountCloudSynchronized,false);
 assert.equal(m.nativeT03Commissioned,false);
});
test('Academy Core retains the canonical local family-to-learner route owner',()=>{
 const r=read('assets/khaemenes-front-door-router.js');
 assert.match(r,/const FAMILY_PORTAL="https:\/\/vervenveda.com\/Khaemenes_Academy.github.io\/family\/"/);
 assert.match(r,/function routeForLearner\(/);
 assert.match(r,/function identifiedStudentDestination\(/);
 for(const grade of ['09','10','11','12'])assert.ok(r.includes('grade==="'+grade+'"'),grade);
 assert.match(r,/changesLearnerIdentity:false,awardsMastery:false/);
});
test('Academy protected client remains inactive with the v2 display-only session',()=>{
 const s=read('assets/khaemenes-account-client.js');
 assert.match(s,/enabled:false,baseUrl:null/);
 assert.match(s,/request\("v1\/account\/session"\)/);
 assert.match(s,/request\("v1\/account\/session",\{method:"DELETE"\}/);
 assert.match(s,/authorizationAuthority:false/);
});
test('Family/Student account status never misreports local record selection as server verification',()=>{
 const status=read('assets/khaemenes-account-connection-status.js');
 assert.match(status,/serverVerified:false/);
 assert.match(status,/mode:"local"/);
 assert.match(status,/Cloud synchronization not verified/);
 const registry=read('assets/khaemenes-family-registry.js');
 assert.match(registry,/localStorage\.getItem/);
 assert.match(registry,/localStorage\.setItem/);
});
test('provisional enrollment and Student Profile are not commissioned Account Cloud enrollments',()=>{
 const enrollment=read('family/enroll/index.html');
 assert.match(enrollment,/not verified Academy enrollment/);
 const policy=read('family/ACCOUNT-CONTINUITY-READINESS.md');
 assert.match(policy,/cloud|server|native|session/i);
 assert.equal(m.protectedCloud.productionDataAllowed,false);
 assert.equal(m.visitorHome.accountOwner,false);
});
