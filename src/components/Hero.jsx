import { useLang } from "../context/LangContext";
import "./Hero.css";

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="home">
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1>{t.hero.title}</h1>
        <div className="hero__buttons">
<a href="#apply" className="btn btn--outline">{t.hero.apply}</a>
        </div>
      </div>
    </section>
  );
}
