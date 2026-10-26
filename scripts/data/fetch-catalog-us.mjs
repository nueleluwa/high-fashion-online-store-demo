import fs from 'fs';
const H={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const get=async u=>{for(let i=0;i<6;i++){const r=await fetch('https://hanifa.co'+u,{headers:H});if(r.status===429){await sleep(7000);continue}if(!r.ok)throw new Error(u+' '+r.status);return r.json()}throw new Error('429 '+u)};
let all=[];
for(let p=1;p<20;p++){const j=await get(`/products.json?limit=250&page=${p}&country=US&currency=USD`);if(!j.products.length)break;all.push(...j.products);await sleep(1000)}
const jax=all.find(x=>x.handle==='jax-knit-maxi-dress');
console.log('products',all.length,'jax',jax.variants.map(v=>v.title+':'+v.price+':'+v.available).join(' | '));
fs.writeFileSync('data/products-all.json',JSON.stringify(all));
