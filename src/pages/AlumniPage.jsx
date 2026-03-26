import { useState, useEffect } from "react";
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
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="alumni-page__actu-link">
                          {lang === "en" ? "Read more →" : "Lire la suite →"}
                        </a>
                      )}
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
