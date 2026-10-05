/*
 Scan2Gift production-lite API.
 Google Sheet tabs:
 Users: id,email,name,password_hash,token_hash,plan,created_at
 Gifts: id,user_id,code,occasion,template,recipient,sender,title,message,event_date,theme,animation,pin,video_url,photo_url,music_url,status,views,created_at
 Scans: id,code,scanned_at,referrer,user_agent
 Settings: key,value

 Security note:
 - Passwords are stored as SHA-256 hashes, never plain text.
 - Session tokens are stored hashed.
 - This is suitable for a lightweight client/MVP. For high-security/high-scale production use Firebase/Supabase/real backend auth.
*/
const SPREADSHEET_ID='';
const SHEETS={users:'Users',gifts:'Gifts',scans:'Scans',settings:'Settings'};

function ss_(){return SPREADSHEET_ID?SpreadsheetApp.openById(SPREADSHEET_ID):SpreadsheetApp.getActiveSpreadsheet()}
function sheet_(n){return ss_().getSheetByName(n)||ss_().insertSheet(n)}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function rows_(n){const sh=sheet_(n),v=sh.getDataRange().getValues();if(v.length<2)return[];const h=v[0].map(String);return v.slice(1).filter(r=>r.some(x=>x!=='')).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])))}
function append_(n,o){const sh=sheet_(n),h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];sh.appendRow(h.map(k=>o[k]??''))}
function find_(n,k,v){return rows_(n).find(r=>String(r[k])===String(v))}
function sha_(s){return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(s),Utilities.Charset.UTF_8))}
function now_(){return new Date().toISOString()}
function token_(){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'')}
function auth_(p){if(!p.token)throw new Error('Please sign in.');const u=rows_('Users').find(x=>x.token_hash&&x.token_hash===sha_(p.token));if(!u)throw new Error('Session expired. Please sign in again.');return u}
function doGet(e){
  return json_({ok:true,service:'Scan2Gift API',version:'2.1',message:'Scan2Gift API is online. Use POST for actions.'});
}
function doPost(e){try{const p=JSON.parse(e.postData.contents||'{}'),a=p.action;switch(a){case'register':return register_(p);case'login':return login_(p);case'profile':return profile_(p);case'updateProfile':return updateProfile_(p);case'createGift':return createGift_(p);case'getGift':return getGift_(p);case'listGifts':return listGifts_(p);case'analytics':return analytics_(p);case'adminStats':return adminStats_(p);default:return json_({ok:false,error:'Unknown action'})}}catch(x){return json_({ok:false,error:String(x.message||x)})}}
function register_(p){const email=String(p.email||'').trim().toLowerCase(),name=String(p.name||'').trim(),pass=String(p.password||'');if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))throw new Error('Enter a valid email.');if(pass.length<8)throw new Error('Password must be at least 8 characters.');if(find_('Users','email',email))throw new Error('An account already exists.');const token=token_(),u={id:'U'+Date.now(),email,name,password_hash:sha_(pass),token_hash:sha_(token),plan:'Free',created_at:now_()};append_('Users',u);return json_({ok:true,session:{token,email,name,plan:'Free'}})}
function login_(p){const email=String(p.email||'').trim().toLowerCase(),u=find_('Users','email',email);if(!u||u.password_hash!==sha_(String(p.password||'')))throw new Error('Invalid email or password.');const token=token_();updateRow_('Users','email',email,{token_hash:sha_(token)});return json_({ok:true,session:{token,email:u.email,name:u.name,plan:u.plan||'Free'}})}
function profile_(p){const u=auth_(p);return json_({ok:true,user:{id:u.id,email:u.email,name:u.name,plan:u.plan||'Free'}})}
function updateProfile_(p){const u=auth_(p);updateRow_('Users','id',u.id,{name:String(p.name||u.name).slice(0,100)});return json_({ok:true})}
function updateRow_(n,key,val,changes){const sh=sheet_(n),v=sh.getDataRange().getValues(),h=v[0].map(String),ki=h.indexOf(key);for(let i=1;i<v.length;i++)if(String(v[i][ki])===String(val)){Object.keys(changes).forEach(k=>{const ci=h.indexOf(k);if(ci>=0)sh.getRange(i+1,ci+1).setValue(changes[k])});return}throw new Error('Record not found.')}
function createGift_(p){const u=auth_(p),g=p.gift||{};if(!g.recipient||!g.sender||!g.title||!g.message)throw new Error('Required gift fields are missing.');if(find_('Gifts','code',g.code))throw new Error('Gift code collision.');const gift={id:g.id||('G'+Date.now()),user_id:u.id,code:g.code,occasion:g.occasion||'Custom',template:g.theme||'romantic',recipient:g.recipient,sender:g.sender,title:g.title,message:g.message,event_date:g.event_date||'',theme:g.theme||'romantic',animation:g.animation||'hearts',pin:g.pin||'',video_url:g.video_url||'',photo_url:g.photo_url||'',music_url:g.music_url||'',status:'active',views:0,created_at:now_()};append_('Gifts',gift);return json_({ok:true,gift})}
function getGift_(p){const g=find_('Gifts','code',String(p.code||''));if(!g)return json_({ok:false,error:'Gift not found.'});if(g.pin&&String(g.pin)!==String(p.pin||''))return json_({ok:true,locked:true,gift:{code:g.code,recipient:g.recipient}});
incrementView_(g.code);
try{append_('Scans',{id:'S'+Date.now(),code:g.code,scanned_at:now_(),referrer:String(p.referrer||''),user_agent:String(p.user_agent||'')})}catch(e){}
return json_({ok:true,gift:g})}
function incrementView_(code){const sh=sheet_('Gifts'),v=sh.getDataRange().getValues(),h=v[0].map(String),ci=h.indexOf('code'),vi=h.indexOf('views');for(let i=1;i<v.length;i++)if(String(v[i][ci])===code){sh.getRange(i+1,vi+1).setValue(Number(v[i][vi]||0)+1);break}}
function listGifts_(p){const u=auth_(p),gs=rows_('Gifts').filter(g=>String(g.user_id)===String(u.id));return json_({ok:true,gifts:gs.slice(-100).reverse()})}
function analytics_(p){const u=auth_(p),gs=rows_('Gifts').filter(g=>String(g.user_id)===String(u.id)),codes=gs.map(g=>String(g.code)),out={};codes.forEach(c=>out[c]={views:Number(gs.find(g=>String(g.code)===c).views||0),scans:rows_('Scans').filter(s=>String(s.code)===c)});return json_({ok:true,gifts:gs,data:out})}
function adminStats_(p){const u=auth_(p);if(String(u.plan)!=='Admin')throw new Error('Admin access required.');const gs=rows_('Gifts'),us=rows_('Users'),ss=rows_('Scans');return json_({ok:true,users:us.length,gifts:gs.length,scans:ss.length,recent:gs.slice(-30).reverse()})}
function setupSheets(){const h={Users:['id','email','name','password_hash','token_hash','plan','created_at'],Gifts:['id','user_id','code','occasion','template','recipient','sender','title','message','event_date','theme','animation','pin','video_url','photo_url','music_url','status','views','created_at'],Scans:['id','code','scanned_at','referrer','user_agent'],Settings:['key','value']};Object.keys(h).forEach(n=>{const sh=sheet_(n);if(sh.getLastRow()===0)sh.appendRow(h[n])})}
