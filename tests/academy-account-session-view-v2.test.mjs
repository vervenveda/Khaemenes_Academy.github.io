import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../assets/khaemenes-account-client.js',import.meta.url),'utf8');
function client(){
 const window={location:{href:'https://vervenveda.com/'},setTimeout,clearTimeout,dispatchEvent(){}};
 runInNewContext(src,{window,URL,AbortController,CustomEvent:class {}});
 return window.KhaemenesAccountClient;
}
const view=()=>({authenticated:true,sessionBoundary:'wend-v0.1',authorizationAuthority:false,actorType:'adult',adultId:'adult_demo',
 familyIds:['fam_demo'],learnerIds:['learner_demo'],displayPermissions:['learner.view'],
 placement:{stage:'high',grade:'09'},expiresAt:'2026-11-21T00:00:00Z'});
test('Academy display session matches protected Account Cloud v2 shape without authority',()=>{
 const c=client(),s=c.safeSession(view());
 assert.equal(c.status().enabled,false);
 assert.equal(s.authenticated,true);
 assert.equal(s.authorizationAuthority,false);
 assert.equal(s.sessionBoundary,'wend-v0.1');
 assert.equal(s.familyIds[0],'fam_demo');
 assert.equal(s.learnerIds[0],'learner_demo');
 assert.equal(s.displayPermissions[0],'learner.view');
 assert.equal(s.permissions,undefined);
 assert.equal(s.familyId,undefined);
 assert.equal(s.placement.grade,'09');
 assert.ok(Object.isFrozen(s));
 assert.ok(Object.isFrozen(s.displayPermissions));
});
test('metadata roles cannot become browser permissions or authorization',()=>{
 const input={...view(),metadata:{roles:['admin']},roles:['admin'],role:'admin',permissions:['account.admin']};
 const s=client().safeSession(input);
 assert.equal(s.authorizationAuthority,false);
 assert.deepEqual([...s.displayPermissions],['learner.view']);
 assert.equal(s.roles,undefined);
 assert.equal(s.role,undefined);
 assert.equal(s.permissions,undefined);
 assert.equal(s.metadata,undefined);
});
test('untrusted or missing session boundary never displays authenticated state',()=>{
 const c=client();
 for(const input of [{...view(),sessionBoundary:'other'},{...view(),authorizationAuthority:true},{...view(),sessionBoundary:undefined},null,[]])
  assert.equal(c.safeSession(input).authenticated,false);
});
test('sensitive session fields are rejected',()=>{
 const c=client();
 for(const name of ['token','password','refreshCredential','cookie','sessionSecret']){
  const input={...view(),[name]:'synthetic'};
  assert.throws(()=>c.safeSession(input),/forbidden-account-client-field/);
 }
});
test('a valid browser display view does not enable the client or issue a request',()=>{
 const c=client();
 const s=c.safeSession(view());
 assert.equal(s.authenticated,true);
 assert.equal(c.status().enabled,false);
 assert.equal(c.status().configured,false);
});
