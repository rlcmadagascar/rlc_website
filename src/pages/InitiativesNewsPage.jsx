import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa";
import "./InitiativesNewsPage.css";

export default function InitiativesNewsPage({ category }) {
  const { t } = useLang();
  const p = t.initiativesPage;
  const section = p[category];

  return (
    <>
      <Navbar />
      <main className="inews-page">

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

          <div className="inews-page__grid">
            {section.articles.map((article, i) => (
              <article className="inews-card" key={i}>
                <div className="inews-card__image-wrap">
                  <img src={article.image} alt={article.title} className="inews-card__image" />
                  <span className="inews-card__tag">{article.tag}</span>
                </div>
                <div className="inews-card__body">
                  <h2 className="inews-card__title">{article.title}</h2>
                  <div className="inews-card__meta">
                    <span><FaCalendarAlt /> {article.date}</span>
                    <span><FaUser /> {article.author}</span>
                  </div>
                  <p className="inews-card__excerpt">{article.excerpt}</p>
                  <button className="inews-card__cta">{p.readMore}</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
