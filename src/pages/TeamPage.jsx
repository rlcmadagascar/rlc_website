import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaLinkedinIn } from "react-icons/fa";
import "./TeamPage.css";

export default function TeamPage() {
  const { t } = useLang();
  const p = t.teamPage;

  return (
    <>
      <Navbar />
      <main className="team-page">

        {/* HERO */}
        <div className="team-page__hero">
          <div className="team-page__hero-inner">
            <h1>{p.title}</h1>
            <p className="team-page__hero-subtitle">{p.subtitle}</p>
          </div>
          <div className="team-page__hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
            </svg>
          </div>
        </div>

        {/* LE BUREAU */}
        <section className="team-page__section team-page__section--white">
          <div className="team-page__container">
            <h2 className="team-page__section-title">{p.bureauTitle}</h2>
            <div className="team-page__divider" />
            <div className="team-page__bureau-row">
              {p.bureau.map((member, i) => (
                <div className="team-page__bureau-card" key={i}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="team-page__bureau-avatar"
                  />
                  <h3 className="team-page__bureau-name">{member.name}</h3>
                  <span className="team-page__bureau-role">{member.role}</span>
                  <a
                    href={member.linkedin}
                    className="team-page__linkedin-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COORDINATEURS PORTFOLIO */}
        <section className="team-page__section team-page__section--light">
          <div className="team-page__container">
            <h2 className="team-page__section-title">{p.coordinatorsTitle}</h2>
            <div className="team-page__divider" />
            <div className="team-page__coordinators-grid">
              {p.coordinators.map((member, i) => (
                <div className="team-page__coordinator-card" key={i}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="team-page__coordinator-avatar"
                  />
                  <h3 className="team-page__coordinator-name">{member.name}</h3>
                  <span className="team-page__coordinator-portfolio">{member.portfolio}</span>
                  <a
                    href={member.linkedin}
                    className="team-page__linkedin-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POINTS FOCAUX */}
        <section className="team-page__section team-page__section--white">
          <div className="team-page__container">
            <h2 className="team-page__section-title">{p.focalPointsTitle}</h2>
            <div className="team-page__divider" />
            <div className="team-page__focal-grid">
              {p.focalPoints.map((member, i) => (
                <div className="team-page__focal-card" key={i}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="team-page__focal-avatar"
                  />
                  <div className="team-page__focal-info">
                    <span className="team-page__focal-name">{member.name}</span>
                    <span className="team-page__focal-region">{member.region}</span>
                    <a
                      href={member.linkedin}
                      className="team-page__linkedin-btn team-page__linkedin-btn--small"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn de ${member.name}`}
                    >
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ANCIENS CHAPTER COORDINATORS */}
        <section className="team-page__section team-page__section--light">
          <div className="team-page__container">
            <h2 className="team-page__section-title">{p.pastCoordinatorsTitle}</h2>
            <div className="team-page__divider" />
            <div className="team-page__past-grid">
              {p.pastCoordinators.map((member, i) => (
                <div className="team-page__past-card" key={i}>
                  <img src={member.avatar} alt={member.name} className="team-page__past-avatar" />
                  <div className="team-page__past-info">
                    <span className="team-page__past-name">{member.name}</span>
                    <span className="team-page__past-period">{member.period}</span>
                  </div>
                  <a href={member.linkedin} className="team-page__linkedin-btn team-page__linkedin-btn--small" target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${member.name}`}>
                    <FaLinkedinIn />
                  </a>
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
