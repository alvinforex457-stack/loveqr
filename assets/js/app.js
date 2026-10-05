(() => {
 const C=window.SCAN2GIFT_CONFIG||{}, KEY="s2g_session";
 window.S2G={
  config:C,
  session:()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}},
  setSession:s=>localStorage.setItem(KEY,JSON.stringify(s)),
  clearSession:()=>localStorage.removeItem(KEY),
  api:async(action,payload={})=>{
   const url=String(C.API_URL||"").trim();
   if(!url||url.includes("PASTE_YOUR")) throw new Error("Google Apps Script URL is not configured. Open assets/js/config.js and paste the deployed /exec URL.");
   let r;
   try{
    r=await fetch(url,{method:"POST",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...payload,token:S2G.session()?.token||""})});
   }catch(e){throw new Error("Could not reach the Google Apps Script API. Check the /exec URL and your internet connection.");}
   const text=await r.text();
   let data;
   try{data=JSON.parse(text)}catch(e){
    const sample=text.replace(/\s+/g," ").slice(0,180);
    throw new Error(`Google Apps Script did not return JSON. HTTP ${r.status}. Check that deployment is Web app → Execute as Me → Who has access: Anyone, and that you copied the /exec URL. Response: ${sample}`);
   }
   if(!data.ok)throw new Error(data.error||"Request failed.");
   return data;
  },
  escape:s=>String(s??"").replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])),
  uid:()=>crypto.randomUUID?crypto.randomUUID().replaceAll("-","").slice(0,10).toUpperCase():Math.random().toString(36).slice(2,12).toUpperCase(),
  siteUrl:()=>C.SITE_URL||location.origin+location.pathname.replace(/\/[^/]*$/,""),
  giftUrl:code=>`${S2G.siteUrl()}/gift.html?code=${encodeURIComponent(code)}`,
  qrUrl:(url,o={})=>`https://api.qrserver.com/v1/create-qr-code/?size=${o.size||800}x${o.size||800}&margin=20&color=${encodeURIComponent((o.color||"40363f").replace("#",""))}&bgcolor=${encodeURIComponent((o.bg||"ffffff").replace("#",""))}&data=${encodeURIComponent(url)}`,
  requireLogin:()=>{if(!S2G.session()){location.href="login.html?next="+encodeURIComponent(location.pathname+location.search);return false}return true}
 };
})();