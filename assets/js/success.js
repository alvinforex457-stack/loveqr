document.addEventListener("DOMContentLoaded",()=>{
 const p=new URLSearchParams(location.search), url=p.get("url");
 if(!url)return;
 const img=document.getElementById("qr"); img.src=S2G.qrUrl(url);
 document.getElementById("giftLink").value=url; document.getElementById("open").href=url;
 document.getElementById("copy").onclick=async()=>{await navigator.clipboard.writeText(url);document.getElementById("copy").textContent="Copied ✓";};
 document.getElementById("downloadQr").onclick=()=>{const a=document.createElement("a");a.href=img.src;a.download="scan2gift-"+p.get("code")+".png";a.target="_blank";a.click();};
});