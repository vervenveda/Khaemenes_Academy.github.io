(function attachKhaemenesAccountClient(global){
  "use strict";

  const VERSION="1.0.2";
  const DEFAULT_TIMEOUT_MS=8000;
  const FORBIDDEN_KEYS=/password|passcode|secret|token|otp|verification.?code|recovery.?code|session.?id|cookie|hash|pepper|private.?key|refresh/i;
  let config=Object.freeze({enabled:false,baseUrl:null,timeoutMs:DEFAULT_TIMEOUT_MS});

  function clean(v,max=400){return String(v??"").trim().slice(0,max)}
  function assertSafeUrl(value){
    const url=new URL(value,global.location?.href||"https://vervenveda.com/");
    if(url.protocol!=="https:")throw new Error("account-service-requires-https");
    return url;
  }
  function assertSafeObject(value,path="payload"){
    if(value===null||value===undefined)return;
    if(Array.isArray(value)){value.forEach((item,i)=>assertSafeObject(item,`${path}[${i}]`));return}
    if(typeof value!=="object")return;
    for(const [key,item] of Object.entries(value)){
      if(FORBIDDEN_KEYS.test(key))throw new Error(`forbidden-account-client-field:${path}.${key}`);
      assertSafeObject(item,`${path}.${key}`);
    }
  }
  function safeSession(raw){
    // Account Cloud v2 exposes a display-only session projection, not a browser
    // authorization decision. Wend/Klik must recheck every protected request.
    const empty=()=>Object.freeze({authenticated:false,sessionBoundary:"wend-v0.1",authorizationAuthority:false,
      actorType:null,adultId:null,learnerId:null,familyIds:Object.freeze([]),
      learnerIds:Object.freeze([]),institutionalId:null,displayPermissions:Object.freeze([]),
      placement:null,expiresAt:null});
    if(!raw||typeof raw!=="object"||Array.isArray(raw))return empty();
    assertSafeObject(raw,"session");
    const refs=(value,max=160)=>Object.freeze(Array.isArray(value)?value.slice(0,100).map(v=>clean(v,max)).filter(Boolean):[]);
    const placement=raw.placement&&typeof raw.placement==="object"&&!Array.isArray(raw.placement)?Object.freeze({
      stage:clean(raw.placement.stage,40)||null,
      grade:raw.placement.grade===null?null:(clean(raw.placement.grade,20)||null)
    }):null;
    return Object.freeze({
      authenticated:raw.authenticated===true && raw.sessionBoundary==="wend-v0.1" &&
        raw.authorizationAuthority===false,
      sessionBoundary:"wend-v0.1",
      authorizationAuthority:false,
      actorType:clean(raw.actorType,30)||null,
      adultId:clean(raw.adultId,160)||null,
      learnerId:clean(raw.learnerId,160)||null,
      familyIds:refs(raw.familyIds),
      learnerIds:refs(raw.learnerIds),
      institutionalId:clean(raw.institutionalId,80)||null,
      displayPermissions:refs(raw.displayPermissions,80),
      placement,expiresAt:raw.expiresAt?clean(raw.expiresAt,50):null
    });
  }
  function configure(options={}){
    if(options.enabled!==true){config=Object.freeze({enabled:false,baseUrl:null,timeoutMs:DEFAULT_TIMEOUT_MS});return config}
    const url=assertSafeUrl(options.baseUrl);
    const timeout=Number(options.timeoutMs);
    config=Object.freeze({enabled:true,baseUrl:url.origin+url.pathname.replace(/\/$/,""),timeoutMs:Number.isFinite(timeout)&&timeout>=1000&&timeout<=30000?timeout:DEFAULT_TIMEOUT_MS});
    return config;
  }
  async function request(path,{method="GET",body=null,signal=null}={}){
    if(!config.enabled||!config.baseUrl)throw new Error("account-service-not-configured");
    if(body!==null)assertSafeObject(body,"request");
    const url=assertSafeUrl(`${config.baseUrl}/${clean(path,180).replace(/^\/+/,"")}`);
    const controller=new AbortController();
    const timer=global.setTimeout(()=>controller.abort("timeout"),config.timeoutMs);
    if(signal)signal.addEventListener("abort",()=>controller.abort(signal.reason),{once:true});
    try{
      const response=await fetch(url.href,{
        method:String(method||"GET").toUpperCase(),
        credentials:"include",
        cache:"no-store",
        redirect:"error",
        referrerPolicy:"no-referrer",
        headers:body===null?{"Accept":"application/json"}:{"Accept":"application/json","Content-Type":"application/json"},
        body:body===null?undefined:JSON.stringify(body),
        signal:controller.signal
      });
      const type=response.headers.get("content-type")||"";
      const data=type.includes("application/json")?await response.json():null;
      if(!response.ok)throw new Error(`account-service-error:${response.status}`);
      return data;
    }finally{global.clearTimeout(timer)}
  }
  async function session(){return safeSession(await request("v1/account/session"))}
  async function logout(){
    await request("v1/account/session",{method:"DELETE"});
    return Object.freeze({authenticated:false});
  }
  function status(){return Object.freeze({version:VERSION,enabled:config.enabled,configured:Boolean(config.baseUrl),transport:config.baseUrl?"https":"none",credentialStorage:"httpOnly-cookie-only",webStorageTokens:false})}

  global.KhaemenesAccountClient=Object.freeze({version:VERSION,configure,status,session,logout,safeSession});
  global.dispatchEvent(new CustomEvent("khaemenes-account-client-ready",{detail:status()}));
})(window);
