import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const BASE_URL = "https://rlcmadagascar.org";
const DEFAULT_IMAGE = `${BASE_URL}/group_photo.jpg`;

const BOT_UA = /facebookexternalhit|LinkedInBot|Twitterbot|Slackbot|WhatsApp|TelegramBot|Discordbot/i;

export default async function handler(req, res) {
  const ua = req.headers["user-agent"] || "";
  const { id } = req.query;

  // Visiteur humain → servir le SPA (index.html)
  if (!BOT_UA.test(ua)) {
    const indexPath = join(process.cwd(), "dist", "index.html");
    const html = readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  }

  // Bot social → récupérer l'article et servir les OG tags
  const { data: item } = await supabase
    .from("actualites")
    .select("id, title, title_en, content, content_en, image, published_at")
    .eq("id", id)
    .eq("published", true)
    .single();

  const title = esc((item?.title ?? "Actualité") + " | RLC Madagascar Chapter");
  const description = esc(
    item?.content ? item.content.slice(0, 160).replace(/\n/g, " ") : "Actualités RLC Madagascar Chapter"
  );
  const image = esc(item?.image || DEFAULT_IMAGE);
  const url = esc(`${BASE_URL}/actualite/${id}`);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="RLC Madagascar Chapter" />
  <meta property="og:locale" content="fr_FR" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <a href="${url}">Voir l'actualité</a>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
