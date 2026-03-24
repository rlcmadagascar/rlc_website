// Allowlist of trusted hosts for user-supplied avatar URLs.
const ALLOWED_AVATAR_HOSTS = ["i.pravatar.cc"];

// Supabase Storage public URLs follow this pattern.
const SUPABASE_STORAGE_RE =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//;

/**
 * Returns true if the URL is safe to use as an <img src> for an avatar.
 * Accepts:
 *  - blob: URLs produced by URL.createObjectURL() (local file previews)
 *  - Supabase Storage public URLs
 *  - https://i.pravatar.cc/* (default avatars)
 */
export function isSafeAvatarUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("blob:")) return true;
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:") return false;
    if (SUPABASE_STORAGE_RE.test(url)) return true;
    return ALLOWED_AVATAR_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
