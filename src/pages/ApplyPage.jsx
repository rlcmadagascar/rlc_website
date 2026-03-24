import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import "./ApplyPage.css";

export default function ApplyPage() {
  const { t } = useLang();
  const a = t.apply;

  return (
    <>
      <SEOHead
        title="Candidature"
        description="Postulez au programme RLC Madagascar — ouvert aux jeunes de 18 à 35 ans des pays d'Afrique australe. Aucun frais requis. Développez votre leadership en entrepreneuriat, gouvernance et engagement civique."
        url="/apply"
      />
      <Navbar />
      <main className="apply-page">

        <div className="apply-page__hero">
          <div className="apply-page__hero-inner">
            <h1>{a.title}</h1>
            <p className="apply-page__free">{a.subtitle}</p>
          </div>
          <div className="apply-page__hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f7fbff" />
            </svg>
          </div>
        </div>

        <div className="apply-page__container">

          <div className="apply-page__grid">

            <div className="apply-page__card">
              <h2>{a.whoTitle}</h2>
              <ul className="apply-page__criteria">
                {a.criteria.map((c, i) => (
                  <li key={i}>
                    <span className="apply-page__label">{c.label}</span>
                    <span className="apply-page__value">{c.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="apply-page__card apply-page__card--blue">
              <h2>{a.encouragedTitle}</h2>
              <ul className="apply-page__encouraged">
                {a.encouraged.map((item, i) => (
                  <li key={i}>
                    <span className="apply-page__check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
