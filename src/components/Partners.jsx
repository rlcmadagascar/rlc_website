import { useLang } from "../context/LangContext";
import "./Partners.css";

const logos = [
  { src: "/logo_unisa.webp", alt: "UNISA - University of South Africa" },
  { src: "/log_yc.webp", alt: "YC" },
  { src: "/logo_musea.webp", alt: "MUSEA - Madagascar United States Exchange Alumni" },
];

export default function Partners() {
  const { t } = useLang();

  return (
    <section className="partners">
      <div className="container">
        <h2 className="section-title">{t.partners.title}</h2>
        <div className="partners__track-wrapper">
          <div className="partners__track">
            {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
              <div className="partners__logo" key={i}>
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
