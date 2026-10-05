document.addEventListener("DOMContentLoaded",()=>{
 if(!S2G.requireLogin())return;
 const q=new URLSearchParams(location.search); const occasion=q.get("occasion"),theme=q.get("theme");
 if(occasion){const el=document.querySelector(`input[name="occasion"][value="${CSS.escape(occasion)}"]`);if(el)el.checked=true}
 if(theme&&document.querySelector('[name="theme"]'))document.querySelector('[name="theme"]').value=theme;
 const form=document.getElementById("giftForm"),status=document.getElementById("formStatus");
 const pv=()=>{pvRecipient.textContent=recipient.value||"Someone special";pvTitle.textContent=title.value||"Your beautiful gift";pvMessage.textContent=message.value||"Your message will appear here.";pvFrom.textContent="From "+(sender.value||"you")+" ❤️"};
 form.querySelectorAll("input,textarea,select").forEach(e=>e.addEventListener("input",pv));pv();
 form.addEventListener("submit",async e=>{e.preventDefault();status.className="status";status.textContent="Creating your gift…";const data=Object.fromEntries(new FormData(form).entries());data.code=S2G.uid();data.id="G"+Date.now().toString(36).toUpperCase();
 try{const r=await S2G.api("createGift",{gift:data});const url=S2G.giftUrl(r.gift.code);location.href=`success.html?code=${encodeURIComponent(r.gift.code)}&url=${encodeURIComponent(url)}`}catch(err){status.className="status error";status.textContent=err.message}});
});