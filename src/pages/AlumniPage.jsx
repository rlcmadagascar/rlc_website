import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { supabase } from "../lib/supabase";
import { isSafeAvatarUrl } from "../lib/sanitize";
import "./AlumniPage.css";

const SECTOR_COLORS = [
  "#009dea", "#003d6b", "#28a745", "#fd7e14", "#17a2b8",
  "#f0c040", "#8b00ea", "#00a86b", "#e03a3a", "#f09000",
];

export default function AlumniPage() {
  const { t } = useLang();
  const p = t.alumniPage;

  const [initiatives, setInitiatives] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const [{ data: init }, { data: testi }] = await Promise.all([
        supabase.from("initiatives").select("*, alumni(name, avatar, cohort)").order("created_at", { ascending: false }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      if (init) setInitiatives(init);
      if (testi) setTestimonials(testi);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <SEOHead
        title="Alumni & Initiatives"
        description="Découvrez les initiatives et témoignages des alumni RLC Madagascar — plus de 600 jeunes leaders actifs dans les 21 régions de Madagascar."
        url="/alumni"
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
                      <h3 className="alumni-page__initiative-title">{item.title}</h3>
                      {item.excerpt && <p className="alumni-page__initiative-desc">{item.excerpt}</p>}
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

        {/* TÉMOIGNAGES CAROUSEL */}
        <section className="alumni-page__section alumni-page__section--white">
          <div className="alumni-page__container">
            <h2 className="alumni-page__section-title">{p.testimonialsTitle}</h2>
            <div className="alumni-page__divider" />

            {loading ? (
              <p className="alumni-page__empty">Chargement…</p>
            ) : testimonials.length === 0 ? (
              <p className="alumni-page__empty">Aucun témoignage soumis pour le moment.</p>
            ) : (
              <div className="alumni-page__carousel">
                <button
                  className="alumni-page__carousel-btn alumni-page__carousel-btn--prev"
                  onClick={() => setCurrentSlide((c) => (c - 1 + testimonials.length) % testimonials.length)}
                  aria-label="Précédent"
                >
                  ‹
                </button>

                <div className="alumni-page__carousel-track">
                  {testimonials.map((item, i) => (
                    <div
                      key={item.id}
                      className={`alumni-page__testimonial-card alumni-page__testimonial-card--slide ${i === currentSlide ? "alumni-page__testimonial-card--active" : ""}`}
                    >
                      <div className="alumni-page__testimonial-quote-mark">&ldquo;</div>
                      <p className="alumni-page__testimonial-text">{item.quote}</p>
                      <div className="alumni-page__testimonial-author">
                        {isSafeAvatarUrl(item.avatar)
                          ? <img src={item.avatar} alt={item.name} className="alumni-page__testimonial-avatar" />
                          : <div className="alumni-page__testimonial-avatar alumni-page__testimonial-avatar--placeholder">👤</div>
                        }
                        <div className="alumni-page__testimonial-info">
                          <span className="alumni-page__testimonial-name">{item.name ?? "Alumni RLC"}</span>
                          <span className="alumni-page__testimonial-meta">
                            {[item.cohort, item.region].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="alumni-page__carousel-btn alumni-page__carousel-btn--next"
                  onClick={() => setCurrentSlide((c) => (c + 1) % testimonials.length)}
                  aria-label="Suivant"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="alumni-page__carousel-dots">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`alumni-page__carousel-dot ${i === currentSlide ? "alumni-page__carousel-dot--active" : ""}`}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Témoignage ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
