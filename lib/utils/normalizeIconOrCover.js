/**
 * Normalizes a value to a Notion-compatible icon or cover format.
 * Accepts either:
 * - A URL string (starting with http/https) to be used as an external icon or cover
 * - An emoji string (e.g., "🔥") to be used as a Notion emoji icon
 * - Or a full Notion-compatible icon/cover object (if already formatted correctly)
 *
 * @param {string|Object} value - A string URL, emoji, or already-normalized icon/cover object
 * @returns {Object} A normalized Notion-compatible object in one of the following forms:
 *   - `{ type: 'external', external: { url: '...' } }` for URLs
 *   - `{ type: 'emoji', emoji: '...' }` for emojis
 *   - The input object itself, if already in correct format
 * @example
 * normalizeIconOrCover("🚀")
 * // → { type: 'emoji', emoji: '🚀' }
 *
 * normalizeIconOrCover("https://example.com/icon.png")
 * // → { type: 'external', external: { url: 'https://example.com/icon.png' } }
 */
function normalizeIconOrCover(value) {

  if (typeof value === 'string') {
    return value.startsWith('http')
      ? { type: 'external', external: { url: value } }
      : { type: 'emoji', emoji: value };
  }
  return value;
}

export { normalizeIconOrCover }