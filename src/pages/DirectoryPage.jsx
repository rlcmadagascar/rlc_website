import { useState, useMemo, useEffect } from "react";
import { useLang } from "../context/LangContext";
import { FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./DirectoryPage.css";

const TRACK_META = {
  "Business & Entrepreneuriat":        { bg: "#e8f6fd", color: "#009dea" },
  "Leadership Civique":                { bg: "#e8fdf0", color: "#00a86b" },
  "Management Public & Gouvernance":   { bg: "#fdf4e8", color: "#f09000" },
  "Education Changemaker":             { bg: "#f3e8fd", color: "#8b00ea" },
  "Wash":                              { bg: "#e8f8fd", color: "#0099b8" },
  "Energie":                           { bg: "#fff8e8", color: "#d4a000" },
};

const LOCATION_FLAG = {
  "Afrique du Sud": "🇿🇦",
  "Sénégal": "🇸🇳",
};

export default function DirectoryPage() {
  const { t, lang } = useLang();

  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterTrack, setFilterTrack] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  useEffect(() => {
    async function fetchAlumni() {
      const { data, error } = await supabase
        .from("alumni")
        .select("*")
        .order("cohort", { ascending: true });
if (!error) setAlumni(data);
      setLoading(false);
    }
    fetchAlumni();
  }, []);

  const allTracks = useMemo(() => [...new Set(alumni.map((a) => a.track))].sort(), [alumni]);
  const allRegions = useMemo(() => [...new Set(alumni.map((a) => a.region))].sort(), [alumni]);

  const filtered = useMemo(() => {
    return alumni.filter((a) => {
      const matchSearch =
        search === "" ||
        a.name.toLowerCase().includes(search.toLowerCase());
      const matchLocation = filterLocation === "" || a.location === filterLocation;
      const matchTrack = filterTrack === "" || a.track === filterTrack;
      const matchRegion = filterRegion === "" || a.region === filterRegion;
      return matchSearch && matchLocation && matchTrack && matchRegion;
    });
  }, [search, filterLocation, filterTrack, filterRegion, alumni]);

  function resetFilters() {
    setSearch("");
    setFilterLocation("");
    setFilterTrack("");
    setFilterRegion("");
  }

  const hasActiveFilter =
    search !== "" ||
    filterLocation !== "" ||
    filterTrack !== "" ||
    filterRegion !== "";

  return (
    <>
      <Navbar />
      <main className="dir-page">

        {/* Hero */}
        <div className="dir-page__hero">
          <div className="dir-page__hero-overlay">
            <h1>{lang === "en" ? "Alumni Directory" : "Annuaire des Alumni"}</h1>
            <p className="dir-page__hero-sub">
              {lang === "en"
                ? "Discover the RLC Madagascar Chapter alumni community"
                : "Découvrez la communauté des alumni du RLC Madagascar Chapter"}
            </p>
          </div>
        </div>

        <div className="dir-page__container">

          {/* Filter bar */}
          <div className="dir-page__filters">
            <div className="dir-page__search-wrap">
              <svg className="dir-page__search-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="#009dea" strokeWidth="1.8" />
                <path d="M13 13l3.5 3.5" stroke="#009dea" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                className="dir-page__search"
                type="text"
                placeholder={lang === "en" ? "Search by name…" : "Rechercher par nom…"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="dir-page__select"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">{lang === "en" ? "Regional Leadership Center" : "Centre Régional de Leadership"}</option>
              <option value="Sénégal">🇸🇳 {lang === "en" ? "Senegal" : "Sénégal"}</option>
              <option value="Afrique du Sud">🇿🇦 {lang === "en" ? "South Africa" : "Afrique du Sud"}</option>
            </select>

            <select
              className="dir-page__select"
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
            >
              <option value="">{lang === "en" ? "All tracks" : "Tous les parcours"}</option>
              {allTracks.map((tr) => (
                <option key={tr} value={tr}>{tr}</option>
              ))}
            </select>

            <select
              className="dir-page__select"
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="">{lang === "en" ? "All regions" : "Toutes les régions"}</option>
              {allRegions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {hasActiveFilter && (
              <button className="dir-page__reset" onClick={resetFilters}>
                {lang === "en" ? "Reset filters" : "Réinitialiser les filtres"}
              </button>
            )}
          </div>

          {/* Result count */}
          {!loading && (
            <p className="dir-page__count">
              {lang === "en"
                ? `${filtered.length} alumni found`
                : `${filtered.length} alumni trouvé${filtered.length > 1 ? "s" : ""}`}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="dir-page__empty"><p>Chargement…</p></div>
          ) : filtered.length > 0 ? (
            <div className="dir-page__grid">
              {filtered.map((alumni) => {
                const trackStyle = TRACK_META[alumni.track] || {};
                const flag = LOCATION_FLAG[alumni.location] || "";
                return (
                  <div className="dir-card" key={alumni.id}>
                    <div className="dir-card__top">
                      <img
                        className="dir-card__avatar"
                        src={alumni.avatar}
                        alt={alumni.name}
                        loading="lazy"
                      />
                      <div className="dir-card__info">
                        <h3 className="dir-card__name">{alumni.name}</h3>
                        <span className="dir-card__cohort">{alumni.cohort}</span>
                      </div>
                    </div>

                    <span
                      className="dir-card__track-badge"
                      style={{ background: trackStyle.bg, color: trackStyle.color }}
                    >
                      {alumni.track}
                    </span>

                    <div className="dir-card__details">
                      <div className="dir-card__detail-row">
                        <svg viewBox="0 0 16 16" fill="none" className="dir-card__icon">
                          <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.4" />
                          <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                        <span>{alumni.region}</span>
                      </div>
                      <div className="dir-card__detail-row">
                        <span className="dir-card__flag">{flag}</span>
                        <span>{alumni.location}</span>
                      </div>
                    </div>

                    <div className="dir-card__divider" />

                    <div className="dir-card__footer">
                      <div className="dir-card__position">
                        <strong>{alumni.position}</strong>
                        <span>{alumni.organization}</span>
                      </div>
                      {alumni.linkedin && (
                        <a
                          href={alumni.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dir-card__linkedin"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dir-page__empty">
              <p>Aucun alumni ne correspond à votre recherche.</p>
              <button className="dir-page__reset" onClick={resetFilters}>
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
