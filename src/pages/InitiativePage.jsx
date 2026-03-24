import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import {
  FaSeedling, FaGraduationCap, FaHandshake,
  FaRecycle, FaWater, FaLightbulb,
  FaArrowLeft, FaUser, FaCalendarAlt, FaMapMarkerAlt,
} from "react-icons/fa";
import "./InitiativePage.css";

const iconMap = {
  seedling: FaSeedling,
  graduation: FaGraduationCap,
  handshake: FaHandshake,
  recycle: FaRecycle,
  water: FaWater,
  lightbulb: FaLightbulb,
};

const iconColors = ["#009dea","#003d6b","#28a745","#fd7e14","#17a2b8","#f0c040"];

export default function InitiativePage() {
  const { index } = useParams();
  const { t } = useLang();
  const p = t.alumniPage;
  const i = parseInt(index, 10);
  const item = p.initiatives[i];

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="init-page__not-found">
          <p>Initiative introuvable.</p>
          <Link to="/alumni" className="init-page__back">← {t.alumniPage.backLabel || "Retour"}</Link>
        </div>
        <Footer />
      </>
    );
  }

  const Icon = iconMap[item.icon] || FaSeedling;
  const color = iconColors[i % iconColors.length];

  return (
    <>
      <SEOHead
        title={item.title}
        description={item.excerpt || `Initiative alumni RLC Madagascar — ${item.title}. Par ${item.alumni}, ${item.year}.`}
        url={`/alumni/${index}`}
        image={item.image || "/group_photo.jpg"}
        type="article"
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="init-page">

        {/* Hero */}
        <div className="init-page__hero" style={{ "--accent": color }}>
          <div className="init-page__hero-inner">
            <div className="init-page__hero-icon" style={{ background: color + "22", color }}>
              <Icon />
            </div>
            <h1>{item.title}</h1>
            <div className="init-page__hero-meta">
              <span><FaUser /> {item.alumni}</span>
              <span><FaCalendarAlt /> {item.year}</span>
              <span><FaMapMarkerAlt /> {item.tags[0]}</span>
            </div>
          </div>
          <div className="init-page__hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
            </svg>
          </div>
        </div>

        <div className="init-page__container">

          <Link to="/alumni" className="init-page__back">
            <FaArrowLeft /> {t.alumniPage.backLabel || "Retour aux initiatives"}
          </Link>

          <div className="init-page__grid">

            {/* Main content */}
            <div className="init-page__content">
              <h2>{t.alumniPage.aboutInitiative || "À propos de l'initiative"}</h2>
              <p>{item.description}</p>
              <p>{item.details || item.description}</p>
            </div>

            {/* Sidebar */}
            <aside className="init-page__sidebar">
              <div className="init-page__info-card">
                <h3>{t.alumniPage.infoLabel || "Informations"}</h3>
                <ul>
                  <li>
                    <span className="init-page__info-label"><FaUser /> {t.alumniPage.alumniLabel || "Alumni"}</span>
                    <span>{item.alumni}</span>
                  </li>
                  <li>
                    <span className="init-page__info-label"><FaCalendarAlt /> {t.alumniPage.yearLabel || "Année"}</span>
                    <span>{item.year}</span>
                  </li>
                  <li>
                    <span className="init-page__info-label"><FaMapMarkerAlt /> {t.alumniPage.regionLabel || "Région"}</span>
                    <span>{item.tags[0]}</span>
                  </li>
                </ul>
                <div className="init-page__tags">
                  {item.tags.map((tag, j) => (
                    <span className="init-page__tag" key={j}>{tag}</span>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
