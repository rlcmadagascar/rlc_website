import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { FaCalendarAlt, FaUser, FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./InitiativesNewsPage.css";

const ITEMS_PER_PAGE = 6;

const categoryMeta = {
  spotlight: {
    title: "Alumni Initiative Spotlight",
    description: "Portraits d'alumni YALI RLC Madagascar en action — projets d'entrepreneuriat, leadership civique et développement communautaire à travers les 21 régions.",
    breadcrumb: "Spotlight",
  },
  fireside: {
    title: "Fireside Chats",
    description: "Fireside Chats RLC Madagascar — conversations inspirantes avec des alumni leaders YALI qui partagent leur parcours en entrepreneuriat, gouvernance et engagement civique.",
    breadcrumb: "Fireside Chats",
  },
  autres: {
    title: "Kodata — Actualités & Initiatives",
    description: "Kodata : actualités et initiatives du RLC Madagascar Chapter — événements, projets communautaires et actions collectives des alumni YALI à Madagascar.",
    breadcrumb: "Kodata",
  },
};

export default function InitiativesNewsPage({ category }) {
  const { t, lang } = useLang();
  const p = t.initiativesPage;
  const section = p[category];
  const meta = categoryMeta[category] || { title: "Initiatives", description: "Les initiatives du RLC Madagascar Chapter." };

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("initiatives_articles")
        .select("*", { count: "exact" })
        .eq("category", category)
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("date", { ascending: false })
        .range(from, to);

      if (error) {
        setError(error.message);
      } else {
        setArticles(data);
        setTotal(count);
      }
      setLoading(false);
    }
    fetchArticles();
  }, [category, page]);

  const getImage = (a) => {
    if (a.image_path) {
      return supabase.storage.from("article-images").getPublicUrl(a.image_path).data.publicUrl;
    }
    return a.image_url;
  };

  const getTitle = (a) => (lang === "fr" ? a.title_fr : a.title_en);
  const getExcerpt = (a) => (lang === "fr" ? a.excerpt_fr : a.excerpt_en);
  const getTag = (a) => (lang === "fr" ? a.tag_fr : a.tag_en);
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const goTo = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        url={`/initiatives/${category}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Initiatives", url: `/initiatives/${category}` },
          { name: meta.breadcrumb, url: `/initiatives/${category}` },
        ]}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="inews-page">

        {/* Hero */}
        <div className="inews-page__hero">
          <div className="inews-page__hero-inner">
            <span className="inews-page__hero-tag">{section.title}</span>
            <h1>{section.title}</h1>
            <p className="inews-page__hero-subtitle">{section.subtitle}</p>
          </div>
          <div className="inews-page__hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
            </svg>
          </div>
        </div>

        <div className="inews-page__container">
          <Link to="/" className="inews-page__back">
            <FaArrowLeft /> {p.backLabel}
          </Link>

          {loading && <p className="inews-page__status">Chargement…</p>}
          {error && <p className="inews-page__status inews-page__status--error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="inews-page__grid">
                {articles.map((article) => (
                  <article className="inews-card" key={article.id}>
                    <div className="inews-card__image-wrap">
                      <img src={getImage(article)} alt={getTitle(article)} className="inews-card__image" loading="lazy" />
                      <span className="inews-card__tag">{getTag(article)}</span>
                    </div>
                    <div className="inews-card__body">
                      <h2 className="inews-card__title">{getTitle(article)}</h2>
                      <div className="inews-card__meta">
                        <span><FaCalendarAlt /> {formatDate(article.date)}</span>
                        <span><FaUser /> {article.author}</span>
                      </div>
                      <p className="inews-card__excerpt">{getExcerpt(article)}</p>
                      <Link to={`/initiatives/article/${article.id}`} className="inews-card__cta">{p.readMore}</Link>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="inews-pagination">
                  <button
                    className="inews-pagination__btn"
                    onClick={() => goTo(page - 1)}
                    disabled={page === 1}
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`inews-pagination__btn ${n === page ? "inews-pagination__btn--active" : ""}`}
                      onClick={() => goTo(n)}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    className="inews-pagination__btn"
                    onClick={() => goTo(page + 1)}
                    disabled={page === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
