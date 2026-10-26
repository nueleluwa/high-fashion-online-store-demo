// Downloads the reference storefront's fonts and logo into public/. They are third-party brand assets and
// are deliberately NOT committed to this repository. Only run this if you are authorised to use them.
import fs from "node:fs";

const FILES = [
  ["BDSans-Black", "woff2"],
  ["BDSans-Bold", "woff2"],
  ["BDSans-Regular", "woff2"],
  ["Helvetica-Light", "woff2"],
  ["Helvetica-Bold", "woff2"],
];
fs.mkdirSync("public/fonts", { recursive: true });

for (const [name, ext] of FILES) {
  const res = await fetch(`https://hanifa.co/cdn/shop/files/${name}.${ext}`);
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  fs.writeFileSync(`public/fonts/${name}.${ext}`, Buffer.from(await res.arrayBuffer()));
  console.log("saved", `public/fonts/${name}.${ext}`);
}

const logo = await fetch("https://hanifa.co/cdn/shop/files/Hanifa_woman_edition_1080_x_1300_px.png?v=1718917772&width=240");
if (!logo.ok) throw new Error(`logo: ${logo.status}`);
fs.writeFileSync("public/logo.png", Buffer.from(await logo.arrayBuffer()));
console.log("saved public/logo.png");
