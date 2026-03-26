import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { isSafeAvatarUrl, validateImageFile, compressImage } from "../lib/sanitize";
import { translateTexts } from "../lib/translate";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import ImageCropper from "../components/ImageCropper";
import "./ProfilePage.css";

const TRACKS = [
  "Business & Entrepreneuriat", "Leadership Civique",
  "Management Public & Gouvernance", "Education Changemaker", "Wash", "Energie",
];

const REGIONS = [
  "Analamanga", "Vakinankaratra", "Itasy", "Bongolava",
  "Matsiatra Ambony", "Amoron'i Mania", "Vatovavy", "Fitovinany",
  "Atsimo-Atsinanana", "Atsinanana", "Analanjirofo", "Alaotra-Mangoro",
  "Boeny", "Sofia", "Betsiboka", "Melaky",
  "Atsimo-Andrefana", "Androy", "Anosy", "Menabe", "Diana", "Sava",
];

const SECTORS = [
  "Agriculture & Agroalimentaire", "Arts & Culture", "Commerce & Entrepreneuriat",
  "Éducation & Formation", "Environnement & Développement durable",
  "Finance & Microfinance", "Gouvernance & Politiques publiques",
  "Industrie & Manufacture", "Santé & Bien-être", "Société civile & ONG",
  "Technologies & Innovation", "Tourisme", "WASH (Eau, Assainissement, Hygiène)", "Autre",
];

const TABS = [
  { key: "profil",    label: "Mon profil" },
  { key: "annuaire",  label: "S'inscrire dans l'annuaire" },
  { key: "initiatives", label: "Mes initiatives" },
  { key: "temoignages", label: "Témoignages" },
];

