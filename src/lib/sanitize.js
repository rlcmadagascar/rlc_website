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
/**
 * Validates a file intended for image upload.
 * Checks file size and magic bytes (actual file content), not just the extension.
 * Returns an error string if invalid, null if valid.
 */
export async function validateImageFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) return "Le fichier dépasse 5 Mo.";

  const buffer = await file.slice(0, 12).arrayBuffer();
  const b = new Uint8Array(buffer);

  const isJpeg = b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF;
  const isPng  = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
  const isWebP = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
              && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;

  if (!isJpeg && !isPng && !isWebP) return "Seuls les formats JPEG, PNG et WebP sont acceptés.";
  return null;
}

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
