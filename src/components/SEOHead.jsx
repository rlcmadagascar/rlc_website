import { Helmet } from "react-helmet-async";
import { useLang } from "../context/LangContext";

const SITE_NAME = "RLC Madagascar Chapter";
const DEFAULT_IMAGE = "/group_photo.jpg";
const BASE_URL = "https://rlcmadagascar.org";

const OG_LOCALE = { fr: "fr_FR", en: "en_US" };

export default function SEOHead({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  noIndex = false,
  jsonLd = null,
}) {
  const { lang } = useLang();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const locale = OG_LOCALE[lang] ?? "fr_FR";
  const alternateLocale = lang === "fr" ? OG_LOCALE.en : OG_LOCALE.fr;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="RLC Madagascar Chapter" />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content={alternateLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