const emptyInitiative = { title: "", sector: "", region: "", tag: "", excerpt: "", description: "" };
const emptyTestimonial = { quote: "" };
const emptyTeamMember = { category: "bureau", name: "", role: "", role_en: "", portfolio: "", portfolio_en: "", region: "", period: "", avatar: "", linkedin: "", sort_order: 0 };
const emptyArticle = { category: "spotlight", title_fr: "", title_en: "", date: "", author: "RLC Madagascar Chapter", tag_fr: "", tag_en: "", image_url: "", excerpt_fr: "", excerpt_en: "", published: true, sort_order: 0 };
const emptyActualite = { title: "", content: "", image: "", published_at: new Date().toISOString().slice(0, 10), link: "", published: true };

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.app_metadata?.role === 'admin';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profil");
  const [loading, setLoading] = useState(true);
  const [alumniRecord, setAlumniRecord] = useState(null);

  // Mon profil
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Annuaire
  const [annuaire, setAnnuaire] = useState({
    cohort_type: "", cohort_number: "", location: "", region: "", track: "", position: "", organization: "", email: "", phone: "",
  });
  const [annuaireSaving, setAnnuaireSaving] = useState(false);
  const [annuaireMsg, setAnnuaireMsg] = useState("");

  // Initiatives
  const [initiative, setInitiative] = useState(emptyInitiative);
  const [initiativeImage, setInitiativeImage] = useState(null);
  const [initiativeImagePreview, setInitiativeImagePreview] = useState(null);
  const [initiatives, setInitiatives] = useState([]);
  const [initiativeSaving, setInitiativeSaving] = useState(false);
  const [initiativeMsg, setInitiativeMsg] = useState("");

  // Témoignages
  const [testimonial, setTestimonial] = useState(emptyTestimonial);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [testimonialMsg, setTestimonialMsg] = useState("");

  // Mot de passe
  const [pwForm, setPwForm] = useState({ newPwd: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  // Administration
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamForm, setTeamForm] = useState(emptyTeamMember);
  const [teamEditing, setTeamEditing] = useState(null);
  const [teamPhotoFile, setTeamPhotoFile] = useState(null);
  const [teamCropSrc, setTeamCropSrc] = useState(null);
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamMsg, setTeamMsg] = useState("");

  // Admin — sous-navigation
  const [adminSection, setAdminSection] = useState("equipe");

  // Admin — Articles
  const [articles, setArticles] = useState([]);
  const [articleForm, setArticleForm] = useState(emptyArticle);
  const [articleEditing, setArticleEditing] = useState(null);
  const [articleImageFile, setArticleImageFile] = useState(null);
  const [articleCropSrc, setArticleCropSrc] = useState(null);
  const [articleSaving, setArticleSaving] = useState(false);
  const [articleMsg, setArticleMsg] = useState("");

  // Admin — Actualités
  const [actualites, setActualites] = useState([]);
  const [actualiteForm, setActualiteForm] = useState(emptyActualite);
  const [actualiteEditing, setActualiteEditing] = useState(null);
  const [actualiteImageFile, setActualiteImageFile] = useState(null);
  const [actualiteSaving, setActualiteSaving] = useState(false);
  const [actualiteMsg, setActualiteMsg] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchAll();
    if (isAdmin) { fetchTeam(); fetchArticles(); fetchActualites(); }
  }, [user]);

  async function fetchAll() {
    const [{ data: alumni }, { data: init }, { data: testi }] = await Promise.all([
      supabase.from("alumni").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("initiatives").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("testimonials").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (alumni) {
      setAlumniRecord(alumni);
      setName(alumni.name || "");
      setLinkedin(alumni.linkedin || "");
      setPhotoPreview(alumni.avatar || null);
      const [type, ...rest] = (alumni.cohort || "").split(" ");
      setAnnuaire({
        cohort_type: type || "",
        cohort_number: rest.join(" ") || "",
        location: alumni.location || "",
        region: alumni.region || "",
        track: alumni.track || "",
        position: alumni.position || "",
        organization: alumni.organization || "",
        email: alumni.email || "",
        phone: alumni.phone || "",
      });
    }
    if (init) setInitiatives(init);
    if (testi) setTestimonials(testi);
    setLoading(false);
  }

  function switchTab(key) {
    setActiveTab(key);
    setSearchParams({ tab: key });
    setProfileMsg(""); setAnnuaireMsg(""); setInitiativeMsg(""); setTestimonialMsg("");
  }

  // --- Upload helpers ---
  async function uploadFile(file, path, bucket = "avatars") {
    const validationError = await validateImageFile(file);
    if (validationError) throw new Error(validationError);
    const isAvatar = bucket === "avatars";
    const compressed = await compressImage(file, {
      maxWidth:  isAvatar ? 400 : 1200,
      maxHeight: isAvatar ? 400 : 900,
      quality: 0.85,
    });
    const filePath = `${path}/${Date.now()}.webp`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, compressed, { upsert: true });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
  }

  // --- Mon profil ---
  async function saveProfile(e) {
    e.preventDefault();
    setProfileSaving(true); setProfileMsg("");
    try {
      const avatarUrl = photoFile ? await uploadFile(photoFile, "alumni") : null;
      const payload = {
        user_id: user.id,
        name,
        linkedin,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      };
      if (alumniRecord) {
        await supabase.from("alumni").update(payload).eq("id", alumniRecord.id);
      } else {
        const { data } = await supabase.from("alumni")
          .insert([{ ...payload, avatar: avatarUrl ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`, in_directory: false }])
          .select().single();
        setAlumniRecord(data);
      }
      setProfileMsg("Profil enregistré !");
    } catch (err) { setProfileMsg(err.message || "Une erreur est survenue."); }
    finally { setProfileSaving(false); }
  }

  // --- Annuaire ---
  async function saveAnnuaire(e) {
    e.preventDefault();
    setAnnuaireSaving(true); setAnnuaireMsg("");
    try {
      const payload = {
        user_id: user.id,
        cohort_type: annuaire.cohort_type,
        cohort: `${annuaire.cohort_type} ${annuaire.cohort_number}`.trim(),
        location: annuaire.location,
        region: annuaire.region,
        track: annuaire.track,
        position: annuaire.position,
        organization: annuaire.organization,
        email: annuaire.email,
        phone: annuaire.phone,
        in_directory: true,
      };
      if (alumniRecord) {
        await supabase.from("alumni").update(payload).eq("id", alumniRecord.id);
        setAnnuaireMsg("Profil annuaire mis à jour !");
      } else {
        const { data } = await supabase.from("alumni")
          .insert([{ ...payload, name: name || user.email, avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}` }])
          .select().single();
        setAlumniRecord(data);
        setAnnuaireMsg("Profil créé et visible dans l'annuaire !");
      }
    } catch { setAnnuaireMsg("Une erreur est survenue."); }
    finally { setAnnuaireSaving(false); }
  }

  // --- Initiatives ---
  async function saveInitiative(e) {
    e.preventDefault();
    if (!initiative.title.trim() || !initiative.sector) return;
    setInitiativeSaving(true); setInitiativeMsg("");
    try {
      let imageUrl = "";
      if (initiativeImage) imageUrl = await uploadFile(initiativeImage, "initiatives");
      const [title_en, excerpt_en, description_en] = await translateTexts([
        initiative.title, initiative.excerpt, initiative.description,
      ]);
      await supabase.from("initiatives").insert([{
        user_id: user.id,
        alumni_id: alumniRecord?.id ?? null,
        ...initiative,
        image: imageUrl,
        title_en, excerpt_en, description_en,
      }]);
      setInitiative(emptyInitiative);
      setInitiativeImage(null);
      setInitiativeImagePreview(null);
      setInitiativeMsg("Initiative soumise !");
      const { data } = await supabase.from("initiatives").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setInitiatives(data);
    } catch (err) { setInitiativeMsg(err.message || "Une erreur est survenue."); }
    finally { setInitiativeSaving(false); }
  }

  // --- Mot de passe ---
  async function changePassword(e) {
    e.preventDefault();
    setPwMsg("");
    if (pwForm.newPwd !== pwForm.confirm) {
      setPwMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    if (pwForm.newPwd.length < 8) {
      setPwMsg("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPwd });
    if (error) {
      setPwMsg("Erreur lors du changement de mot de passe.");
    } else {
      setPwMsg("Mot de passe modifié avec succès !");
      setPwForm({ newPwd: "", confirm: "" });
    }
    setPwSaving(false);
  }

  // --- Administration : articles ---
  async function fetchArticles() {
    const { data } = await supabase.from("initiatives_articles").select("*").order("sort_order", { ascending: true });
    if (data) setArticles(data);
  }

  async function saveArticle(e) {
    e.preventDefault();
    if (!articleForm.title_fr.trim()) return;
    setArticleSaving(true); setArticleMsg("");
    try {
      let image_url = articleForm.image_url;
      if (articleImageFile) {
        image_url = await uploadFile(articleImageFile, "articles", "article-images");
      }
      const payload = { ...articleForm, image_url, sort_order: Number(articleForm.sort_order) };
      if (articleEditing) {
        await supabase.from("initiatives_articles").update(payload).eq("id", articleEditing);
      } else {
        await supabase.from("initiatives_articles").insert([payload]);
      }
      setArticleForm(emptyArticle);
      setArticleEditing(null);
      setArticleImageFile(null);
      setArticleMsg(articleEditing ? "Article modifié !" : "Article ajouté !");
      await fetchArticles();
    } catch (err) { setArticleMsg(err.message || "Une erreur est survenue."); }
    finally { setArticleSaving(false); }
  }

  function editArticle(article) {
    setArticleEditing(article.id);
    setArticleForm({
      category:   article.category,
      title_fr:   article.title_fr,
      title_en:   article.title_en,
      date:       article.date,
      author:     article.author,
      tag_fr:     article.tag_fr,
      tag_en:     article.tag_en,
      image_url:  article.image_url || "",
      excerpt_fr: article.excerpt_fr || "",
      excerpt_en: article.excerpt_en || "",
      published:  article.published,
      sort_order: article.sort_order ?? 0,
    });
    setArticleImageFile(null);
    setArticleMsg("");
  }

  async function deleteArticle(id) {
    if (!window.confirm("Supprimer cet article ?")) return;
    await supabase.from("initiatives_articles").delete().eq("id", id);
    await fetchArticles();
  }

  // --- Administration : actualités ---
  async function fetchActualites() {
    const { data } = await supabase.from("actualites").select("*").order("published_at", { ascending: false });
    if (data) setActualites(data);
  }

  async function saveActualite(e) {
    e.preventDefault();
    if (!actualiteForm.title.trim()) return;
    setActualiteSaving(true); setActualiteMsg("");
    try {
      let image = actualiteForm.image;
      if (actualiteImageFile) image = await uploadFile(actualiteImageFile, "actualites", "article-images");
      const [title_en, content_en] = await translateTexts([actualiteForm.title, actualiteForm.content]);
      const payload = { ...actualiteForm, image, user_id: user.id, title_en, content_en };
      if (actualiteEditing) {
        await supabase.from("actualites").update(payload).eq("id", actualiteEditing);
      } else {
        await supabase.from("actualites").insert([payload]);
      }
      setActualiteForm(emptyActualite);
      setActualiteEditing(null);
      setActualiteImageFile(null);
      setActualiteMsg(actualiteEditing ? "Actualité modifiée !" : "Actualité ajoutée !");
      await fetchActualites();
    } catch (err) { setActualiteMsg(err.message || "Une erreur est survenue."); }
    finally { setActualiteSaving(false); }
  }

  function editActualite(item) {
    setActualiteEditing(item.id);
    setActualiteForm({
      title: item.title,
      content: item.content || "",
      image: item.image || "",
      published_at: item.published_at,
      link: item.link || "",
      published: item.published,
    });
    setActualiteImageFile(null);
    setActualiteMsg("");
  }

  async function deleteActualite(id) {
    if (!window.confirm("Supprimer cette actualité ?")) return;
    await supabase.from("actualites").delete().eq("id", id);
    await fetchActualites();
  }

  // --- Administration : équipe ---
  async function fetchTeam() {
    const { data } = await supabase.from("team_members").select("*").order("sort_order", { ascending: true });
    if (data) setTeamMembers(data);
  }

  async function saveTeamMember(e) {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    setTeamSaving(true); setTeamMsg("");
    try {
      let avatar = teamForm.avatar;
      if (teamPhotoFile) avatar = await uploadFile(teamPhotoFile, "team");
      const payload = { ...teamForm, avatar, sort_order: Number(teamForm.sort_order) };
      if (teamEditing) {
        await supabase.from("team_members").update(payload).eq("id", teamEditing);
      } else {
        await supabase.from("team_members").insert([payload]);
      }
      setTeamForm(emptyTeamMember);
      setTeamEditing(null);
      setTeamPhotoFile(null);
      setTeamMsg(teamEditing ? "Membre modifié !" : "Membre ajouté !");
      await fetchTeam();
    } catch (err) { setTeamMsg(err.message || "Une erreur est survenue."); }
    finally { setTeamSaving(false); }
  }

  function editTeamMember(member) {
    setTeamEditing(member.id);
    setTeamForm({
      category:     member.category,
      name:         member.name,
      role:         member.role || "",
      role_en:      member.role_en || "",
      portfolio:    member.portfolio || "",
      portfolio_en: member.portfolio_en || "",
      region:       member.region || "",
      period:       member.period || "",
      avatar:       member.avatar || "",
      linkedin:     member.linkedin || "",
      sort_order:   member.sort_order ?? 0,
    });
    setTeamMsg("");
    setTeamPhotoFile(null);
  }

  async function deleteTeamMember(id) {
    if (!window.confirm("Supprimer ce membre ?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    await fetchTeam();
  }

  // --- Témoignages ---
  async function saveTestimonial(e) {
    e.preventDefault();
    if (!testimonial.quote.trim()) return;
    setTestimonialSaving(true); setTestimonialMsg("");
    try {
      const [quote_en] = await translateTexts([testimonial.quote]);
      await supabase.from("testimonials").insert([{
        user_id: user.id,
        alumni_id: alumniRecord?.id ?? null,
        quote: testimonial.quote,
        quote_en,
        name: name || user.email,
        avatar: alumniRecord?.avatar ?? null,
        cohort: alumniRecord?.cohort ?? null,
        region: alumniRecord?.region ?? null,
      }]);
      setTestimonial(emptyTestimonial);
      setTestimonialMsg("Témoignage soumis !");
      const { data } = await supabase.from("testimonials").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setTestimonials(data);
    } catch { setTestimonialMsg("Une erreur est survenue."); }
    finally { setTestimonialSaving(false); }
  }

  if (loading) return (
    <>
      <Navbar />
      <main className="profile-page">
        <div className="profile-page__loading">Chargement…</div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <SEOHead title="Mon Profil" noIndex={true} url="/profile" />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="profile-page">

        {/* HERO */}
        <div className="profile-page__hero">
          <div className="profile-page__hero-inner">
            <div className="profile-page__avatar-wrap">
              {isSafeAvatarUrl(photoPreview)
                ? <img src={photoPreview} alt="avatar" className="profile-page__avatar" />
                : <div className="profile-page__avatar-placeholder">👤</div>}
            </div>
            <h1>{name || "Mon espace alumni"}</h1>
            <p>{user.email}</p>
            <button className="profile-page__signout" onClick={async () => { await signOut(); navigate("/"); }}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="profile-page__container">

          {/* TABS */}
          <div className="profile-page__tabs">
            {[...TABS, ...(isAdmin ? [{ key: "admin", label: "Administration" }] : [])].map((tab) => (
              <button
                key={tab.key}
                className={`profile-page__tab ${activeTab === tab.key ? "profile-page__tab--active" : ""}`}
                onClick={() => switchTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1 : MON PROFIL ── */}
          {activeTab === "profil" && (
            <>
            <form className="profile-page__form" onSubmit={saveProfile}>
              <h2 className="profile-page__section-title">Mon profil</h2>

              <div className="profile-page__photo-row">
                <div className="profile-page__photo-preview">
                  {isSafeAvatarUrl(photoPreview) ? <img src={photoPreview} alt="Photo" /> : <span>👤</span>}
                </div>
                <label className="profile-page__photo-btn">
                  {photoPreview ? "Changer la photo" : "Ajouter une photo"}
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); }
                    }} />
                </label>
              </div>

              <div className="profile-page__field">
                <label>Nom complet *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Rakoto Andrianantenaina" required />
              </div>

              <div className="profile-page__field">
                <label>Profil LinkedIn</label>
                <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/votre-profil" />
              </div>

              {profileMsg && <p className={profileMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{profileMsg}</p>}
              <button type="submit" className="profile-page__btn" disabled={profileSaving}>
                {profileSaving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </form>

            <hr className="profile-page__section-divider" />

            <form className="profile-page__form" onSubmit={changePassword}>
              <h2 className="profile-page__section-title">Changer de mot de passe</h2>
              <div className="profile-page__field">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={pwForm.newPwd}
                  onChange={(e) => setPwForm((f) => ({ ...f, newPwd: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                  required
                />
              </div>
              <div className="profile-page__field">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
              {pwMsg && <p className={pwMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{pwMsg}</p>}
              <button type="submit" className="profile-page__btn" disabled={pwSaving}>
                {pwSaving ? "Mise à jour…" : "Modifier le mot de passe"}
              </button>
            </form>
            </>
          )}

          {/* ── TAB 2 : ANNUAIRE ── */}
          {activeTab === "annuaire" && (
            <form className="profile-page__form" onSubmit={saveAnnuaire}>
              <h2 className="profile-page__section-title">
                {alumniRecord?.position ? "Modifier mon profil annuaire" : "M'inscrire dans l'annuaire"}
              </h2>

              <div className="profile-page__row">
                <div className="profile-page__field">
                  <label>Type</label>
                  <select value={annuaire.cohort_type} onChange={(e) => setAnnuaire((a) => ({ ...a, cohort_type: e.target.value }))}>
                    <option value="">Sélectionner</option>
                    <option value="Cohort">Cohort</option>
                    <option value="Session">Session</option>
                  </select>
                </div>
                <div className="profile-page__field">
                  <label style={{ fontSize: "0.7rem" }}>Numéro du cohort ou année</label>
                  <input value={annuaire.cohort_number} onChange={(e) => setAnnuaire((a) => ({ ...a, cohort_number: e.target.value }))} placeholder="Ex: 1 ou 2024" />
                </div>
              </div>

              <div className="profile-page__row">
                <div className="profile-page__field">
                  <label>Centre</label>
                  <select value={annuaire.location} onChange={(e) => setAnnuaire((a) => ({ ...a, location: e.target.value }))}>
                    <option value="">Sélectionner</option>
                    <option value="Afrique du Sud">🇿🇦 Afrique du Sud</option>
                    <option value="Sénégal">🇸🇳 Sénégal</option>
                  </select>
                </div>
                <div className="profile-page__field">
                  <label>Région</label>
                  <select value={annuaire.region} onChange={(e) => setAnnuaire((a) => ({ ...a, region: e.target.value }))}>
                    <option value="">Sélectionner</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="profile-page__field">
                <label>Parcours</label>
                <select value={annuaire.track} onChange={(e) => setAnnuaire((a) => ({ ...a, track: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  {TRACKS.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
                </select>
              </div>

              <div className="profile-page__field">
                <label>Poste actuel *</label>
                <input value={annuaire.position} onChange={(e) => setAnnuaire((a) => ({ ...a, position: e.target.value }))} placeholder="Ex: Directeur Général" required />
              </div>

              <div className="profile-page__field">
                <label>Organisation *</label>
                <input value={annuaire.organization} onChange={(e) => setAnnuaire((a) => ({ ...a, organization: e.target.value }))} placeholder="Ex: ONG Mada Développement" required />
              </div>

              <div className="profile-page__field">
                <label>Email de contact *</label>
                <input type="email" value={annuaire.email} onChange={(e) => setAnnuaire((a) => ({ ...a, email: e.target.value }))} placeholder="Ex: votre@email.com" required />
              </div>

              <div className="profile-page__field">
                <label>Numéro de téléphone *</label>
                <input type="tel" value={annuaire.phone} onChange={(e) => setAnnuaire((a) => ({ ...a, phone: e.target.value }))} placeholder="Ex: +261 34 00 000 00" required />
              </div>

              <p className="profile-page__privacy-note">
                Ces informations sont strictement confidentielles et ne seront visibles que par l'équipe du RLC Madagascar Chapter. Elles ne seront utilisées que pour vous contacter si besoin.
              </p>

              {annuaireMsg && <p className={annuaireMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{annuaireMsg}</p>}
              <button type="submit" className="profile-page__btn" disabled={annuaireSaving}>
                {annuaireSaving ? "Enregistrement…" : alumniRecord?.position ? "Mettre à jour" : "M'inscrire dans l'annuaire"}
              </button>
            </form>
          )}

          {/* ── TAB 3 : INITIATIVES ── */}
          {activeTab === "initiatives" && (
            <div>
              <form className="profile-page__form" onSubmit={saveInitiative}>
                <h2 className="profile-page__section-title">Soumettre une initiative</h2>

                <div className="profile-page__field">
                  <label>Titre *</label>
                  <input value={initiative.title} onChange={(e) => setInitiative((i) => ({ ...i, title: e.target.value }))} placeholder="Titre de votre initiative" required />
                </div>

                <div className="profile-page__row">
                  <div className="profile-page__field">
                    <label>Secteur d'activité *</label>
                    <select value={initiative.sector} onChange={(e) => setInitiative((i) => ({ ...i, sector: e.target.value }))} required>
                      <option value="">Sélectionner</option>
                      {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="profile-page__field">
                    <label>Région</label>
                    <select value={initiative.region} onChange={(e) => setInitiative((i) => ({ ...i, region: e.target.value }))}>
                      <option value="">Sélectionner</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="profile-page__field">
                  <label>Tag</label>
                  <input value={initiative.tag} onChange={(e) => setInitiative((i) => ({ ...i, tag: e.target.value }))} placeholder="Ex: Entrepreneuriat" />
                </div>

                <div className="profile-page__field">
                  <label>Résumé court</label>
                  <input value={initiative.excerpt} onChange={(e) => setInitiative((i) => ({ ...i, excerpt: e.target.value }))} placeholder="Une phrase de présentation" />
                </div>

                <div className="profile-page__field">
                  <label>Description complète</label>
                  <textarea className="profile-page__textarea" rows={5} value={initiative.description} onChange={(e) => setInitiative((i) => ({ ...i, description: e.target.value }))} placeholder="Décrivez votre initiative…" />
                </div>

                {/* Image upload */}
                <div className="profile-page__field">
                  <label>Image</label>
                  <div className="profile-page__img-upload">
                    {initiativeImagePreview && (
                      <img src={initiativeImagePreview} alt="Aperçu" className="profile-page__img-preview" />
                    )}
                    <label className="profile-page__photo-btn">
                      {initiativeImagePreview ? "Changer l'image" : "Choisir une image"}
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f) { setInitiativeImage(f); setInitiativeImagePreview(URL.createObjectURL(f)); }
                        }} />
                    </label>
                  </div>
                </div>

                {initiativeMsg && <p className={initiativeMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{initiativeMsg}</p>}
                <button type="submit" className="profile-page__btn" disabled={initiativeSaving}>
                  {initiativeSaving ? "Envoi…" : "Soumettre l'initiative"}
                </button>
              </form>

              {initiatives.length > 0 && (
                <div className="profile-page__list">
                  <h3>Mes initiatives soumises</h3>
                  {initiatives.map((item) => (
                    <div className="profile-page__list-item" key={item.id}>
                      {item.image && <img src={item.image} alt={item.title} className="profile-page__list-img" />}
                      <div>
                        <span className="profile-page__list-tag">{item.sector}</span>
                        <strong>{item.title}</strong>
                        {item.excerpt && <p>{item.excerpt}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4 : TÉMOIGNAGES ── */}
          {activeTab === "temoignages" && (
            <div>
              <form className="profile-page__form" onSubmit={saveTestimonial}>
                <h2 className="profile-page__section-title">Partager un témoignage</h2>

                <div className="profile-page__field">
                  <label>Votre témoignage *</label>
                  <textarea
                    className="profile-page__textarea"
                    rows={6}
                    value={testimonial.quote}
                    onChange={(e) => setTestimonial({ quote: e.target.value })}
                    placeholder="Partagez votre expérience RLC…"
                    required
                  />
                </div>

                {testimonialMsg && <p className={testimonialMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{testimonialMsg}</p>}
                <button type="submit" className="profile-page__btn" disabled={testimonialSaving}>
                  {testimonialSaving ? "Envoi…" : "Soumettre mon témoignage"}
                </button>
              </form>

              {testimonials.length > 0 && (
                <div className="profile-page__list">
                  <h3>Mes témoignages soumis</h3>
                  {testimonials.map((item) => (
                    <div className="profile-page__list-item profile-page__list-item--quote" key={item.id}>
                      <span className="profile-page__quote-mark">"</span>
                      <p>{item.quote}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB ADMIN ── */}
          {activeTab === "admin" && isAdmin && (
            <div>
              {/* Sous-navigation admin */}
              <div className="profile-page__tabs" style={{ marginBottom: "24px" }}>
                <button
                  className={`profile-page__tab ${adminSection === "equipe" ? "profile-page__tab--active" : ""}`}
                  onClick={() => setAdminSection("equipe")}
                >Équipe</button>
                <button
                  className={`profile-page__tab ${adminSection === "articles" ? "profile-page__tab--active" : ""}`}
                  onClick={() => setAdminSection("articles")}
                >Articles</button>
                <button
                  className={`profile-page__tab ${adminSection === "actualites" ? "profile-page__tab--active" : ""}`}
                  onClick={() => setAdminSection("actualites")}
                >Actualités</button>
              </div>

              {/* ── SECTION ARTICLES ── */}
              {adminSection === "articles" && (
                <div>
                  <h2 className="profile-page__section-title">
                    {articleEditing ? "Modifier un article" : "Ajouter un article"}
                  </h2>
                  <form className="profile-page__form" onSubmit={saveArticle}>

                    <div className="profile-page__row">
                      <div className="profile-page__field">
                        <label>Catégorie *</label>
                        <select value={articleForm.category} onChange={(e) => setArticleForm((f) => ({ ...f, category: e.target.value }))} required>
                          <option value="spotlight">Spotlight</option>
                          <option value="fireside">Fireside</option>
                          <option value="autres">Autres</option>
                        </select>
                      </div>
                      <div className="profile-page__field">
                        <label>Date *</label>
                        <input type="date" value={articleForm.date} onChange={(e) => setArticleForm((f) => ({ ...f, date: e.target.value }))} required />
                      </div>
                    </div>

                    <div className="profile-page__row">
                      <div className="profile-page__field">
                        <label>Titre (FR) *</label>
                        <input value={articleForm.title_fr} onChange={(e) => setArticleForm((f) => ({ ...f, title_fr: e.target.value }))} required />
                      </div>
                      <div className="profile-page__field">
                        <label>Titre (EN) *</label>
                        <input value={articleForm.title_en} onChange={(e) => setArticleForm((f) => ({ ...f, title_en: e.target.value }))} required />
                      </div>
                    </div>

                    <div className="profile-page__row">
                      <div className="profile-page__field">
                        <label>Tag (FR)</label>
                        <input value={articleForm.tag_fr} onChange={(e) => setArticleForm((f) => ({ ...f, tag_fr: e.target.value }))} placeholder="Ex: Spotlight" />
                      </div>
                      <div className="profile-page__field">
                        <label>Tag (EN)</label>
                        <input value={articleForm.tag_en} onChange={(e) => setArticleForm((f) => ({ ...f, tag_en: e.target.value }))} placeholder="Ex: Spotlight" />
                      </div>
                    </div>

                    <div className="profile-page__field">
                      <label>Auteur</label>
                      <input value={articleForm.author} onChange={(e) => setArticleForm((f) => ({ ...f, author: e.target.value }))} />
                    </div>

                    <div className="profile-page__field">
                      <label>Extrait (FR)</label>
                      <textarea className="profile-page__textarea" rows={3} value={articleForm.excerpt_fr} onChange={(e) => setArticleForm((f) => ({ ...f, excerpt_fr: e.target.value }))} />
                    </div>
                    <div className="profile-page__field">
                      <label>Extrait (EN)</label>
                      <textarea className="profile-page__textarea" rows={3} value={articleForm.excerpt_en} onChange={(e) => setArticleForm((f) => ({ ...f, excerpt_en: e.target.value }))} />
                    </div>

                    <div className="profile-page__field">
                      <label>Image</label>
                      <div className="profile-page__img-upload">
                        {(articleImageFile ? URL.createObjectURL(articleImageFile) : articleForm.image_url) && (
                          <img
                            src={articleImageFile ? URL.createObjectURL(articleImageFile) : articleForm.image_url}
                            alt="Aperçu"
                            className="profile-page__img-preview"
                            style={{ aspectRatio: "16/9", objectFit: "cover" }}
                          />
                        )}
                        <label className="profile-page__photo-btn">
                          {articleImageFile || articleForm.image_url ? "Changer l'image" : "Choisir une image"}
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            onChange={(e) => {
                              const f = e.target.files[0];
                              if (f) setArticleCropSrc(URL.createObjectURL(f));
                            }} />
                        </label>
                        <input value={articleForm.image_url} onChange={(e) => setArticleForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="ou coller une URL d'image" style={{ marginTop: "8px" }} />
                      </div>
                    </div>

                    <div className="profile-page__row">
                      <div className="profile-page__field">
                        <label>Ordre d'affichage</label>
                        <input type="number" value={articleForm.sort_order} onChange={(e) => setArticleForm((f) => ({ ...f, sort_order: e.target.value }))} min="0" />
                      </div>
                      <div className="profile-page__field" style={{ justifyContent: "flex-end", display: "flex", alignItems: "center", gap: "8px", paddingTop: "20px" }}>
                        <input type="checkbox" id="published" checked={articleForm.published} onChange={(e) => setArticleForm((f) => ({ ...f, published: e.target.checked }))} />
                        <label htmlFor="published">Publié</label>
                      </div>
                    </div>

                    {articleMsg && <p className={articleMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{articleMsg}</p>}
                    <div className="profile-page__row">
                      <button type="submit" className="profile-page__btn" disabled={articleSaving}>
                        {articleSaving ? "Enregistrement…" : articleEditing ? "Modifier" : "Ajouter"}
                      </button>
                      {articleEditing && (
                        <button type="button" className="profile-page__btn" style={{ background: "#888" }}
                          onClick={() => { setArticleEditing(null); setArticleForm(emptyArticle); setArticleImageFile(null); setArticleMsg(""); }}>
                          Annuler
                        </button>
                      )}
                    </div>
                  </form>

                  <hr className="profile-page__section-divider" />
                  <h2 className="profile-page__section-title">Articles ({articles.length})</h2>
                  {articles.length === 0 ? (
                    <p style={{ color: "#999" }}>Aucun article pour l'instant.</p>
                  ) : (
                    <div className="profile-page__list">
                      {articles.map((a) => (
                        <div className="profile-page__list-item" key={a.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {a.image_url && <img src={a.image_url} alt={a.title_fr} style={{ width: 60, height: 38, objectFit: "cover", borderRadius: 4 }} />}
                          <div style={{ flex: 1 }}>
                            <strong>{a.title_fr}</strong>
                            <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "#777" }}>
                              {a.category} — {a.date} {!a.published && "· non publié"}
                            </span>
                          </div>
                          <button className="profile-page__photo-btn" onClick={() => editArticle(a)}>Modifier</button>
                          <button className="profile-page__photo-btn" style={{ background: "#e53" }} onClick={() => deleteArticle(a.id)}>Supprimer</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SECTION ACTUALITÉS ── */}
              {adminSection === "actualites" && (
                <div>
                  <h2 className="profile-page__section-title">
                    {actualiteEditing ? "Modifier une actualité" : "Ajouter une actualité"}
                  </h2>
                  <form className="profile-page__form" onSubmit={saveActualite}>
                    <div className="profile-page__field">
                      <label>Titre *</label>
                      <input value={actualiteForm.title} onChange={(e) => setActualiteForm((f) => ({ ...f, title: e.target.value }))} required />
                    </div>

                    <div className="profile-page__field">
                      <label>Contenu</label>
                      <textarea className="profile-page__textarea" rows={6} value={actualiteForm.content} onChange={(e) => setActualiteForm((f) => ({ ...f, content: e.target.value }))} placeholder="Décrivez l'actualité…" />
                    </div>

                    <div className="profile-page__row">
                      <div className="profile-page__field">
                        <label>Date de publication *</label>
                        <input type="date" value={actualiteForm.published_at} onChange={(e) => setActualiteForm((f) => ({ ...f, published_at: e.target.value }))} required />
                      </div>
                      <div className="profile-page__field" style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "20px" }}>
                        <input type="checkbox" id="actualite-published" checked={actualiteForm.published} onChange={(e) => setActualiteForm((f) => ({ ...f, published: e.target.checked }))} />
                        <label htmlFor="actualite-published">Publié</label>
                      </div>
                    </div>

                    <div className="profile-page__field">
                      <label>Lien externe (optionnel)</label>
                      <input value={actualiteForm.link} onChange={(e) => setActualiteForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://…" />
                    </div>

                    <div className="profile-page__field">
                      <label>Image de couverture</label>
                      <div className="profile-page__img-upload">
                        {(actualiteImageFile ? URL.createObjectURL(actualiteImageFile) : actualiteForm.image) && (
                          <img
                            src={actualiteImageFile ? URL.createObjectURL(actualiteImageFile) : actualiteForm.image}
                            alt="Aperçu"
                            className="profile-page__img-preview"
                            style={{ aspectRatio: "16/9", objectFit: "cover" }}
                          />
                        )}
                        <label className="profile-page__photo-btn">
                          {actualiteImageFile || actualiteForm.image ? "Changer l'image" : "Choisir une image"}
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            onChange={(e) => { const f = e.target.files[0]; if (f) setActualiteImageFile(f); }} />
                        </label>
                        <input value={actualiteForm.image} onChange={(e) => setActualiteForm((f) => ({ ...f, image: e.target.value }))} placeholder="ou coller une URL d'image" style={{ marginTop: "8px" }} />
                      </div>
                    </div>

                    {actualiteMsg && <p className={actualiteMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{actualiteMsg}</p>}
                    <div className="profile-page__row">
                      <button type="submit" className="profile-page__btn" disabled={actualiteSaving}>
                        {actualiteSaving ? "Enregistrement…" : actualiteEditing ? "Modifier" : "Ajouter"}
                      </button>
                      {actualiteEditing && (
                        <button type="button" className="profile-page__btn" style={{ background: "#888" }}
                          onClick={() => { setActualiteEditing(null); setActualiteForm(emptyActualite); setActualiteImageFile(null); setActualiteMsg(""); }}>
                          Annuler
                        </button>
                      )}
                    </div>
                  </form>

                  <hr className="profile-page__section-divider" />
                  <h2 className="profile-page__section-title">Actualités ({actualites.length})</h2>
                  {actualites.length === 0 ? (
                    <p style={{ color: "#999" }}>Aucune actualité pour l'instant.</p>
                  ) : (
                    <div className="profile-page__list">
                      {actualites.map((a) => (
                        <div className="profile-page__list-item" key={a.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {a.image && <img src={a.image} alt={a.title} style={{ width: 60, height: 38, objectFit: "cover", borderRadius: 4 }} />}
                          <div style={{ flex: 1 }}>
                            <strong>{a.title}</strong>
                            <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "#777" }}>
                              {a.published_at} {!a.published && "· non publié"}
                            </span>
                          </div>
                          <button className="profile-page__photo-btn" onClick={() => editActualite(a)}>Modifier</button>
                          <button className="profile-page__photo-btn" style={{ background: "#e53" }} onClick={() => deleteActualite(a.id)}>Supprimer</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SECTION ÉQUIPE ── */}
              {adminSection === "equipe" && (
              <div>
              <h2 className="profile-page__section-title">
                {teamEditing ? "Modifier un membre" : "Ajouter un membre"}
              </h2>

              <form className="profile-page__form" onSubmit={saveTeamMember}>
                <div className="profile-page__row">
                  <div className="profile-page__field">
                    <label>Catégorie *</label>
                    <select value={teamForm.category} onChange={(e) => setTeamForm((f) => ({ ...f, category: e.target.value }))} required>
                      <option value="bureau">Bureau</option>
                      <option value="coordinator">Coordinateur</option>
                      <option value="focal_point">Point focal</option>
                      <option value="past_coordinator">Ancien coordinateur</option>
                    </select>
                  </div>
                  <div className="profile-page__field">
                    <label>Ordre d'affichage</label>
                    <input type="number" value={teamForm.sort_order} onChange={(e) => setTeamForm((f) => ({ ...f, sort_order: e.target.value }))} min="0" />
                  </div>
                </div>

                <div className="profile-page__field">
                  <label>Nom complet *</label>
                  <input value={teamForm.name} onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>

                {teamForm.category === "bureau" && (
                  <div className="profile-page__row">
                    <div className="profile-page__field">
                      <label>Rôle (FR)</label>
                      <input value={teamForm.role} onChange={(e) => setTeamForm((f) => ({ ...f, role: e.target.value }))} placeholder="Ex: Président" />
                    </div>
                    <div className="profile-page__field">
                      <label>Rôle (EN)</label>
                      <input value={teamForm.role_en} onChange={(e) => setTeamForm((f) => ({ ...f, role_en: e.target.value }))} placeholder="Ex: President" />
                    </div>
                  </div>
                )}
                {teamForm.category === "coordinator" && (
                  <div className="profile-page__row">
                    <div className="profile-page__field">
                      <label>Portefeuille (FR)</label>
                      <input value={teamForm.portfolio} onChange={(e) => setTeamForm((f) => ({ ...f, portfolio: e.target.value }))} placeholder="Ex: Entrepreneuriat" />
                    </div>
                    <div className="profile-page__field">
                      <label>Portefeuille (EN)</label>
                      <input value={teamForm.portfolio_en} onChange={(e) => setTeamForm((f) => ({ ...f, portfolio_en: e.target.value }))} placeholder="Ex: Entrepreneurship" />
                    </div>
                  </div>
                )}
                {teamForm.category === "focal_point" && (
                  <div className="profile-page__field">
                    <label>Région</label>
                    <select value={teamForm.region} onChange={(e) => setTeamForm((f) => ({ ...f, region: e.target.value }))}>
                      <option value="">Sélectionner</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                )}
                {teamForm.category === "past_coordinator" && (
                  <div className="profile-page__field">
                    <label>Période</label>
                    <input value={teamForm.period} onChange={(e) => setTeamForm((f) => ({ ...f, period: e.target.value }))} placeholder="Ex: 2020–2022" />
                  </div>
                )}

                <div className="profile-page__field">
                  <label>LinkedIn</label>
                  <input value={teamForm.linkedin} onChange={(e) => setTeamForm((f) => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
                </div>

                <div className="profile-page__field">
                  <label>Photo</label>
                  <div className="profile-page__img-upload">
                    {(teamPhotoFile ? URL.createObjectURL(teamPhotoFile) : teamForm.avatar) && (
                      <img src={teamPhotoFile ? URL.createObjectURL(teamPhotoFile) : teamForm.avatar} alt="Aperçu" className="profile-page__img-preview" />
                    )}
                    <label className="profile-page__photo-btn">
                      {teamPhotoFile || teamForm.avatar ? "Changer la photo" : "Choisir une photo"}
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f) setTeamCropSrc(URL.createObjectURL(f));
                        }} />
                    </label>
                    <input value={teamForm.avatar} onChange={(e) => setTeamForm((f) => ({ ...f, avatar: e.target.value }))} placeholder="ou coller une URL d'image" style={{ marginTop: "8px" }} />
                  </div>
                </div>

                {teamMsg && <p className={teamMsg.includes("!") ? "profile-page__success" : "profile-page__error"}>{teamMsg}</p>}

                <div className="profile-page__row">
                  <button type="submit" className="profile-page__btn" disabled={teamSaving}>
                    {teamSaving ? "Enregistrement…" : teamEditing ? "Modifier" : "Ajouter"}
                  </button>
                  {teamEditing && (
                    <button type="button" className="profile-page__btn" style={{ background: "#888" }}
                      onClick={() => { setTeamEditing(null); setTeamForm(emptyTeamMember); setTeamPhotoFile(null); setTeamMsg(""); }}>
                      Annuler
                    </button>
                  )}
                </div>
              </form>

              <hr className="profile-page__section-divider" />
              <h2 className="profile-page__section-title">Membres ({teamMembers.length})</h2>

              {teamMembers.length === 0 ? (
                <p style={{ color: "#999" }}>Aucun membre pour l'instant.</p>
              ) : (
                <div className="profile-page__list">
                  {teamMembers.map((m) => (
                    <div className="profile-page__list-item" key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {m.avatar && <img src={m.avatar} alt={m.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />}
                      <div style={{ flex: 1 }}>
                        <strong>{m.name}</strong>
                        <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "#777" }}>
                          {m.category}{m.role ? ` — ${m.role}` : ""}{m.portfolio ? ` — ${m.portfolio}` : ""}{m.region ? ` — ${m.region}` : ""}{m.period ? ` — ${m.period}` : ""}
                        </span>
                      </div>
                      <button className="profile-page__photo-btn" onClick={() => editTeamMember(m)}>Modifier</button>
                      <button className="profile-page__photo-btn" style={{ background: "#e53" }} onClick={() => deleteTeamMember(m.id)}>Supprimer</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

          </div>
          )}

        </div>
      </main>
      <Footer />

      {teamCropSrc && (
        <ImageCropper
          imageSrc={teamCropSrc}
          aspect={1}
          onDone={(croppedFile) => {
            setTeamPhotoFile(croppedFile);
            setTeamCropSrc(null);
          }}
          onCancel={() => setTeamCropSrc(null)}
        />
      )}

      {articleCropSrc && (
        <ImageCropper
          imageSrc={articleCropSrc}
          aspect={600 / 380}
          onDone={(croppedFile) => {
            setArticleImageFile(croppedFile);
            setArticleCropSrc(null);
          }}
          onCancel={() => setArticleCropSrc(null)}
        />
      )}
    </>
  );
}
