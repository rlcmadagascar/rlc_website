import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { supabase } from "../lib/supabase";
import { isSafeAvatarUrl } from "../lib/sanitize";
import "./ImpactStories.css";

export default function ImpactStories() {
  const { t } = useLang();
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setTestimonials(data); });
  }, []);

  function prev() { setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); }
  function next() { setCurrent((c) => (c + 1) % testimonials.length); }

  return (
    <section className="stories" id="alumni">
      <div className="container">
        <h2 className="section-title">{t.stories.title}</h2>

        {testimonials.length === 0 ? (
          <p className="stories__empty">Les témoignages des alumni apparaîtront ici.</p>
        ) : (
          <div className="stories__carousel">
            <button className="stories__nav stories__nav--prev" onClick={prev} aria-label="Précédent">‹</button>

            <div className="stories__slide">
              <div className="stories__quote-mark">&ldquo;</div>
              <p className="stories__quote-text">{testimonials[current].quote}</p>
              <div className="stories__author">
                {isSafeAvatarUrl(testimonials[current].avatar)
                  ? <img src={testimonials[current].avatar} alt={testimonials[current].name} className="stories__avatar" />
                  : <div className="stories__avatar stories__avatar--placeholder">👤</div>
                }
                <div className="stories__author-info">
                  <span className="stories__author-name">{testimonials[current].name ?? "Alumni RLC"}</span>
                  <span className="stories__author-meta">
                    {[testimonials[current].cohort, testimonials[current].region].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </div>
            </div>

            <button className="stories__nav stories__nav--next" onClick={next} aria-label="Suivant">›</button>

            <div className="stories__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`stories__dot ${i === current ? "stories__dot--active" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="stories__cta">
          <Link to="/alumni" className="stories__cta-btn">{t.stories.readMore} →</Link>
        </div>
      </div>
    </section>
  );
}
