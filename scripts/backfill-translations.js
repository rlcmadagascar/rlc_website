/**
 * Script de rétro-traduction : traduit les enregistrements existants sans traduction EN.
 * Usage : node scripts/backfill-translations.js
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bjsxbbetqthcdpcvxycf.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // service_role key (pas anon)

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_SERVICE_KEY manquant. Exemple :");
  console.error("   SUPABASE_SERVICE_KEY=xxx node scripts/backfill-translations.js");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function translate(texts) {
  const { data, error } = await supabase.functions.invoke("translate", {
    body: { texts },
  });
  if (error || !data?.translations) {
    console.error("Erreur traduction :", error ?? "pas de résultat");
    return texts.map(() => null);
  }
  return data.translations;
}

async function backfillInitiatives() {
  const { data } = await supabase
    .from("initiatives")
    .select("id, title, excerpt, description")
    .is("title_en", null);

  if (!data?.length) { console.log("✅ Initiatives : rien à traduire"); return; }
  console.log(`🔄 Initiatives : ${data.length} à traduire…`);

  for (const item of data) {
    const [title_en, excerpt_en, description_en] = await translate([
      item.title || "", item.excerpt || "", item.description || "",
    ]);
    await supabase.from("initiatives").update({ title_en, excerpt_en, description_en }).eq("id", item.id);
    console.log(`  ✓ ${item.title}`);
  }
}

async function backfillTestimonials() {
  const { data } = await supabase
    .from("testimonials")
    .select("id, quote")
    .is("quote_en", null);

  if (!data?.length) { console.log("✅ Témoignages : rien à traduire"); return; }
  console.log(`🔄 Témoignages : ${data.length} à traduire…`);

  for (const item of data) {
    const [quote_en] = await translate([item.quote || ""]);
    await supabase.from("testimonials").update({ quote_en }).eq("id", item.id);
    console.log(`  ✓ ${item.quote?.slice(0, 40)}…`);
  }
}

async function backfillActualites() {
  const { data } = await supabase
    .from("actualites")
    .select("id, title, content")
    .is("title_en", null);

  if (!data?.length) { console.log("✅ Actualités : rien à traduire"); return; }
  console.log(`🔄 Actualités : ${data.length} à traduire…`);

  for (const item of data) {
    const [title_en, content_en] = await translate([item.title || "", item.content || ""]);
    await supabase.from("actualites").update({ title_en, content_en }).eq("id", item.id);
    console.log(`  ✓ ${item.title}`);
  }
}

(async () => {
  console.log("🚀 Démarrage de la rétro-traduction…\n");
  await backfillInitiatives();
  await backfillTestimonials();
  await backfillActualites();
  console.log("\n✅ Terminé !");
})();
