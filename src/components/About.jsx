import { useLang } from "../context/LangContext";
import "./About.css";

export default function About() {
  const { t } = useLang();

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__text">
            <h2 className="section-title">{t.about.title}</h2>
            <p>{t.about.text}</p>
            <p>{t.about.program}</p>
          </div>
          <div className="about__image">
            <img src="/group_photo.webp" alt="YALI RLC Southern Africa" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
