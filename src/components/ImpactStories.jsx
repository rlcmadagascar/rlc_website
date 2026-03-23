import { useLang } from "../context/LangContext";
import "./ImpactStories.css";

export default function ImpactStories() {
  const { t } = useLang();

  return (
    <section className="stories" id="alumni">
      <div className="container">
        <h2 className="section-title">{t.stories.title}</h2>
        <div className="stories__grid">
          {t.stories.items.map((story, i) => (
            <article key={i} className="story-card">
              <div className="story-card__img" aria-hidden="true" />
              <div className="story-card__body">
                <time className="story-card__date">{story.date}</time>
                <h3 className="story-card__title">{story.title}</h3>
                <p className="story-card__excerpt">{story.excerpt}</p>
                <a href="#" className="story-card__link">{t.stories.readMore} →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
