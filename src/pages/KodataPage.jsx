import { Link } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaCalendarAlt, FaProjectDiagram, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { useLang } from "../context/LangContext";
import "./KodataPage.css";

export default function KodataPage() {
  const { t } = useLang();
  const k = t.kodata;

  return (
    <>
      <SEOHead
        title="Kodata — Communauté Data Madagascar"
        description="Kodata est une communauté de passionnés de la data à Madagascar — data analysts, engineers, scientists et curieux du numérique. Rejoignez-nous gratuitement."
        url="/initiatives/kodata"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Initiatives", url: "/" },
          { name: "Kodata", url: "/initiatives/kodata" },
        ]}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="kodata-page">

        {/* Hero */}
        <div className="kodata-hero">
          <div className="kodata-hero__inner">
            <span className="kodata-hero__tag">{k.tag}</span>
            <h1>Kodata</h1>
            <p className="kodata-hero__subtitle">{k.subtitle}</p>
          </div>
          <div className="kodata-hero__wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
            </svg>
          </div>
        </div>

        <div className="kodata-container">
          <Link to="/" className="kodata-back">
            <FaArrowLeft /> {k.back}
          </Link>

          {/* Présentation */}
          <section className="kodata-section kodata-row">
            <div className="kodata-row__text">
              <h2 className="kodata-section__title">{k.presentation.title}</h2>
              <p className="kodata-text">{k.presentation.p1}</p>
              <p className="kodata-text">{k.presentation.p2}</p>
            </div>
            <div className="kodata-row__img">
              <img src="/kodata-1.webp" alt="Événement Kodata" loading="lazy" />
            </div>
          </section>

          <blockquote className="kodata-quote">
            <p>{k.quote.text}</p>
            <cite>{k.quote.author}</cite>
          </blockquote>

          {/* Mission & Vision */}
          <section className="kodata-section kodata-row kodata-row--reverse">
            <div className="kodata-row__text">
              <div className="kodata-mv">
                <div className="kodata-mv__card">
                  <h3>{k.mission.label}</h3>
                  <p>{k.mission.text}</p>
                </div>
                <div className="kodata-mv__card kodata-mv__card--vision">
                  <h3>{k.vision.label}</h3>
                  <p>{k.vision.text}</p>
                </div>
              </div>
            </div>
            <div className="kodata-row__img">
              <img src="/kodata-2.webp" alt="Événement Kodata" loading="lazy" />
            </div>
          </section>

          {/* Ce que propose Kodata */}
          <section className="kodata-section">
            <div className="kodata-row__text">
              <h2 className="kodata-section__title">{k.offers.title}</h2>
              <div className="kodata-features">
                <div className="kodata-feature">
                  <div className="kodata-feature__icon"><FaUsers /></div>
                  <h3>{k.offers.discussions.title}</h3>
                  <p>{k.offers.discussions.desc}</p>
                </div>
                <div className="kodata-feature">
                  <div className="kodata-feature__icon"><FaCalendarAlt /></div>
                  <h3>{k.offers.events.title}</h3>
                  <p>{k.offers.events.desc}</p>
                </div>
                <div className="kodata-feature">
                  <div className="kodata-feature__icon"><FaProjectDiagram /></div>
                  <h3>{k.offers.projects.title}</h3>
                  <p>{k.offers.projects.desc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* En savoir plus */}
          <div className="kodata-more">
            <p>{k.more}</p>
            <a href="https://kodata-community.org" target="_blank" rel="noopener noreferrer" className="kodata-more__link">
              kodata-community.org <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
