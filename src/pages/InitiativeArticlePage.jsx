import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa";
import "./InitiativeArticlePage.css";

export default function InitiativeArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from("initiatives_articles")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error || !data) {
        setError("Article introuvable.");
      } else {
        setArticle(data);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  const getImage = (a) => {
    if (a.image_path) {
      return supabase.storage.from("article-images").getPublicUrl(a.image_path).data.publicUrl;
    }
    return a.image_url;
  };

  const getTitle = (a) => (lang === "fr" ? a.title_fr : a.title_en);
  const getExcerpt = (a) => (lang === "fr" ? a.excerpt_fr : a.excerpt_en);
  const getContent = (a) => (lang === "fr" ? a.content_fr : a.content_en);
  const getTag = (a) => (lang === "fr" ? a.tag_fr : a.tag_en);
  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  if (loading) return (
    <>
      <Navbar />
      <main className="iarticle-page">
        <p className="iarticle-status">Chargement…</p>
      </main>
      <Footer />
    </>
  );

  if (error || !article) return (
    <>
      <Navbar />
      <main className="iarticle-page">
        <p className="iarticle-status iarticle-status--error">{error}</p>
        <button className="iarticle-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Retour
        </button>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <SEOHead
        title={getTitle(article)}
        description={getExcerpt(article)}
        url={`/initiatives/article/${id}`}
      />
      <Navbar />
      <main className="iarticle-page">
        <div className="iarticle-container">
          <Link to={`/initiatives/${article.category}`} className="iarticle-back">
            <FaArrowLeft /> Retour
          </Link>

          <span className="iarticle-tag">{getTag(article)}</span>

          <h1 className="iarticle-title">{getTitle(article)}</h1>

          <div className="iarticle-meta">
            <span><FaCalendarAlt /> {formatDate(article.date)}</span>
            <span><FaUser /> {article.author}</span>
          </div>

          <div className="iarticle-image-wrap">
            <img src={getImage(article)} alt={getTitle(article)} className="iarticle-image" />
          </div>

          <div className="iarticle-content">
            <p className="iarticle-excerpt">{getExcerpt(article)}</p>
            {getContent(article) && (
              <div className="iarticle-body">
                {getContent(article).split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
