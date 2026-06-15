export function imgUrl(
  url: string | null | undefined,
  w: number,
  q = 75,
): string {
  if (!url) return ''
  return `${url}?w=${w}&fm=webp&q=${q}&fit=max`
}

export function imgSrcset(
  url: string | null | undefined,
  widths: number[],
  q = 75,
): string {
  if (!url) return ''
  return widths.map(w => `${imgUrl(url, w, q)} ${w}w`).join(', ')
}

/**
 * Open Graph share image: exact 1200×630 JPEG crop. NOT webp — share-preview
 * crawlers (WhatsApp, older Facebook) want JPEG/PNG. Distinct from `imgUrl`,
 * which forces `fm=webp` for on-page display.
 */
export function ogImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  return `${url}?w=1200&h=630&fit=crop&fm=jpg&q=80`
}

/**
 * Serialize an object for safe inlining inside a <script type="application/ld+json">
 * via innerHTML. JSON.stringify alone does not escape `<`, `>`, `&`, or the
 * line/paragraph separators, so a value containing `</script>` (or a stray name
 * with `<`) could break out of the tag. Escape them to their \\u-sequences.
 */
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split('\u2028').join('\\u2028')
    .split('\u2029').join('\\u2029')
}
