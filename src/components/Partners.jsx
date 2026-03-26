import { useLang } from "../context/LangContext";
import "./Partners.css";

const logos = [
  { src: "/logo_unisa.webp", alt: "UNISA - University of South Africa" },
  { src: "/log_yc.webp", alt: "YC" },
  { src: "/logo_musea.webp", alt: "MUSEA - Madagascar United States Exchange Alumni" },
  { src: "/logo_access.JPG", alt: "English Access Microscholarship Program" },
  { src: "/logo_awep.JPG", alt: "African Women's Entrepreneurship Program" },
  { src: "/logo_beat.JPG", alt: "OneBeat" },
  { src: "/logo_cee.JPG", alt: "Community Engagement Exchange Program" },
  { src: "/logo_fullbright.JPG", alt: "Fulbright Program" },
  { src: "/logo_humphrey.JPG", alt: "Humphrey Fellowship" },
  { src: "/logo_ivlp.JPG", alt: "International Visitor Leadership Program" },
  { src: "/logo_mwf.JPG", alt: "Mandela Washington Fellowship" },
  { src: "/logo_susi.JPG", alt: "Study of the U.S. Institutes" },
  { src: "/logo-novity.png", alt: "Novity" },
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
