import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import Card from "../components/card/Card";
import Loader from "../components/loader/Loader";
import { searchNews } from "../services/newsApi";

const categories = ["Top stories", "Cars", "Accidents", "Animals", "Delhi"];

function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Top stories");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadNews = useCallback(
    async ({ search = "", category = "Top stories" } = {}) => {
      const id = ++requestId.current;
      setLoading(true);
      setError("");
      setArticles([]);
      try {
        const term =
          search.trim() ||
          (category === "Top stories" ? "India news" : category);
        const results = await searchNews({ query: term, category });
        if (id !== requestId.current) return;
        const categorized = results.map((article) => ({
          ...article,
          category: category || "Search",
        }));
        setArticles(categorized);
        if (!results.length)
          setError(
            "No recent stories matched this search. Try a broader topic.",
          );
      } catch (err) {
        if (id !== requestId.current) return;
        setError(
          err.message ||
            "We couldn’t connect. Check your connection and try again.",
        );
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadNews({ category: "Top stories" });
    return () => {
      requestId.current += 1;
    };
  }, [loadNews]);

  const chooseCategory = (category) => {
    setActive(category);
    setQuery("");
    loadNews({ category, search: "" });
  };
  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("Enter a topic to search for.");
      return;
    }
    setActive("");
    loadNews({ search: query, category: "" });
  };

  const lead = articles[0];

  return (
    <main className="page-shell">
      <section className="intro">
        <p className="eyebrow">
          <span className="live-dot" /> THE WORLD, IN FOCUS
        </p>
        <h1>
          Stay curious.
          <br />
          <span>Stay informed.</span>
        </h1>
        <p className="intro-copy">
          A clearer view of the stories shaping today.
        </p>
        <form className="searchArea" onSubmit={submitSearch} role="search">
          <FaSearch aria-hidden="true" />
          <input
            aria-label="Search news"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stories, places, or topics..."
          />
          <button type="submit" aria-label="Search news">
            <FaArrowRight />
          </button>
        </form>
      </section>

      <nav className="category-nav" aria-label="News categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={active === category ? "active" : ""}
            aria-pressed={active === category}
            onClick={() => chooseCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <section className="feed" aria-live="polite" aria-busy={loading}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR DAILY BRIEFING</p>
            <h2>{active || `Results for “${query.trim()}”`}</h2>
          </div>
          <span className="story-count">
            {articles.length ? `${articles.length} stories` : ""}
          </span>
        </div>
        {loading && !articles.length ? <Loader /> : null}
        {error && (
          <div className="notice" role="status">
            <strong>{error}</strong>
            <button
              type="button"
              onClick={() =>
                loadNews({
                  category: active || "",
                  search: active ? "" : query,
                })
              }
            >
              Try again
            </button>
          </div>
        )}
        {lead && !loading && (
          <div className="lead-label">
            EDITOR’S PICK <span />
          </div>
        )}
        {lead && <Card article={lead} featured />}
        <div className="cards-area">
          {articles.slice(1).map((article) => (
            <Card key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
