import { useState } from "react";
import "./AlumniFormModal.css";

const TRACKS = [
  "Business & Entrepreneuriat",
  "Leadership Civique",
  "Management Public & Gouvernance",
];

const REGIONS = [
  "Analamanga", "Vakinankaratra", "Itasy", "Bongolava",
  "Matsiatra Ambony", "Amoron'i Mania", "Vatovavy", "Fitovinany",
  "Atsimo-Atsinanana", "Atsinanana", "Analanjirofo", "Alaotra-Mangoro",
  "Boeny", "Sofia", "Betsiboka", "Melaky",
  "Atsimo-Andrefana", "Androy", "Anosy", "Menabe", "Diana", "Sava",
];

const COHORTS = [
  "Cohort 1 - 2019", "Cohort 2 - 2020", "Cohort 3 - 2021",
  "Cohort 4 - 2022", "Cohort 5 - 2023",
];

const empty = {
  name: "", cohort: "", track: "", region: "",
  location: "", position: "", organization: "", linkedin: "",
};

export default function AlumniFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Champ requis";
    if (!form.cohort) e.cohort = "Champ requis";
    if (!form.track) e.track = "Champ requis";
    if (!form.region) e.region = "Champ requis";
    if (!form.location) e.location = "Champ requis";
    if (!form.position.trim()) e.position = "Champ requis";
    if (!form.organization.trim()) e.organization = "Champ requis";
    return e;
  }

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const newAlumni = {
      ...form,
      id: Date.now(),
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`,
    };
    onSubmit(newAlumni);
    setSubmitted(true);
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

              <div className="modal__field">
                <label>Nom complet *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Ex: Rakoto Andrianantenaina" />
                {errors.name && <span className="modal__error">{errors.name}</span>}
              </div>

              <div className="modal__row">
                <div className="modal__field">
                  <label>Cohorte *</label>
                  <select name="cohort" value={form.cohort} onChange={handle}>
                    <option value="">Sélectionner</option>
                    {COHORTS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.cohort && <span className="modal__error">{errors.cohort}</span>}
                </div>
                <div className="modal__field">
                  <label>Centre de formation *</label>
                  <select name="location" value={form.location} onChange={handle}>
                    <option value="">Sélectionner</option>
                    <option value="Afrique du Sud">🇿🇦 Afrique du Sud</option>
                    <option value="Sénégal">🇸🇳 Sénégal</option>
                  </select>
                  {errors.location && <span className="modal__error">{errors.location}</span>}
                </div>
              </div>

              <div className="modal__row">
                <div className="modal__field">
                  <label>Parcours *</label>
                  <select name="track" value={form.track} onChange={handle}>
                    <option value="">Sélectionner</option>
                    {TRACKS.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
                  </select>
                  {errors.track && <span className="modal__error">{errors.track}</span>}
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

              <div className="modal__field">
                <label>Profil LinkedIn</label>
                <input name="linkedin" value={form.linkedin} onChange={handle} placeholder="https://linkedin.com/in/votre-profil" />
              </div>

              <button type="submit" className="modal__btn modal__btn--full">
                Ajouter mon profil
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
