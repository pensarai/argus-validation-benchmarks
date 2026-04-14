/**
 * String sanitization functions used by schema transform chains.
 */

/**
 * Strips all HTML tags from a string, preserving text content.
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim();
}

/**
 * Normalizes whitespace: collapses multiple spaces/tabs/newlines to single spaces.
 */
export function normalizeWhitespace(input: string): string {
  return input
    .replace(/[\t\r]+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Truncates a string to the specified length, adding ellipsis if truncated.
 */
export function truncate(input: string, maxLength: number, suffix = '...'): string {
  if (input.length <= maxLength) return input;
  const truncLength = maxLength - suffix.length;
  if (truncLength <= 0) return suffix.slice(0, maxLength);
  return input.slice(0, truncLength) + suffix;
}

/**
 * Converts a string to a URL-safe slug.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Escapes characters that could be used for HTML injection.
 */
export function escapeHtml(input: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => escapeMap[char] || char);
}
