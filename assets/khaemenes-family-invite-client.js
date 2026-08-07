(function attachKhaemenesFamilyInviteClient(global){
  "use strict";

  const CONFIG=Object.freeze({
    enabled:false,
    baseUrl:"",
    createPath:"/api/v1/khaemenes/family/invitations",
    acceptPath:"/api/v1/khaemenes/family/invitations/accept",
    revokePath:"/api/v1/khaemenes/family/invitations/revoke",
    credentials:"include"
  });

  function assertHttps(url){
    const parsed=new URL(url,global.location?.href || "https://vervenveda.com/");
    const local=["localhost","127.0.0.1","::1"].includes(parsed.hostname);
    if(parsed.protocol!=="https:" && !local) throw new Error("https-required");
    return parsed;
  }

  function endpoint(path){
    if(!CONFIG.enabled || !CONFIG.baseUrl) return null;
    return assertHttps(new URL(path,CONFIG.baseUrl).toString()).toString();
  }

  async function post(path,body){
    const url=endpoint(path);
    if(!url){
      return {
        ok:false,
        status:"UNAVAILABLE",
        reason:"family-account-server-not-connected"
      };
    }

    const response=await fetch(url,{
      method:"POST",
      credentials:CONFIG.credentials,
      cache:"no-store",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    });

    let data={};
    try{ data=await response.json(); }catch{}
    return {
      ok:response.ok,
      status:response.ok ? "EXECUTED" : "ERROR",
      httpStatus:response.status,
      data
    };
  }

  async function createEmailInvite({
    familyId,
    email,
    relationshipLabel="",
    role="parent",
    learnerIds=[],
    permissionPreset="co-guardian",
    expiresInHours=48
  }={}){
    const cleanEmail=String(email || "").trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)){
      throw new Error("valid-email-required");
    }

    return post(CONFIG.createPath,{
      familyId,
      email:cleanEmail,
      relationshipLabel:String(relationshipLabel || "").trim().slice(0,60),
      role,
      learnerIds:Array.isArray(learnerIds) ? learnerIds.slice(0,50) : [],
      permissionPreset,
      expiresInHours:Math.max(1,Math.min(168,Number(expiresInHours)||48))
    });
  }

  async function acceptInvite(token){
    const value=String(token || "").trim();
    if(!value) throw new Error("invite-token-required");

    // The token is sent directly to the server and is never written to browser storage.
    return post(CONFIG.acceptPath,{token:value});
  }

  async function revokeInvite(inviteId){
    return post(CONFIG.revokePath,{inviteId:String(inviteId || "").trim()});
  }

  function serverStatus(){
    return {
      enabled:CONFIG.enabled,
      baseUrlConfigured:Boolean(CONFIG.baseUrl),
      mode:CONFIG.enabled && CONFIG.baseUrl ? "server-connected" : "static-local-only",
      emailInvitesAvailable:Boolean(CONFIG.enabled && CONFIG.baseUrl)
    };
  }

  global.KhaemenesFamilyInviteClient=Object.freeze({
    config:CONFIG,
    serverStatus,
    createEmailInvite,
    acceptInvite,
    revokeInvite
  });
})(window);
