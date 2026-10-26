import fs from 'fs';
const H={'User-Agent':'Mozilla/5.0 Chrome/130'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const out=JSON.parse(fs.readFileSync('data/content.json','utf8'));
for(const a of out.articles){
  let t='';for(let i=0;i<5;i++){const r=await fetch('https://hanifa.co'+a.url,{headers:H});if(r.status===429){await sleep(6000);continue}t=await r.text();break}
  const s=t.indexOf('<div class="rte mt-4"');
  let body='';
  if(s>=0){const from=t.indexOf('>',s)+1;let end=t.indexOf('</article>',from);if(end<0)end=t.indexOf('<footer',from);body=t.slice(from,end>0?end:from+40000).replace(/<script[\s\S]*?<\/script>/g,'').replace(/<\/div>\s*$/,'');}
  a.html=body.replace(/_480x480/g,'');
  a.author=(t.match(/<p>by ([^<]+)<\/p>/)||[])[1]||'';
  a.date=(t.match(/<time datetime="([^"]+)"/)||[])[1]||'';
  console.log(a.handle,a.html.length,a.author,a.date);await sleep(1500);
}
fs.writeFileSync('data/content.json',JSON.stringify(out));
