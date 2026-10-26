import fs from 'fs';
const H={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const get=async u=>{for(let i=0;i<5;i++){const r=await fetch('https://hanifa.co'+u,{headers:H});if(r.status===429){await sleep(6000);continue}return r.text()}return ''};
const out={policies:{},articles:[]};
for(const h of ['privacy-policy','terms-of-service','refund-policy']){
  const t=await get('/policies/'+h);
  const m=t.match(/<div class="shopify-policy__container[\s\S]*?<\/main>/)||t.match(/<main[\s\S]*?<\/main>/);
  const title=(t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]?.replace(/<[^>]+>/g,'').trim()||h;
  const body=(m?m[0]:'').match(/shopify-policy__body[\s\S]*?<div class="rte">([\s\S]*?)<\/div>\s*<\/div>/);
  out.policies[h]={title,html:body?body[1]:(m?m[0]:'')};
  console.log(h,out.policies[h].html.length);await sleep(1500);
}
const sm=await get('/sitemap_articles_1.xml');
const urls=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1].replace('https://hanifa.co',''));
for(const u of urls){
  const t=await get(u);
  const title=(t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]?.replace(/<[^>]+>/g,'').trim()||u;
  const img=(t.match(/property="og:image" content="([^"]+)"/)||[])[1]||'';
  const body=(t.match(/<div class="rte[^"]*">([\s\S]*?)<\/div>\s*<\/(?:div|article)>/)||[])[1]||'';
  out.articles.push({url:u,handle:u.split('/').pop(),title,image:img,html:body});
  console.log(u,title,body.length);await sleep(1500);
}
fs.writeFileSync('data/content.json',JSON.stringify(out));
