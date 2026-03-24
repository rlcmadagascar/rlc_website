import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import "./AuthPage.css";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      navigate("/profile");
    }
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError("Une erreur est survenue. Vérifiez votre email.");
    } else {
      setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
    }
    setLoading(false);
  }

  return (
    <>
      <SEOHead title="Connexion" noIndex={true} url="/auth" />
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-card__logo">
            <img src="/logo_rlc.png" alt="RLC Madagascar" />
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "auth-tab--active" : ""}`}
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
            >
              Se connecter
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "auth-tab--active" : ""}`}
              onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
            >
              S'inscrire
            </button>
          </div>

          {tab === "login" ? (
            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="auth-field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>
              <p className="auth-switch">
                Pas encore de compte ?{" "}
                <button type="button" className="auth-link" onClick={() => setTab("register")}>
                  S'inscrire
                </button>
              </p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister} noValidate>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="auth-field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="Minimum 6 caractères"
                  required
                />
              </div>
              <div className="auth-field">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handle}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              {success && <p className="auth-success">{success}</p>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Création…" : "Créer mon compte"}
              </button>
              <p className="auth-switch">
                Déjà un compte ?{" "}
                <button type="button" className="auth-link" onClick={() => setTab("login")}>
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
