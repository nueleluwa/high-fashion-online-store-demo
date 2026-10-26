import fs from 'fs';
const H={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const order=[];
for(let p=1;p<=8;p++){
  let t='';for(let i=0;i<6;i++){const r=await fetch(`https://hanifa.co/collections/all?page=${p}&country=US`,{headers:H});if(r.status===429){await sleep(8000);continue}t=await r.text();break}
  const mi=Math.max(t.indexOf('id="MainContent"'),t.indexOf('<main'));const body=mi>=0?t.slice(mi):t;const hs=[...body.matchAll(/href="\/(?:collections\/all\/)?products\/([a-z0-9-]+)/g)].map(m=>m[1]);
  const fresh=[...new Set(hs)].filter(h=>!order.includes(h));
  console.log('page',p,'handles',fresh.length);
  if(!fresh.length)break;
  order.push(...fresh);await sleep(1000);
}
const map=JSON.parse(fs.readFileSync('data/collection-map.json','utf8'));
const known=new Set(JSON.parse(fs.readFileSync('data/products-all.json','utf8')).map(p=>p.handle));
const ok=order.filter(h=>known.has(h));
console.log('rendered order',order.length,'known',ok.length,ok.slice(0,4));
// `/collections/all` is ordered by the storefront (not alphabetical like products.json), so use the rendered order.
if (ok.length >= 100) {
  map.all = { title: 'Products', handles: ok };
  fs.writeFileSync('data/collection-map.json', JSON.stringify(map));
  console.log('updated collection "all" order');
} else {
  console.log('rendered order too short; keeping existing "all" order');
}
