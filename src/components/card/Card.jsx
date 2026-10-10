/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import StoryArtwork from "./StoryArtwork";
import "./card.css";
import { encodeArticleId } from "../../services/newsApi";

function formatDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function Card({ article, featured = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { title, description, image, source, publishedAt, url } = article;
  const articleLink = `/article/${encodeURIComponent(encodeArticleId(url || title))}?title=${encodeURIComponent(title)}&category=${encodeURIComponent(article.category || "")}`;
  return (
    <article className={`card${featured ? " card-featured" : ""}`}>
      <Link
        className="card-image"
        to={articleLink}
        state={{ article }}
        aria-label={`Open story: ${title}`}
      >
        {image && !imageFailed ? (
          <img
            src={image}
            alt={title}
            loading={featured ? "eager" : "lazy"}
            onError={() => setImageFailed(true)}
          />
        ) : <StoryArtwork article={article} />}
        <span className="open-indicator">
          <FaArrowUpRightFromSquare />
        </span>
      </Link>
      <div className="card-copy">
        <div className="article-meta">
          <span>{source?.name || "News desk"}</span>
          <time dateTime={publishedAt || undefined}>
            {formatDate(publishedAt)}
          </time>
        </div>
        <h3>
          <Link to={articleLink} state={{ article }}>
            {title || "Untitled story"}
          </Link>
        </h3>
        <p>
          {description ||
            "Open this story for the available reporting details."}
        </p>
        <Link className="read-link" to={articleLink} state={{ article }}>
          Read story details <FaArrowUpRightFromSquare />
        </Link>
      </div>
    </article>
  );
}

export default Card;
