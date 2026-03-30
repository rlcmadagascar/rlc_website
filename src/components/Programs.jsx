import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useLang } from "../context/LangContext";
import "./Programs.css";

const TRACK_LABELS = {
  "Business & Entrepreneuriat": "Business & Développement de l'Entrepreneuriat",
  "Leadership Civique": "Leadership Civique",
  "Management Public & Gouvernance": "Management Public & Gouvernance",
  "Education Changemaker": "Acteurs du Changement en Éducation (ECM)",
  "Wash": "Eau, Assainissement & Hygiène (WASH)",
  "Energie": "Énergie",
};

export default function Programs() {
  const { t } = useLang();
  const [items, setItems] = useState(t.programs.items);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("alumni")
        .select("track");

      if (error || !data || data.length === 0) return;

      const counts = {};
      for (const row of data) {
        if (!row.track) continue;
        const label = TRACK_LABELS[row.track] || row.track;
        counts[label] = (counts[label] || 0) + 1;
      }

      const total = data.length;
      const computed = Object.entries(counts)
        .map(([label, count]) => ({
          label,
          percent: Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.percent - a.percent);

      if (computed.length > 0) setItems(computed);
    }

    fetchStats();
  }, []);

  return (
    <section className="programs" id="apply">
      <div className="container">
        <h2 className="section-title">{t.programs.title}</h2>
        <div className="programs__list">
          {items.map((item, i) => (
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
