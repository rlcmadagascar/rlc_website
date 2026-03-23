import { useLang } from "../context/LangContext";
import "./Programs.css";

export default function Programs() {
  const { t } = useLang();

  return (
    <section className="programs" id="apply">
      <div className="container">
        <h2 className="section-title">{t.programs.title}</h2>
        <div className="programs__list">
          {t.programs.items.map((item, i) => (
            <div key={i} className="programs__item">
              <div className="programs__label">{item.label}</div>
              <div className="programs__bar-wrap">
                <div
                  className="programs__bar"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="programs__percent">{item.percent}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
