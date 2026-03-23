import { useLang } from "../context/LangContext";
import "./Partners.css";

export default function Partners() {
  const { t } = useLang();

  return (
    <section className="partners">
      <div className="container">
        <h2 className="section-title">{t.partners.title}</h2>
        <div className="partners__grid">
          <div className="partners__logo">
            <img src="/logo_unisa.jpg" alt="UNISA - University of South Africa" />
          </div>
        </div>
      </div>
    </section>
  );
}
