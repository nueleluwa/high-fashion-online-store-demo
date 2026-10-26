const { chromium } = require('playwright');
const HIDE='[class*=klaviyo],[id*=klaviyo],.needsclick{display:none!important}';
const [,, pagePath, vpName, anchorsJson]=process.argv;
const anchors=JSON.parse(anchorsJson);
const VP={desktop:[1440,900,false],mobile:[390,844,true]}[vpName];
const find=(anchors)=>{
 const out={};
 for(const [k,re] of anchors){
  const rx=new RegExp(re,'i');
  const el=[...document.querySelectorAll('body *')].filter(e=>{if(e.closest('script,style,noscript'))return false;const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').replace(/\s+/g,' ').trim();return t&&rx.test(t)&&e.getBoundingClientRect().width>0}).pop();
  if(!el){out[k]=null;continue}
  const r=el.getBoundingClientRect();const c=getComputedStyle(el);
  out[k]=[Math.round(r.x),Math.round(r.y+scrollY+r.height/2),Math.round(r.width),c.fontSize];
 }
 return out;
};
(async()=>{
 const b=await chromium.launch();const res={};
 for(const [name,base] of [['ref','https://hanifa.co'],['ours','http://localhost:3100']]){
  const ctx=await b.newContext({viewport:{width:VP[0],height:VP[1]},isMobile:VP[2],hasTouch:VP[2]});await ctx.route(/klaviyo\.com|sproutvideo/,r=>r.abort());
  const p=await ctx.newPage();await p.goto(base+pagePath+(name==='ours'?(pagePath.includes('?')?'&':'?')+'nopopup':''),{waitUntil:'domcontentloaded'});await p.waitForTimeout(5000);await p.addStyleTag({content:HIDE});
  await p.evaluate(()=>{for(let y=0;y<5000;y+=500)scrollTo(0,y)});await p.waitForTimeout(1000);await p.evaluate(()=>scrollTo(0,0));
  res[name]=await p.evaluate(find,anchors);res[name]._H=await p.evaluate(()=>document.documentElement.scrollHeight);
  await ctx.close();
 }
 await b.close();
 console.log('anchor'.padEnd(14),'ref[x,y,w,fs]'.padEnd(28),'ours[x,y,w,fs]'.padEnd(28),'dy');
 for(const k of Object.keys(res.ref)){const a=res.ref[k],o=res.ours[k];console.log(k.padEnd(14),String(Array.isArray(a)?a:a).padEnd(28),String(o).padEnd(28),Array.isArray(a)&&Array.isArray(o)?o[1]-a[1]:'n/a')}
})();
