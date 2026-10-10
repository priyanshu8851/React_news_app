import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FaArrowLeft, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { decodeArticleId, findArticle } from "../services/newsApi";
import Loader from "../components/loader/Loader";
import StoryArtwork from "../components/card/StoryArtwork";

function publishedDate(value) {
  if (!value || Number.isNaN(new Date(value).getTime()))
    return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function Article() {
  const { articleId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState(location.state?.article || null);
  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(!location.state?.article);
  const [error, setError] = useState("");
  const publisherUrl = decodeArticleId(articleId || "");
  const title =
    searchParams.get("title") || location.state?.article?.title || "";

  useEffect(() => {
    if (location.state?.article) {
      setArticle(location.state.article);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    findArticle({ query: title, url: publisherUrl, signal: controller.signal })
      .then(setArticle)
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(reason.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [location.state, publisherUrl, title]);

  useEffect(() => {
    setImageFailed(false);
  }, [article?.image]);

  return (
    <main className="article-page">
      <button className="back-link" type="button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to stories
      </button>
      {loading && <Loader />}
      {error && (
        <section className="article-message" role="alert">
          <h1>Story unavailable</h1>
          <p>{error}</p>
          <Link to="/">Return to New-z</Link>
        </section>
      )}
      {article && !loading && (
        <article className="article-detail">
          <div className="article-detail-meta">
            <span>{article.source?.name || "News source"}</span>
            {article.category && <span>{article.category}</span>}
            <time dateTime={article.publishedAt || undefined}>
              {publishedDate(article.publishedAt)}
            </time>
          </div>
          <h1>{article.title}</h1>
          {article.author && (
            <p className="article-author">By {article.author}</p>
          )}
          <div className="article-hero-image">
            {article.image && !imageFailed ? (
              <img
                src={article.image}
                alt={article.title}
                onError={() => setImageFailed(true)}
              />
            ) : <StoryArtwork article={article} />}
          </div>
          <section className="article-body">
            <p className="excerpt-label">FEED EXCERPT</p>
            <p className="article-excerpt">
              {article.description ||
                "The feed did not provide an article excerpt. Use the publisher link for the full report."}
            </p>
            <p className="article-disclosure">
              This news feed provides headlines and a short excerpt. New-z does
              not reproduce the publisher’s full article.
            </p>
            {article.url && (
              <a
                className="publisher-link"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continue at {article.source?.name || "the publisher"}{" "}
                <FaArrowUpRightFromSquare />
              </a>
            )}
            {!article.url && (
              <p className="article-disclosure">
                A verified publisher link wasn’t available for this story.
              </p>
            )}
          </section>
        </article>
      )}
    </main>
  );
}

export default Article;
