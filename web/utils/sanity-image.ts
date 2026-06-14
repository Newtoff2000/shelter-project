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
