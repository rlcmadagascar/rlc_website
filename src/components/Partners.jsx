import { useLang } from "../context/LangContext";
import "./Partners.css";

const logos = [
  { src: "/logo_unisa.webp", alt: "UNISA - University of South Africa" },
  { src: "/log_yc.webp", alt: "YC" },
  { src: "/logo_musea.webp", alt: "MUSEA - Madagascar United States Exchange Alumni" },
  { src: "/logo_access.webp", alt: "English Access Microscholarship Program" },
  { src: "/logo_awep.webp", alt: "African Women's Entrepreneurship Program" },
  { src: "/logo_beat.webp", alt: "OneBeat" },
  { src: "/logo_cee.webp", alt: "Community Engagement Exchange Program" },
  { src: "/logo_fullbright.webp", alt: "Fulbright Program" },
  { src: "/logo_humphrey.webp", alt: "Humphrey Fellowship" },
  { src: "/logo_ivlp.webp", alt: "International Visitor Leadership Program" },
  { src: "/logo_mwf.webp", alt: "Mandela Washington Fellowship" },
  { src: "/logo_susi.webp", alt: "Study of the U.S. Institutes" },
  { src: "/logo-novity.webp", alt: "Novity" },
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
                <img src={logo.src} alt={logo.alt} loading="eager" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
