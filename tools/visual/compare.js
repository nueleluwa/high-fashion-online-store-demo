const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const {PNG}=require('pngjs'); const pixelmatch=require('pixelmatch');
const ROOT=require('path').resolve(__dirname,'../../docs');
const VPS={desktop:[1440,900],mobile:[390,844]};
const PAGES=JSON.parse(process.argv[2]);
const vps=(process.argv[3]||'desktop,mobile').split(',');
const BASE='http://localhost:3100';
function diff(refPath,implPath,outPath){
  const a=PNG.sync.read(fs.readFileSync(refPath)), b=PNG.sync.read(fs.readFileSync(implPath));
  const w=Math.min(a.width,b.width), h=Math.min(a.height,b.height);
  const crop=(img)=>{const o=new PNG({width:w,height:h});PNG.bitblt(img,o,0,0,w,h,0,0);return o};
  const A=crop(a),B=crop(b),D=new PNG({width:w,height:h});
  const n=pixelmatch(A.data,B.data,D.data,w,h,{threshold:0.15});
  fs.writeFileSync(outPath,PNG.sync.write(D));
  return {pct:(100*n/(w*h)).toFixed(1),dims:`ref ${a.width}x${a.height} impl ${b.width}x${b.height}`};
}
(async()=>{
 const b=await chromium.launch();
 for(const vp of vps){const [w,h]=VPS[vp];
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  for(const [slug,url] of PAGES){
    const dir=`${ROOT}/screenshots-impl/${vp}`; fs.mkdirSync(dir,{recursive:true}); fs.mkdirSync(`${ROOT}/screenshots-diff/${vp}`,{recursive:true});
    await p.goto(BASE+url+(url.includes('?')?'&':'?')+'nopopup',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
    const f=`${dir}/${slug}-initial.png`; await p.screenshot({path:f});
    const H=await p.evaluate(()=>document.documentElement.scrollHeight);
    const ox=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    const ref=`${ROOT}/screenshots/${vp}/${slug}-initial.png`;
    let r='no-ref'; if(fs.existsSync(ref)) r=JSON.stringify(diff(ref,f,`${ROOT}/screenshots-diff/${vp}/${slug}-initial.png`));
    console.log(vp.padEnd(8),slug.padEnd(22),'H='+H,'ox='+ox,r);
  }
  if(errs.length)console.log('ERRORS',[...new Set(errs)].slice(0,8));
  await ctx.close();
 }
 await b.close();
})();
