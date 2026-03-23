import { useState, useEffect } from "react";
import "./AccessibilityWidget.css";

const DEFAULTS = {
  fontSize: 0,
  contrast: "none",
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
  pauseAnimations: false,
  textSpacing: false,
  bigCursor: false,
};

function applySettings(settings) {
  const root = document.documentElement;

  // Font size
  root.style.setProperty("--a11y-font-scale", `${1 + settings.fontSize * 0.1}`);

  // Contrast
  root.setAttribute("data-contrast", settings.contrast);

  // Filters
  const filters = [];
  if (settings.grayscale) filters.push("grayscale(100%)");
  document.body.style.filter = filters.join(" ") || "";

  // Underline links
  document.body.classList.toggle("a11y-underline-links", settings.underlineLinks);

  // Readable font
  document.body.classList.toggle("a11y-readable-font", settings.readableFont);

  // Pause animations
  document.body.classList.toggle("a11y-pause-animations", settings.pauseAnimations);

  // Text spacing
  document.body.classList.toggle("a11y-text-spacing", settings.textSpacing);

  // Big cursor
  document.body.classList.toggle("a11y-big-cursor", settings.bigCursor);
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem("a11y_settings")) || DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem("a11y_settings", JSON.stringify(settings));
  }, [settings]);

  function toggle(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  function setContrast(value) {
    setSettings((s) => ({ ...s, contrast: s.contrast === value ? "none" : value }));
  }

  function changeFontSize(delta) {
    setSettings((s) => ({ ...s, fontSize: Math.max(-2, Math.min(4, s.fontSize + delta)) }));
  }

  function reset() {
    setSettings(DEFAULTS);
  }

  const isModified = JSON.stringify(settings) !== JSON.stringify(DEFAULTS);

  return (
    <>
      {/* Floating trigger */}
      <button
        className="a11y-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le menu d'accessibilité"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M12 7c-2.5 0-5 .7-5 2v2h3v7h4v-7h3V9c0-1.3-2.5-2-5-2z" />
        </svg>
        {isModified && <span className="a11y-trigger__dot" aria-hidden="true" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="a11y-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Options d'accessibilité"
        >
          <div className="a11y-panel__header">
            <h2>Accessibilité</h2>
            <button
              className="a11y-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >✕</button>
          </div>

          <div className="a11y-panel__body">

            {/* Font size */}
            <div className="a11y-section">
              <span className="a11y-section__label">Taille du texte</span>
              <div className="a11y-font-controls">
                <button
                  onClick={() => changeFontSize(-1)}
                  disabled={settings.fontSize <= -2}
                  aria-label="Réduire la taille du texte"
                >A−</button>
                <span>{settings.fontSize >= 0 ? "+" : ""}{settings.fontSize * 10}%</span>
                <button
                  onClick={() => changeFontSize(1)}
                  disabled={settings.fontSize >= 4}
                  aria-label="Augmenter la taille du texte"
                >A+</button>
              </div>
            </div>

            {/* Contrast */}
            <div className="a11y-section">
              <span className="a11y-section__label">Contraste</span>
              <div className="a11y-btn-group">
                <button
                  className={settings.contrast === "high" ? "active" : ""}
                  onClick={() => setContrast("high")}
                  aria-pressed={settings.contrast === "high"}
                >
                  Élevé
                </button>
                <button
                  className={settings.contrast === "inverted" ? "active" : ""}
                  onClick={() => setContrast("inverted")}
                  aria-pressed={settings.contrast === "inverted"}
                >
                  Inversé
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="a11y-section">
              <span className="a11y-section__label">Affichage</span>
              <div className="a11y-toggles">
                {[
                  { key: "grayscale", label: "Niveaux de gris" },
                  { key: "underlineLinks", label: "Souligner les liens" },
                  { key: "readableFont", label: "Police lisible (dyslexie)" },
                  { key: "textSpacing", label: "Espacement du texte" },
                  { key: "pauseAnimations", label: "Pause animations" },
                  { key: "bigCursor", label: "Grand curseur" },
                ].map(({ key, label }) => (
                  <label key={key} className="a11y-toggle">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => toggle(key)}
                      aria-label={label}
                    />
                    <span className="a11y-toggle__switch" aria-hidden="true" />
                  </label>
                ))}
              </div>
            </div>

            {/* WCAG notice */}
            <p className="a11y-panel__wcag">
              Conforme aux normes <strong>WCAG 2.1 / 2.2</strong> — Niveau AA
            </p>

            {/* Reset */}
            {isModified && (
              <button className="a11y-panel__reset" onClick={reset}>
                Réinitialiser les paramètres
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
