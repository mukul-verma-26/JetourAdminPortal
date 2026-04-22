/**
 * Resolves a photo item from the API to a displayable URL string.
 * @param {string|{ url?: string, path?: string, href?: string }|null|undefined} item
 * @returns {string|null}
 */
export function getPhotoUrl(item) {
  if (item == null) return null;
  if (typeof item === 'string') {
    const t = item.trim();
    return t || null;
  }
  if (typeof item === 'object') {
    const u = item.url || item.path || item.href;
    if (u != null && String(u).trim()) return String(u).trim();
  }
  return null;
}

/**
 * @param {unknown} raw
 * @returns {string[]}
 */
export function getPhotoUrls(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map(getPhotoUrl).filter(Boolean);
}
