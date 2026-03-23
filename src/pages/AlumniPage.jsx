import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaSeedling,
  FaGraduationCap,
  FaHandshake,
  FaRecycle,
  FaWater,
  FaLightbulb,
} from "react-icons/fa";
import "./AlumniPage.css";

const iconMap = {
  seedling: FaSeedling,
  graduation: FaGraduationCap,
  handshake: FaHandshake,
  recycle: FaRecycle,
  water: FaWater,
  lightbulb: FaLightbulb,
};

const iconColors = [
  "#009dea",
  "#003d6b",
  "#28a745",
  "#fd7e14",
  "#17a2b8",
  "#f0c040",
];

export default function AlumniPage() {
  const { t } = useLang();
  const p = t.alumniPage;

  return (
    <>
      <Navbar />
      <main className="alumni-page">

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
            <div className="alumni-page__initiatives-grid">
              {p.initiatives.map((item, i) => {
                const Icon = iconMap[item.icon] || FaSeedling;
                const color = iconColors[i % iconColors.length];
                return (
                  <Link to={`/alumni/${i}`} className="alumni-page__initiative-card" key={i}>
                    <div
                      className="alumni-page__initiative-icon"
                      style={{ backgroundColor: color + "1a", color }}
                    >
                      <Icon />
                    </div>
                    <h3 className="alumni-page__initiative-title">{item.title}</h3>
                    <p className="alumni-page__initiative-desc">{item.description}</p>
                    <div className="alumni-page__initiative-tags">
                      {item.tags.map((tag, j) => (
                        <span className="alumni-page__tag" key={j}>{tag}</span>
                      ))}
                    </div>
                    <div className="alumni-page__initiative-footer">
                      <span className="alumni-page__initiative-alumni">{item.alumni}</span>
                      <span className="alumni-page__initiative-year">{item.year}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="alumni-page__section alumni-page__section--white">
          <div className="alumni-page__container">
            <h2 className="alumni-page__section-title">{p.testimonialsTitle}</h2>
            <div className="alumni-page__divider" />
            <div className="alumni-page__testimonials-grid">
              {p.testimonials.map((item, i) => (
                <div className="alumni-page__testimonial-card" key={i}>
                  <div className="alumni-page__testimonial-quote-mark">&ldquo;</div>
                  <p className="alumni-page__testimonial-text">{item.quote}</p>
                  <div className="alumni-page__testimonial-author">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="alumni-page__testimonial-avatar"
                    />
                    <div className="alumni-page__testimonial-info">
                      <span className="alumni-page__testimonial-name">{item.name}</span>
                      <span className="alumni-page__testimonial-meta">
                        {item.cohort} &middot; {item.region}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
