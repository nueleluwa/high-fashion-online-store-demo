// Removes unmatched closing tags from scraped article/policy HTML so injected markup can't close its wrapper early.
import fs from "fs";
const VOID = new Set(["img", "br", "hr", "meta", "input", "link", "source", "col", "area", "base", "embed", "param", "track", "wbr"]);

function strip(html) {
  const stack = [];
  let removed = 0;
  const out = html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g, (tag, close, name, self) => {
    const t = name.toLowerCase();
    if (VOID.has(t) || self) return tag;
    if (!close) {
      stack.push(t);
      return tag;
    }
    const i = stack.lastIndexOf(t);
    if (i < 0) {
      removed++;
      return "";
    }
    stack.length = i;
    return tag;
  });
  return { out: out + stack.reverse().map((t) => `</${t}>`).join(""), removed };
}

const file = "data/content.json";
const content = JSON.parse(fs.readFileSync(file, "utf8"));
let total = 0;
for (const a of content.articles) {
  const { out, removed } = strip(a.html);
  a.html = out;
  total += removed;
}
for (const p of Object.values(content.policies)) {
  const { out, removed } = strip(p.html);
  p.html = out;
  total += removed;
}
fs.writeFileSync(file, JSON.stringify(content));
console.log("removed unmatched closing tags:", total);
