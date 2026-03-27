import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { FaCalendarAlt, FaArrowLeft, FaFacebook, FaLinkedin } from "react-icons/fa";
import "./InitiativeArticlePage.css";

export default function ActualitePage() {
  const { id } = useParams();
  const { lang } = useLang();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error || !data) {
        setError("Actualité introuvable.");
      } else {
        setItem(data);
      }
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  const pageUrl = `https://rlcmadagascar.org/actualite/${id}`;

  if (loading) return (
    <>
      <Navbar />
      <main className="iarticle-page"><p className="iarticle-status">Chargement…</p></main>
      <Footer />
    </>
  );

  if (error || !item) return (
    <>
      <Navbar />
      <main className="iarticle-page">
        <p className="iarticle-status iarticle-status--error">{error}</p>
        <Link to="/alumni" className="iarticle-back"><FaArrowLeft /> Retour</Link>
      </main>
      <Footer />
    </>
  );

  const title = lang === "en" && item.title_en ? item.title_en : item.title;
  const content = lang === "en" && item.content_en ? item.content_en : item.content;
  const description = content ? content.slice(0, 160) : "";

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        image={item.image || undefined}
        url={`/actualite/${id}`}
        type="article"
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="iarticle-page">
        <div className="iarticle-container">
          <Link to="/alumni" className="iarticle-back">
            <FaArrowLeft /> {lang === "en" ? "Back" : "Retour"}
          </Link>

          <h1 className="iarticle-title">{title}</h1>

          <div className="iarticle-meta">
            <span><FaCalendarAlt /> {formatDate(item.published_at)}</span>
          </div>

          {item.image && (
            <div className="iarticle-image-wrap">
              <img src={item.image} alt={title} className="iarticle-image" loading="lazy" />
            </div>
          )}

          {content && (
            <div className="iarticle-content">
              <div className="iarticle-body">
                {content.split(/\n+/).filter(Boolean).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            </div>
          )}

          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="iarticle-back" style={{ marginTop: 24 }}>
              {lang === "en" ? "View source →" : "Voir la source →"}
            </a>
          )}

          <div className="actu-share-row">
            <span className="actu-share-label">{lang === "en" ? "Share:" : "Partager :"}</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="actu-share-btn actu-share-btn--fb"
              title="Partager sur Facebook"
            >
              <FaFacebook size={16} /> Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="actu-share-btn actu-share-btn--li"
              title="Partager sur LinkedIn"
            >
              <FaLinkedin size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
