document.addEventListener("DOMContentLoaded",async()=>{
 if(!S2G.requireLogin())return; try{const r=await S2G.api("profile");pname.value=r.user.name;pemail.value=r.user.email;plan.value=r.user.plan||"Free"}catch(e){msg.textContent=e.message}
 profileForm.onsubmit=async e=>{e.preventDefault();try{await S2G.api("updateProfile",{name:pname.value});msg.textContent="Saved ✓"}catch(x){msg.className="status error";msg.textContent=x.message}};
 logout.onclick=()=>{S2G.clearSession();location.href="index.html"}; payBtn.href=S2G.config.PREMIUM_PAYMENT_URL||"#";
});