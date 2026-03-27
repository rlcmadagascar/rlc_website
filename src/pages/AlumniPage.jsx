import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { supabase } from "../lib/supabase";
import "./AlumniPage.css";

const SECTOR_COLORS = [
  "#009dea", "#003d6b", "#28a745", "#fd7e14", "#17a2b8",
  "#f0c040", "#8b00ea", "#00a86b", "#e03a3a", "#f09000",
];

const EXCERPT_LIMIT = 150;

function InitiativeModal({ item, onClose }) {
  const { lang } = useLang();
  const title = lang === "en" && item.title_en ? item.title_en : item.title;
  const excerpt = lang === "en" && item.excerpt_en ? item.excerpt_en : item.excerpt;

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="alumni-modal__overlay" onClick={onClose}>
      <div className="alumni-modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="alumni-modal__close" onClick={onClose} aria-label="Fermer">✕</button>
        {item.image && <img src={item.image} alt={title} className="alumni-modal__img" />}
        <h3 className="alumni-modal__title">{title}</h3>
        <div className="alumni-modal__text">
          {excerpt && excerpt.split(/\n+/).map((para, i) => para.trim() && <p key={i}>{para.trim()}</p>)}
        </div>
        <div className="alumni-modal__tags">
          {item.sector && <span className="alumni-page__tag">{item.sector}</span>}
          {item.tag && <span className="alumni-page__tag">{item.tag}</span>}
          {item.region && <span className="alumni-page__tag">{item.region}</span>}
        </div>
      </div>
    </div>
  );
}


function InitiativeExcerpt({ text, onReadMore }) {
  if (!text) return null;
  return (
    <p className="alumni-page__initiative-desc">
      {text.length <= EXCERPT_LIMIT ? text : text.slice(0, EXCERPT_LIMIT) + "…"}
      {text.length > EXCERPT_LIMIT && (
        <>{" "}<button className="alumni-page__read-more" onClick={onReadMore}>Lire la suite</button></>
      )}
    </p>
  );
}

export default function AlumniPage() {
  const { t, lang } = useLang();
  const p = t.alumniPage;

  const [initiatives, setInitiatives] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [{ data: init }, { data: actu }] = await Promise.all([
        supabase.from("initiatives").select("*, alumni(name, avatar, cohort)").order("created_at", { ascending: false }),
        supabase.from("actualites").select("*").eq("published", true).order("published_at", { ascending: false }),
      ]);
      if (init) setInitiatives(init);
      if (actu) setActualites(actu);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      {modalItem && <InitiativeModal item={modalItem} onClose={() => setModalItem(null)} />}
      <SEOHead
        title="Alumni & Initiatives"
        description="Initiatives et témoignages des alumni YALI RLC Madagascar — +600 jeunes leaders malgaches actifs dans les 21 régions en entrepreneuriat, gouvernance et engagement civique."
        url="/alumni"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Alumni & Initiatives", url: "/alumni" },
        ]}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="alumni-page">

        {/* HERO */}
        <div className="alumni-page__hero">
          <div className="alumni-page__hero-inner">
            <h1>{p.title}</h1>
            <p className="alumni-page__hero-subtitle">{p.subtitle}</p>
          </div>
          <div className="alumni-page__hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f7fbff" />
            </svg>
          </div>
        </div>

        {/* INITIATIVES */}
        <section className="alumni-page__section alumni-page__section--light">
          <div className="alumni-page__container">
            <h2 className="alumni-page__section-title">{p.initiativesTitle}</h2>
            <div className="alumni-page__divider" />

            {loading ? (
              <p className="alumni-page__empty">{p.loading}</p>
            ) : initiatives.length === 0 ? (
              <p className="alumni-page__empty">{p.noInitiatives}</p>
            ) : (
              <div className="alumni-page__initiatives-grid">
                {initiatives.map((item, i) => {
                  const color = SECTOR_COLORS[i % SECTOR_COLORS.length];
                  return (
                    <div className="alumni-page__initiative-card" key={item.id}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="alumni-page__initiative-img" />
                      ) : (
                        <div className="alumni-page__initiative-icon" style={{ backgroundColor: color + "1a", color }}>
                          ✦
                        </div>
                      )}
                      <h3 className="alumni-page__initiative-title">
                        {lang === "en" && item.title_en ? item.title_en : item.title}
                      </h3>
                      <InitiativeExcerpt
                        text={lang === "en" && item.excerpt_en ? item.excerpt_en : item.excerpt}
                        onReadMore={() => setModalItem(item)}
                      />
                      <div className="alumni-page__initiative-tags">
                        {item.sector && <span className="alumni-page__tag">{item.sector}</span>}
                        {item.tag && <span className="alumni-page__tag">{item.tag}</span>}
                        {item.region && <span className="alumni-page__tag">{item.region}</span>}
                      </div>
                      <div className="alumni-page__initiative-footer">
                        <span className="alumni-page__initiative-alumni">
                          {item.alumni?.name ?? "Alumni RLC"}
                        </span>
                        <span className="alumni-page__initiative-year">
                          {new Date(item.created_at).getFullYear()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ACTUALITÉS */}
        <section className="alumni-page__section alumni-page__section--white">
          <div className="alumni-page__container">
            <h2 className="alumni-page__section-title">Actualités</h2>
            <div className="alumni-page__divider" />

            {loading ? (
              <p className="alumni-page__empty">Chargement…</p>
            ) : actualites.length === 0 ? (
              <p className="alumni-page__empty">Aucune actualité pour le moment.</p>
            ) : (
              <div className="alumni-page__actu-grid">
                {actualites.map((item) => (
                  <div className="alumni-page__actu-card" key={item.id}>
                    {item.image && (
                      <img src={item.image} alt={item.title} className="alumni-page__actu-img" />
                    )}
                    <div className="alumni-page__actu-body">
                      <span className="alumni-page__actu-date">
                        {new Date(item.published_at).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <h3 className="alumni-page__actu-title">
                        {lang === "en" && item.title_en ? item.title_en : item.title}
                      </h3>
                      {item.content && (
                        <p className="alumni-page__actu-content">
                          {(() => {
                            const txt = lang === "en" && item.content_en ? item.content_en : item.content;
                            return txt.length > 180 ? txt.slice(0, 180) + "…" : txt;
                          })()}
                        </p>
                      )}
                      <div className="alumni-page__actu-footer">
                        <Link to={`/actualite/${item.id}`} className="alumni-page__actu-link">
                          {lang === "en" ? "Read more →" : "Lire la suite →"}
                        </Link>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="alumni-page__actu-link alumni-page__actu-link--ext">
                            Source →
                          </a>
                        )}
                      </div>
                      <div className="alumni-page__actu-share">
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://rlcmadagascar.org/actualite/${item.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alumni-page__actu-share-btn alumni-page__actu-share-btn--fb"
                          title={lang === "en" ? "Share on Facebook" : "Partager sur Facebook"}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://rlcmadagascar.org/actualite/${item.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alumni-page__actu-share-btn alumni-page__actu-share-btn--li"
                          title={lang === "en" ? "Share on LinkedIn" : "Partager sur LinkedIn"}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
