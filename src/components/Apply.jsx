import { useLang } from "../context/LangContext";
import "./Apply.css";

export default function Apply() {
  const { t } = useLang();
  const a = t.apply;

  return (
    <section className="apply" id="apply">
      <div className="container">
        <h2 className="section-title">{a.title}</h2>
        <p className="apply__subtitle">{a.subtitle}</p>

        <div className="apply__grid">

          {/* Who should apply */}
          <div className="apply__card">
            <h3>{a.whoTitle}</h3>
            <ul className="apply__criteria">
              {a.criteria.map((c, i) => (
                <li key={i}>
                  <span className="apply__label">{c.label}</span>
                  <span className="apply__value">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Encouraged applicants */}
          <div className="apply__card apply__card--blue">
            <h3>{a.encouragedTitle}</h3>
            <ul className="apply__encouraged">
              {a.encouraged.map((item, i) => (
                <li key={i}>
                  <span className="apply__check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={a.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="apply__btn"
            >
              {a.cta}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
