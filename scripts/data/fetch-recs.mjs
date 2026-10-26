import fs from 'fs';
const H={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const prods=JSON.parse(fs.readFileSync('data/products-all.json','utf8'));
const out={};
for(const p of prods){
  for(let i=0;i<6;i++){
    const r=await fetch(`https://hanifa.co/recommendations/products.json?product_id=${p.id}&limit=4&intent=related&country=US`,{headers:H});
    if(r.status===429){await sleep(8000);continue}
    if(r.ok){const j=await r.json();out[p.handle]=(j.products||[]).map(x=>x.handle)}
    break;
  }
  await sleep(500);
}
const n=Object.values(out).filter(a=>a.length).length;
console.log('with recs',n,'of',prods.length,'sample',out['jax-knit-maxi-dress']);
fs.writeFileSync('data/recommendations.json',JSON.stringify(out));
