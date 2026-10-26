// Shopify's CDN resizes via ?width=, so the original files are served directly.
export default function shopifyLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const url = src.startsWith("//") ? `https:${src}` : src;
  return `${url}${url.includes("?") ? "&" : "?"}width=${width}`;
}
