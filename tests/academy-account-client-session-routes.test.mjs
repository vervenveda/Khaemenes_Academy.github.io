import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../assets/khaemenes-account-client.js',import.meta.url),'utf8');
function loadClient(fetchStub){
  const events=[];
  const window={
    location:{href:'https://vervenveda.com/Khaemenes_Academy.github.io/family/'},
    setTimeout,clearTimeout,
    dispatchEvent(event){events.push(event.type)}
  };
  const context={window,fetch:fetchStub,URL,AbortController,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}}};
  runInNewContext(source,context);
  return {client:window.KhaemenesAccountClient,events};
}
test('default client is inert; no network calls for session or logout',async()=>{
 let calls=0;
 const {client}=loadClient(()=>{calls++;throw Error('unexpected network')});
 assert.equal(client.status().enabled,false);
 assert.equal(client.status().configured,false);
 await assert.rejects(()=>client.session(),/account-service-not-configured/);
 await assert.rejects(()=>client.logout(),/account-service-not-configured/);
 assert.equal(calls,0);
});
test('disabled client can be re-disabled without ever triggering a request',()=>{
 let calls=0;
 const {client}=loadClient(()=>{calls++;throw Error('unexpected network')});
 client.configure({enabled:false});
 assert.equal(client.status().enabled,false);
 assert.equal(calls,0);
});
test('synthetic session GET uses only v2 path and HTTPS cookie transport',async()=>{
 const calls=[];
 const {client}=loadClient(async(url,options)=>{
  calls.push({url,method:options.method,credentials:options.credentials,redirect:options.redirect,cache:options.cache,body:options.body});
  return {ok:true,status:200,headers:{get(){return 'application/json'}},json:async()=>({authenticated:false})};
 });
 client.configure({enabled:true,baseUrl:'https://synthetic.example'});
 const result=await client.session();
 assert.equal(result.authenticated,false);
 assert.equal(calls.length,1);
 assert.equal(calls[0].url,'https://synthetic.example/v1/account/session');
 assert.equal(calls[0].method,'GET');
 assert.equal(calls[0].credentials,'include');
 assert.equal(calls[0].redirect,'error');
 assert.equal(calls[0].cache,'no-store');
 assert.equal(calls[0].body,undefined);
});
test('synthetic logout uses only DELETE v2 session path with no body',async()=>{
 const calls=[];
 const {client}=loadClient(async(url,options)=>{
  calls.push({url,method:options.method,body:options.body,credentials:options.credentials});
  return {ok:true,status:204,headers:{get(){return ''}}};
 });
 client.configure({enabled:true,baseUrl:'https://synthetic.example'});
 const result=await client.logout();
 assert.equal(result.authenticated,false);
 assert.deepEqual(calls,[{url:'https://synthetic.example/v1/account/session',method:'DELETE',body:undefined,credentials:'include'}]);
});
test('HTTP base URL is rejected; client stays inactive',()=>{
 const {client}=loadClient(()=>{throw Error('unexpected network')});
 assert.throws(()=>client.configure({enabled:true,baseUrl:'http://synthetic.example'}),/account-service-requires-https/);
 assert.equal(client.status().enabled,false);
});
test('non-success response is not represented as an authenticated session',async()=>{
 const {client}=loadClient(async()=>({ok:false,status:503,headers:{get(){return 'application/json'}},json:async()=>({authenticated:true})}));
 client.configure({enabled:true,baseUrl:'https://synthetic.example'});
 await assert.rejects(()=>client.session(),/account-service-error:503/);
});
