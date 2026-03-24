import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import "./AuthPage.css";

export default function AuthPage() {
  // tab: "login" | "register" | "forgot" | "recovery"
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Supabase envoie un lien de récupération qui redirige ici avec #type=recovery
  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) {
      setTab("recovery");
    }
  }, []);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function switchTab(t) {
    setTab(t);
    setError("");
    setSuccess("");
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
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
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

  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: window.location.origin + "/auth",
    });
    if (error) {
      setError("Erreur lors de l'envoi. Vérifiez votre email.");
    } else {
      setSuccess("Email envoyé ! Consultez votre boîte mail pour réinitialiser votre mot de passe.");
    }
    setLoading(false);
  }

  async function handleRecovery(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: form.password });
    if (error) {
      setError("Erreur lors de la mise à jour. Réessayez depuis le lien reçu par email.");
    } else {
      setSuccess("Mot de passe mis à jour ! Vous allez être redirigé…");
      window.history.replaceState(null, "", "/auth");
      setTimeout(() => navigate("/profile"), 1800);
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

          {/* ── TABS login / register ── */}
          {(tab === "login" || tab === "register") && (
            <>
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${tab === "login" ? "auth-tab--active" : ""}`}
                  onClick={() => switchTab("login")}
                >
                  Se connecter
                </button>
                <button
                  className={`auth-tab ${tab === "register" ? "auth-tab--active" : ""}`}
                  onClick={() => switchTab("register")}
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
                    <button
                      type="button"
                      className="auth-forgot"
                      onClick={() => switchTab("forgot")}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  {error && <p className="auth-error">{error}</p>}
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? "Connexion…" : "Se connecter"}
                  </button>
                  <p className="auth-switch">
                    Pas encore de compte ?{" "}
                    <button type="button" className="auth-link" onClick={() => switchTab("register")}>
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
                      placeholder="Minimum 8 caractères"
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
                    <button type="button" className="auth-link" onClick={() => switchTab("login")}>
                      Se connecter
                    </button>
                  </p>
                </form>
              )}
            </>
          )}

          {/* ── MOT DE PASSE OUBLIÉ ── */}
          {tab === "forgot" && (
            <div className="auth-flow">
              <h2 className="auth-flow__title">Mot de passe oublié</h2>
              <p className="auth-flow__desc">
                Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
              <form className="auth-form" onSubmit={handleForgot} noValidate>
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
                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}
                {!success && (
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? "Envoi…" : "Envoyer le lien"}
                  </button>
                )}
                <p className="auth-switch">
                  <button type="button" className="auth-link" onClick={() => switchTab("login")}>
                    ← Retour à la connexion
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* ── NOUVEAU MOT DE PASSE (depuis le lien email) ── */}
          {tab === "recovery" && (
            <div className="auth-flow">
              <h2 className="auth-flow__title">Nouveau mot de passe</h2>
              <p className="auth-flow__desc">Choisissez un nouveau mot de passe pour votre compte.</p>
              <form className="auth-form" onSubmit={handleRecovery} noValidate>
                <div className="auth-field">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handle}
                    placeholder="Minimum 8 caractères"
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
                {!success && (
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? "Mise à jour…" : "Enregistrer le mot de passe"}
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
