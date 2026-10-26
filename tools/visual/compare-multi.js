const { chromium } = require('playwright');
const fs=require('fs');
const {PNG}=require('pngjs'); const pixelmatch=require('pixelmatch');
const ROOT=require('path').resolve(__dirname,'../../docs');
const VPS={laptop:[1366,768],tablet:[768,1024],'small-mobile':[375,667]};
const PAGES=[['homepage','/'],['collection-dresses','/collections/dresses'],['product-jax-gown','/products/jax-knit-maxi-dress'],['faqs','/pages/faqs']];
const HIDE='[class*=klaviyo],[id*=klaviyo],.needsclick{display:none!important}';
function diff(a,b,out){const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));const w=Math.min(A.width,B.width),h=Math.min(A.height,B.height);
 const c=i=>{const o=new PNG({width:w,height:h});PNG.bitblt(i,o,0,0,w,h,0,0);return o};const D=new PNG({width:w,height:h});
 const n=pixelmatch(c(A).data,c(B).data,D.data,w,h,{threshold:0.15});fs.writeFileSync(out,PNG.sync.write(D));return (100*n/(w*h)).toFixed(1)}
(async()=>{
 const b=await chromium.launch();
 for(const [vp,[w,h]] of Object.entries(VPS)){
  const dirR=`${ROOT}/screenshots/${vp==='small-mobile'?'mobile':vp}`, dirI=`${ROOT}/screenshots-impl/${vp}`, dirD=`${ROOT}/screenshots-diff/${vp}`;
  [dirR,dirI,dirD].forEach(d=>fs.mkdirSync(d,{recursive:true}));
  for(const [kind,base] of [['ref','https://hanifa.co'],['ours','http://localhost:3100']]){
   const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<800});await ctx.route(/klaviyo\.com|sproutvideo/,r=>r.abort());
   const p=await ctx.newPage();
   for(const [slug,url] of PAGES){
    await p.goto(base+url+(kind==='ours'?(url.includes('?')?'&':'?')+'nopopup':''),{waitUntil:'networkidle',timeout:90000}).catch(()=>{});
    await p.addStyleTag({content:HIDE});await p.waitForTimeout(1800);
    const prefix=vp==='small-mobile'?'small-mobile-':'';
    const f=kind==='ref'?`${dirR}/${prefix}${slug}-initial.png`:`${dirI}/${slug}-initial.png`;
    await p.screenshot({path:f});
    const H=await p.evaluate(()=>document.documentElement.scrollHeight);const ox=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    (global.meta=global.meta||{})[`${vp}|${slug}|${kind}`]={H,ox};
   }
   await ctx.close();
  }
  for(const [slug] of PAGES){
   const prefix=vp==='small-mobile'?'small-mobile-':'';
   const pct=diff(`${dirR}/${prefix}${slug}-initial.png`,`${dirI}/${slug}-initial.png`,`${dirD}/${slug}-initial.png`);
   const r=global.meta[`${vp}|${slug}|ref`],o=global.meta[`${vp}|${slug}|ours`];
   console.log(vp.padEnd(13),slug.padEnd(20),`diff ${pct}%`,`H ref ${r.H} ours ${o.H}`,`overflow ours=${o.ox}`);
  }
 }
 await b.close();
})();
