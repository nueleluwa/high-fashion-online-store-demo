import pagesJson from "@/data/pages.json";
import contentJson from "@/data/content.json";

type Page = { handle: string; title: string; body_html: string };
type Article = { url: string; handle: string; title: string; image: string; html: string; author: string; date: string };

const pages = (pagesJson as { pages: Page[] }).pages;
const content = contentJson as unknown as { policies: Record<string, { title: string; html: string }>; articles: Article[] };

export const getPage = (handle: string) => pages.find((p) => p.handle === handle);
export const getPageHandles = () => pages.map((p) => p.handle);
export const getPolicy = (handle: string) => content.policies[handle];
export const getPolicyHandles = () => Object.keys(content.policies);
export const getArticles = () => content.articles;
export const getArticle = (handle: string) => content.articles.find((a) => a.handle === handle);

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/s+/g, " ").trim();

export function searchContent(q: string) {
  const terms = q.trim().toLowerCase().split(/s+/).filter(Boolean);
  const hit = (s: string) => terms.length > 0 && terms.every((t) => s.toLowerCase().includes(t));
  return {
    articles: content.articles.filter((a) => hit(a.title + " " + plain(a.html))),
    pages: pages
      .filter((p) => p.handle !== "shogun-imported-homepage" && hit(p.title + " " + plain(p.body_html)))
      .map((p) => ({ handle: p.handle, title: p.title, snippet: plain(p.body_html).slice(0, 120) })),
  };
}
