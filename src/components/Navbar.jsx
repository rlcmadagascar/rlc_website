import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";
import { FaChevronDown, FaGlobe } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const { lang, toggle, t } = useLang();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [initiativesOpen, setInitiativesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const userMenuRef = useRef(null);
  const initiativesTriggerRef = useRef(null);
  const initiativesMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setUserMenuOpen(false);
  }

  async function handleSignOut() {
    closeAll();
    await signOut();
    navigate("/");
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";

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
              ref={initiativesTriggerRef}
              className="navbar__dropdown-trigger"
              onClick={() => setInitiativesOpen((o) => !o)}
              aria-expanded={initiativesOpen}
              aria-haspopup="true"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setInitiativesOpen(true);
                  initiativesMenuRef.current?.querySelector("a")?.focus();
                }
                if (e.key === "Escape" && initiativesOpen) {
                  setInitiativesOpen(false);
                }
              }}
            >
              {t.nav.initiatives} <FaChevronDown className="navbar__dropdown-icon" />
            </button>
            <div
              ref={initiativesMenuRef}
              className="navbar__dropdown-menu"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setInitiativesOpen(false);
                  initiativesTriggerRef.current?.focus();
                }
              }}
            >
              <Link to="/initiatives/spotlight" onClick={closeAll}>Alumni Initiative Spotlight</Link>
              <Link to="/initiatives/fireside" onClick={closeAll}>Fireside Chat</Link>
              <Link to="/initiatives/autres" onClick={closeAll}>{t.nav.autresInitiatives}</Link>
            </div>
          </div>

          <Link to="/team" onClick={closeAll}>{t.nav.team}</Link>
          <Link to="/directory" onClick={closeAll} className="navbar__directory-link">{t.nav.media}</Link>

          <button className="lang-switcher" onClick={toggle} aria-label="Changer de langue" title={lang === "fr" ? "Switch to English" : "Passer en français"}>
            <FaGlobe />
            <span>{lang === "fr" ? "EN" : "FR"}</span>
          </button>

          {/* Auth */}
          {user ? (
            <div className="navbar__user" ref={userMenuRef}>
              <button
                className="navbar__user-avatar"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-label="Menu utilisateur"
              >
                {userInitial}
              </button>
              {userMenuOpen && (
                <div className="navbar__user-menu">
                  <Link to="/profile" onClick={closeAll}>Mon profil</Link>
                  <button onClick={handleSignOut}>Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" onClick={closeAll} className="navbar__auth-btn">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
