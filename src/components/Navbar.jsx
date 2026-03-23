import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import "./Navbar.css";

export default function Navbar() {
  const { lang, toggle, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  function handleHashLink(hash) {
    setMenuOpen(false);
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src="/logo_rlc.png" alt="RLC Madagascar Chapter" className="navbar__logo-img" />
        </Link>

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
          <a href="#home" onClick={(e) => { e.preventDefault(); handleHashLink("#home"); }}>{t.nav.home}</a>
          <Link to="/about" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link>
          <Link to="/apply" onClick={() => setMenuOpen(false)}>{t.nav.apply}</Link>
          <Link to="/alumni" onClick={() => setMenuOpen(false)}>{t.nav.alumni}</Link>
          <a href="#team" onClick={(e) => { e.preventDefault(); handleHashLink("#team"); }}>{t.nav.team}</a>
          <a href="#gallery" onClick={(e) => { e.preventDefault(); handleHashLink("#gallery"); }}>{t.nav.gallery}</a>
          <Link to="/directory" onClick={() => setMenuOpen(false)} className="navbar__directory-link">{t.nav.media}</Link>

          <button className="lang-switcher" onClick={toggle}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </nav>
      </div>
    </header>
  );
}
