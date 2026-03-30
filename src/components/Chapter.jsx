import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";
import "./Chapter.css";

function CounterStat({ value, prefix = "", label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="chapter__stat" ref={ref}>
      <span className="chapter__stat-value">{prefix}{count}</span>
      <span className="chapter__stat-label">{label}</span>
    </div>
  );
}

export default function Chapter() {
  const { t } = useLang();
  const c = t.chapter;

  return (
    <section className="chapter" id="chapter">
      <div className="container">
        <div className="chapter__grid">
          <div className="chapter__text">
            <h2 className="section-title">{c.title}</h2>
            <p>{c.text1}</p>
            <p>{c.text2}</p>
          </div>
          <div className="chapter__image">
            <img src="/image_dakar.webp" alt="RLC Madagascar Chapter" />
          </div>
        </div>
      </div>
    </section>
  );
}
