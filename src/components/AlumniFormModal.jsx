import { useState } from "react";
import { supabase } from "../lib/supabase";
import { validateImageFile, compressImage } from "../lib/sanitize";
import "./AlumniFormModal.css";

const TRACKS = [
  "Business & Entrepreneuriat",
  "Leadership Civique",
  "Management Public & Gouvernance",
  "Education Changemaker",
  "Wash",
  "Energie",
];

const REGIONS = [
  "Analamanga", "Vakinankaratra", "Itasy", "Bongolava",
  "Matsiatra Ambony", "Amoron'i Mania", "Vatovavy", "Fitovinany",
  "Atsimo-Atsinanana", "Atsinanana", "Analanjirofo", "Alaotra-Mangoro",
  "Boeny", "Sofia", "Betsiboka", "Melaky",
  "Atsimo-Andrefana", "Androy", "Anosy", "Menabe", "Diana", "Sava",
];

const empty = {
  name: "", cohort_type: "", cohort_number: "", track: "", region: "",
  location: "", position: "", organization: "", linkedin: "", email: "", phone: "",
};

export default function AlumniFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(empty);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Champ requis";
    if (!form.cohort_type) e.cohort_type = "Champ requis";
    if (!form.cohort_number.trim()) e.cohort_number = "Champ requis";
    if (!form.track) e.track = "Champ requis";
    if (!form.region) e.region = "Champ requis";
    if (!form.location) e.location = "Champ requis";
    if (!form.position.trim()) e.position = "Champ requis";
    if (!form.organization.trim()) e.organization = "Champ requis";
    if (!form.email.trim()) e.email = "Champ requis";
    if (!form.phone.trim()) e.phone = "Champ requis";
    return e;
  }

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function uploadPhoto() {
    if (!photoFile) return null;
    const validationError = await validateImageFile(photoFile);
    if (validationError) throw new Error(validationError);
    const compressed = await compressImage(photoFile, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
    const filePath = `alumni/${Date.now()}.webp`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, compressed, { upsert: true });
    if (error) throw new Error(error.message);
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    return publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");
    try {
      const avatarUrl = await uploadPhoto()
        ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`;

      const newAlumni = {
        name: form.name,
        cohort_type: form.cohort_type,
        cohort: `${form.cohort_type} ${form.cohort_number}`,
        track: form.track,
        region: form.region,
        location: form.location,
        position: form.position,
        organization: form.organization,
        linkedin: form.linkedin,
        email: form.email,
        phone: form.phone,
        avatar: avatarUrl,
      };

      await onSubmit(newAlumni);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal__close" onClick={onClose}>✕</button>

        {submitted ? (
          <div className="modal__success">
            <div className="modal__success-icon">✓</div>
            <h2>Profil ajouté !</h2>
            <p>Votre profil est maintenant visible dans l'annuaire.</p>
            <button className="modal__btn" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <h2 className="modal__title">Rejoindre l'annuaire</h2>
            <p className="modal__subtitle">Renseignez vos informations pour apparaître dans l'annuaire des alumni.</p>

            <form className="modal__form" onSubmit={handleSubmit} noValidate>

              {/* Photo */}
              <div className="modal__field modal__field--photo">
                <label>Photo de profil</label>
                <div className="modal__photo-wrap">
                  <div className="modal__photo-preview">
                    {photoPreview
                      ? <img src={photoPreview} alt="Aperçu" />
                      : <span className="modal__photo-placeholder">👤</span>
                    }
                  </div>
                  <label className="modal__photo-btn">
                    {photoPreview ? "Changer la photo" : "Choisir une photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {/* Nom */}
              <div className="modal__field">
                <label>Nom complet *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Ex: Rakoto Andrianantenaina" />
                {errors.name && <span className="modal__error">{errors.name}</span>}
              </div>

              {/* Cohort/Session */}
              <div className="modal__row">
                <div className="modal__field">
                  <label>Type *</label>
                  <select name="cohort_type" value={form.cohort_type} onChange={handle}>
                    <option value="">Sélectionner</option>
                    <option value="Cohort">Cohort</option>
                    <option value="Session">Session</option>
                  </select>
                  {errors.cohort_type && <span className="modal__error">{errors.cohort_type}</span>}
                </div>
                <div className="modal__field">
                  <label style={{ fontSize: "0.7rem" }}>Numéro du cohort ou année *</label>
                  <input
                    name="cohort_number"
                    value={form.cohort_number}
                    onChange={handle}
                    placeholder="Ex: 1 ou 2024"
                  />
                  {errors.cohort_number && <span className="modal__error">{errors.cohort_number}</span>}
                </div>
              </div>

              {/* Centre + Région */}
              <div className="modal__row">
                <div className="modal__field">
                  <label>Centre *</label>
                  <select name="location" value={form.location} onChange={handle}>
                    <option value="">Sélectionner</option>
                    <option value="Afrique du Sud">🇿🇦 Afrique du Sud</option>
                    <option value="Sénégal">🇸🇳 Sénégal</option>
                  </select>
                  {errors.location && <span className="modal__error">{errors.location}</span>}
                </div>
                <div className="modal__field">
                  <label>Région *</label>
                  <select name="region" value={form.region} onChange={handle}>
                    <option value="">Sélectionner</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.region && <span className="modal__error">{errors.region}</span>}
                </div>
              </div>

              {/* Parcours */}
              <div className="modal__field">
                <label>Parcours *</label>
                <select name="track" value={form.track} onChange={handle}>
                  <option value="">Sélectionner</option>
                  {TRACKS.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
                </select>
                {errors.track && <span className="modal__error">{errors.track}</span>}
              </div>

              {/* Poste + Organisation */}
              <div className="modal__field">
                <label>Poste actuel *</label>
                <input name="position" value={form.position} onChange={handle} placeholder="Ex: Directeur Général" />
                {errors.position && <span className="modal__error">{errors.position}</span>}
              </div>

              <div className="modal__field">
                <label>Organisation *</label>
                <input name="organization" value={form.organization} onChange={handle} placeholder="Ex: ONG Mada Développement" />
                {errors.organization && <span className="modal__error">{errors.organization}</span>}
              </div>

              {/* LinkedIn */}
              <div className="modal__field">
                <label>Profil LinkedIn</label>
                <input name="linkedin" value={form.linkedin} onChange={handle} placeholder="https://linkedin.com/in/votre-profil" />
              </div>

              {/* Contact privé */}
              <div className="modal__field">
                <label>Email de contact *</label>
                <input type="email" name="email" value={form.email} onChange={handle} placeholder="Ex: votre@email.com" />
                {errors.email && <span className="modal__error">{errors.email}</span>}
              </div>

              <div className="modal__field">
                <label>Numéro de téléphone *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handle} placeholder="Ex: +261 34 00 000 00" />
                {errors.phone && <span className="modal__error">{errors.phone}</span>}
              </div>

              <p className="modal__privacy-note">
                Ces informations sont strictement confidentielles et ne seront visibles que par l'équipe du RLC Madagascar Chapter. Elles ne seront utilisées que pour vous contacter si besoin.
              </p>

              {serverError && <p className="modal__error modal__error--server">{serverError}</p>}

              <button type="submit" className="modal__btn modal__btn--full" disabled={loading}>
                {loading ? "Enregistrement…" : "Ajouter mon profil"}
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
