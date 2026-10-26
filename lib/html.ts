// Raw HTML from Shopify (product copy, pages, articles) is often unbalanced. Injected as-is, a stray tag
// makes the browser re-nest sibling React elements and causes hydration mismatches. This closes unclosed
// tags and drops unmatched closers so the fragment is self-contained.
const VOID = new Set(["img", "br", "hr", "meta", "input", "link", "source", "col", "area", "base", "embed", "param", "track", "wbr"]);

export function balanceHtml(input: string | null | undefined): string {
  const html = input ?? "";
  const stack: string[] = [];
  const out = html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g, (tag, close: string, name: string, self: string) => {
    const t = name.toLowerCase();
    if (VOID.has(t) || self) return tag;
    if (!close) {
      stack.push(t);
      return tag;
    }
    const i = stack.lastIndexOf(t);
    if (i < 0) return "";
    stack.length = i;
    return tag;
  });
  return out + stack.reverse().map((t) => `</${t}>`).join("");
}
