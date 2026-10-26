// Downloads the collection list (titles/handles) and the static pages from the public storefront JSON.
import fs from 'fs';
const H = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (u) => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch('https://hanifa.co' + u, { headers: H });
    if (r.status === 429) { await sleep(8000); continue; }
    if (!r.ok) throw new Error(u + ' ' + r.status);
    return r.json();
  }
  throw new Error('rate limited: ' + u);
};
fs.mkdirSync('data', { recursive: true });
const collections = await get('/collections.json?limit=250&country=US');
fs.writeFileSync('data/_collections.json', JSON.stringify(collections));
await sleep(1000);
const pages = await get('/pages.json?limit=250');
fs.writeFileSync('data/pages.json', JSON.stringify(pages));
console.log('collections', collections.collections.length, 'pages', pages.pages.length);
