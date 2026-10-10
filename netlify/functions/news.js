const responseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=60, s-maxage=60",
};

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function tagValue(xml, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

function parseFeed(xml) {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(([, item]) => {
    const title = tagValue(item, "title");
    const rawDescription = tagValue(item, "description");
    const description = rawDescription.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const source = tagValue(item, "source");
    const link = tagValue(item, "link");
    const publishedAt = tagValue(item, "pubDate");
    const media = item.match(/<(?:media:content|enclosure)\b[^>]*\burl=["']([^"']+)["'][^>]*>/i);
    const imageInDescription = rawDescription.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
    const image = media?.[1] || imageInDescription?.[1] || "";
    if (!title || !link) return null;
    return { id: link, title, description, image, url: link, publishedAt, author: "", category: "", source: { name: source || "Google News" } };
  }).filter(Boolean);
}

function validHttpsUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

async function resolvePublisherUrl(article) {
  const feedUrl = validHttpsUrl(article.url);
  if (!feedUrl || feedUrl.hostname !== "news.google.com") return { ...article, url: feedUrl?.toString() || "" };
  try {
    // Follow only the feed's redirect chain; do not fetch or parse the publisher page.
    const response = await fetch(feedUrl, {
      redirect: "follow",
      headers: { Range: "bytes=0-0", "User-Agent": "New-z News Reader/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    await response.body?.cancel();
    const publisher = validHttpsUrl(response.url);
    return { ...article, url: publisher && publisher.hostname !== "news.google.com" ? publisher.toString() : "" };
  } catch {
    return { ...article, url: "" };
  }
}

export default async (request) => {
  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim();
  const category = params.get("category")?.trim() || "";
  if (!query) return Response.json({ error: "Enter a topic to search for." }, { status: 400, headers: responseHeaders });

  const articleUrl = params.get("article") || "";
  const feedUrl = new URL("https://news.google.com/rss/search");
  feedUrl.search = new URLSearchParams({ q: query, hl: "en-IN", gl: "IN", ceid: "IN:en" }).toString();
  try {
    const response = await fetch(feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml", "User-Agent": "New-z News Reader/1.0" },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      const message = response.status === 429
        ? "Google News is temporarily limiting requests. Wait a moment and try again."
        : `Google News could not complete this search (HTTP ${response.status}). Please retry shortly.`;
      return Response.json({ error: message }, { status: 502, headers: responseHeaders });
    }
    const xml = await response.text();
    if (!xml.includes("<rss") || !xml.includes("</rss>")) {
      return Response.json({ error: "The news feed returned an unreadable response. Please retry shortly." }, { status: 502, headers: responseHeaders });
    }
    const feedArticles = parseFeed(xml).slice(0, 12).map((article) => ({ ...article, category }));
    const articles = await Promise.all(feedArticles.map(resolvePublisherUrl));
    const wanted = validHttpsUrl(articleUrl)?.toString();
    const results = wanted ? articles.filter((article) => article.url === wanted) : articles;
    const safeArticles = results.map((article) => {
      const image = validHttpsUrl(article.image)?.toString() || "";
      return { ...article, image };
    });
    return Response.json({ articles: safeArticles, hasMore: false }, { status: 200, headers: responseHeaders });
  } catch (error) {
    const timedOut = error?.name === "TimeoutError";
    return Response.json({ error: timedOut
      ? "Google News took too long to respond. Please try again."
      : "Could not reach Google News. Check your connection and try again." }, { status: 502, headers: responseHeaders });
  }
};
