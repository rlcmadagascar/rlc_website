import { useState } from "react";
import { useLang } from "../context/LangContext";
import "./Navbar.css";

export default function Navbar() {
  const { lang, toggle, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="#home" className="navbar__logo">
          <img src="/logo_rlc.png" alt="RLC Madagascar Chapter" className="navbar__logo-img" />
        </a>

        <button
          className="navbar__burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__menu ${menuOpen ? "navbar__menu--open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>{t.nav.home}</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>{t.nav.about}</a>
          <a href="#apply" onClick={() => setMenuOpen(false)}>{t.nav.apply}</a>
          <a href="#alumni" onClick={() => setMenuOpen(false)}>{t.nav.alumni}</a>
          <a href="#team" onClick={() => setMenuOpen(false)}>{t.nav.team}</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>{t.nav.gallery}</a>
          <a href="#media" onClick={() => setMenuOpen(false)}>{t.nav.media}</a>

          <button className="lang-switcher" onClick={toggle}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </nav>
      </div>
    </header>
  );
}
