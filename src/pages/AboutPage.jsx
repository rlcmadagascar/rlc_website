import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import {
  FaLaptop, FaUsers, FaHandshake, FaPeopleArrows,
  FaSeedling, FaToolbox,
} from "react-icons/fa";
import "./AboutPage.css";

const featureIcons = [FaLaptop, FaUsers, FaHandshake, FaPeopleArrows, FaSeedling, FaToolbox];

export default function AboutPage() {
  const { t } = useLang();
  const c = t.aboutPage;

  return (
    <>
      <SEOHead
        title="À Propos"
        description="Découvrez le RLC Madagascar Chapter — alumni du YALI Regional Leadership Center Southern Africa. Un réseau de jeunes leaders engagés pour le développement, l'entrepreneuriat et la gouvernance à Madagascar."
        url="/about"
        image="/group_photo.jpg"
      />
      <Navbar />
      <main className="about-page">

        {/* Hero image */}
        <div className="about-page__hero">
          <img src="/group_photo.jpg" alt="RLC Southern Africa" />
          <div className="about-page__hero-overlay">
            <h1>{c.title}</h1>
          </div>
        </div>

        <div className="about-page__container">

          {/* Our Story */}
          <section className="about-page__section about-page__section--row">
            <div className="about-page__section-text">
              <h2>{c.story.title}</h2>
              <div className="about-page__divider" />
              <p>{c.story.text}</p>
            </div>
            <div className="about-page__section-image">
              <img src="/photo-expo.jpg" alt="YALI Expo" />
            </div>
          </section>

          {/* Online training */}
          <section className="about-page__section">
            <h2>{c.online.title}</h2>
            <div className="about-page__divider" />
            <p>{c.online.text}</p>
          </section>

          {/* Goals */}
          <section className="about-page__section">
            <h2>{c.goals.title}</h2>
            <div className="about-page__divider" />
            <p>{c.goals.text}</p>
          </section>

          {/* Feature cards */}
          <section className="about-page__section">
            <h2>{c.features.title}</h2>
            <div className="about-page__divider" />
            <div className="about-page__cards">
              {c.features.items.map((item, i) => {
                const Icon = featureIcons[i] || FaToolbox;
                return (
                  <div className="about-page__card" key={i}>
                    <div className="about-page__card-icon">
                      <Icon />
                    </div>
                    <p>{item}</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
