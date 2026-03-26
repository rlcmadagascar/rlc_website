import { supabase } from "./supabase";

/**
 * Traduit un tableau de textes FR → EN via la Edge Function Supabase.
 * Renvoie un tableau de traductions dans le même ordre.
 * Les textes vides sont renvoyés tels quels sans appel API.
 */
export async function translateTexts(texts) {
  const filtered = texts.map((t) => t || "");
  const { data, error } = await supabase.functions.invoke("translate", {
    body: { texts: filtered },
  });
  if (error || !data?.translations) return filtered.map(() => null);
  return data.translations;
}
