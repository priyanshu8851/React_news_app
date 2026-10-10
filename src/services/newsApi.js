const NEWS_ENDPOINT = "/.netlify/functions/news";

function safeHttps(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "news.google.com" ? url.href : "";
  } catch {
    return "";
  }
}

export function normalizeArticle(article) {
  if (!article || typeof article.title !== "string") return null;
  const url = safeHttps(article.url);
  const image = safeHttps(article.image);
  return {
    id: url || article.id || article.title,
    title: article.title.trim(),
    description: typeof article.description === "string" ? article.description.trim() : "",
    image,
    url,
    publishedAt: typeof article.publishedAt === "string" ? article.publishedAt : "",
    author: typeof article.author === "string" ? article.author : "",
    category: typeof article.category === "string" ? article.category : "",
    source: { name: typeof article.source?.name === "string" ? article.source.name : "News source" },
  };
}

export async function searchNews({ query, category = "", signal } = {}) {
  const params = new URLSearchParams({ q: query, category });
  const response = await fetch(`${NEWS_ENDPOINT}?${params}`, { signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "News could not be loaded. Please retry.");
  if (!Array.isArray(payload.articles)) throw new Error("The news service returned an invalid response. Please retry.");
  return payload.articles.map(normalizeArticle).filter(Boolean);
}

export async function findArticle({ query, url, signal } = {}) {
  const canonicalUrl = safeHttps(url);
  if (!canonicalUrl) throw new Error("A publisher URL could not be verified for this story. Return to the feed to read other coverage.");
  const params = new URLSearchParams({ q: query, article: url });
  const response = await fetch(`${NEWS_ENDPOINT}?${params}`, { signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "This story could not be retrieved. Please return to the news feed.");
  const article = Array.isArray(payload.articles) ? payload.articles.map(normalizeArticle).find((item) => item?.url === canonicalUrl) : null;
  if (!article) throw new Error("This story is no longer available in the feed. Return to New-z to find recent coverage.");
  return article;
}

export function encodeArticleId(url) {
  const bytes = new TextEncoder().encode(url);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeArticleId(id) {
  try {
    const base64 = id.replaceAll("-", "+").replaceAll("_", "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
  } catch {
    return "";
  }
}
