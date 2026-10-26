const { chromium } = require('playwright');
const fs=require('fs');
const OUT=require('path').resolve(__dirname,'../../docs/screenshots');
const VPS={desktop:[1440,900],mobile:[390,844]};
const PAGES=JSON.parse(process.argv[2]); // [[slug,path]]
const only=process.argv[3]?process.argv[3].split(','):Object.keys(VPS);
const HIDE='[class*=klaviyo],[id*=klaviyo],#shopify-chat,#chat-button,iframe[title*=hat i],#ShopifyChat,.needsclick{display:none!important}';
(async()=>{
 const b=await chromium.launch();
 for(const vp of only){ const [w,h]=VPS[vp];
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500});
  await ctx.route(/klaviyo\.com|sproutvideo/,r=>r.abort());
  const p=await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push('pageerror '+e.message.slice(0,100)));
  for(const [slug,path] of PAGES){
   const dir=`${OUT}/${vp}`; fs.mkdirSync(dir,{recursive:true});
   try{
    const r=await p.goto('https://hanifa.co'+path,{waitUntil:'networkidle',timeout:60000}).catch(e=>null);
    await p.addStyleTag({content:HIDE}); await p.waitForTimeout(1500);
    await p.screenshot({path:`${dir}/${slug}-initial.png`});
    const H=await p.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<H;y+=h*0.6){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(200)}
    await p.waitForTimeout(800);
    await p.evaluate(()=>scrollTo(0,Math.max(0,document.documentElement.scrollHeight/2-innerHeight/2)));await p.waitForTimeout(500);
    await p.screenshot({path:`${dir}/${slug}-middle.png`});
    await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await p.waitForTimeout(600);
    await p.screenshot({path:`${dir}/${slug}-bottom.png`});
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);
    await p.screenshot({path:`${dir}/${slug}-full.png`,fullPage:true});
    const ox=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    console.log(vp,slug,r&&r.status(),'H='+H,'overflowX='+ox, await p.title());
   }catch(e){console.log(vp,slug,'FAIL',e.message.slice(0,80))}
  }
  if(errs.length)console.log('errors',errs);
  await ctx.close();
 }
 await b.close();
})();
