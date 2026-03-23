import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { FaChevronDown } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const { lang, toggle, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [initiativesOpen, setInitiativesOpen] = useState(false);
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

  function closeAll() {
    setMenuOpen(false);
    setInitiativesOpen(false);
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
          <Link to="/about" onClick={closeAll}>{t.nav.about}</Link>
          <Link to="/apply" onClick={closeAll}>{t.nav.apply}</Link>
          <Link to="/alumni" onClick={closeAll}>{t.nav.alumni}</Link>

          {/* Dropdown Nos Initiatives */}
          <div className={`navbar__dropdown ${initiativesOpen ? "navbar__dropdown--open" : ""}`}>
            <button
              className="navbar__dropdown-trigger"
              onClick={() => setInitiativesOpen((o) => !o)}
              aria-expanded={initiativesOpen}
            >
              {t.nav.initiatives} <FaChevronDown className="navbar__dropdown-icon" />
            </button>
            <div className="navbar__dropdown-menu">
              <Link to="/initiatives/spotlight" onClick={closeAll}>Alumni Initiative Spotlight</Link>
              <Link to="/initiatives/fireside" onClick={closeAll}>Fireside Chat</Link>
              <Link to="/initiatives/autres" onClick={closeAll}>{t.nav.autresInitiatives}</Link>
            </div>
          </div>

          <Link to="/team" onClick={closeAll}>{t.nav.team}</Link>
          <Link to="/directory" onClick={closeAll} className="navbar__directory-link">{t.nav.media}</Link>

          <button className="lang-switcher" onClick={toggle}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </nav>
      </div>
    </header>
  );
}
