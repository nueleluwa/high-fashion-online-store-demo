import fs from 'fs';
const H={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const get=async u=>{for(let i=0;i<8;i++){const r=await fetch('https://hanifa.co'+u,{headers:H});if(r.status===429){await sleep(8000);continue}if(!r.ok)return null;return r.json()}return null};
const cols=JSON.parse(fs.readFileSync('data/_collections.json','utf8').replace(/^\uFEFF/,'')).collections.filter(c=>c.handle!=='all');
const prods=new Set(JSON.parse(fs.readFileSync('data/products-all.json','utf8')).map(p=>p.handle));
const map={};let missing=new Set();
for(const c of cols){
  const hs=[];
  for(let p=1;p<10;p++){const j=await get(`/collections/${c.handle}/products.json?limit=250&page=${p}&country=US&currency=USD`);if(!j||!j.products.length)break;hs.push(...j.products.map(x=>x.handle));await sleep(700)}
  hs.forEach(h=>{if(!prods.has(h))missing.add(h)});
  map[c.handle]={title:c.title,handles:hs};
  console.log(c.handle,hs.length);
}
console.log('handles missing from products-all:',[...missing].length);
fs.writeFileSync('data/collection-map.json',JSON.stringify(map));
