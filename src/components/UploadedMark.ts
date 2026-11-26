// The Fragmio logo you upload as an SVG in Admin → Apps → Fragmio → Logos and icons (short logo).
// It's put straight into the page with its colours swapped for the website's palette, so the colour picker
// recolours it like the built-in logo: the first gradient (or any solid colour) becomes the palette's two
// colours, and any other gradient a lighter mix of them. Masks and clip shapes are left as they are.
// Scripts, event handlers and outside links are removed first.

const KEY = 'fr-mark'
const cache = new Map<string, Promise<string>>()

function keep(url: string, svg: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ url, svg }))
  } catch {
    /* not kept */
  }
}
/** The last one drawn on this browser, so it shows straight away on the next visit. */
export function keptMark(url: string): string {
  try {
    const k = JSON.parse(localStorage.getItem(KEY) || 'null') as { url: string; svg: string } | null
    return k && k.url === url ? k.svg : ''
  } catch {
    return ''
  }
}

const NEUTRAL = /^(none|transparent|currentcolor|#fff(fff)?|#000(000)?|white|black|url\(.*\))$/i

function recolour(raw: string): string {
  const doc = new DOMParser().parseFromString(raw, 'image/svg+xml')
  const svg = doc.documentElement
  if (svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return ''
  // Safety: nothing that runs or loads.
  doc.querySelectorAll('script,foreignObject,iframe,image,use[href^="http"],a').forEach((n) => n.remove())
  doc.querySelectorAll('*').forEach((el) => {
    for (const a of Array.from(el.attributes)) {
      if (/^on/i.test(a.name) || (/href$/i.test(a.name) && !a.value.startsWith('#'))) el.removeAttribute(a.name)
    }
  })
  // Gradients: the first takes the palette, the others a lighter mix of it.
  doc.querySelectorAll('linearGradient,radialGradient').forEach((g, i) => {
    const stops = Array.from(g.querySelectorAll('stop'))
    stops.forEach((st, j) => {
      const v = j === 0 ? 'var(--g1)' : j === stops.length - 1 ? 'var(--g2)' : 'color-mix(in srgb, var(--g1), var(--g2))'
      const c = i === 0 ? v : `color-mix(in srgb, ${v} 60%, #fff)`
      st.removeAttribute('stop-color')
      st.setAttribute('style', `stop-color:${c}`)
    })
  })
  // Solid colours on shapes (not inside masks or clip paths) take the palette's first colour.
  doc.querySelectorAll('*').forEach((el) => {
    if (el.closest('mask,clipPath,linearGradient,radialGradient')) return
    for (const k of ['fill', 'stroke']) {
      const v = el.getAttribute(k)
      if (v && !NEUTRAL.test(v.trim())) el.setAttribute(k, 'var(--g1)')
    }
  })
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('aria-hidden', 'true')
  return new XMLSerializer().serializeToString(svg)
}

/** Fetches and prepares the uploaded SVG (once per visit). Empty if it isn't an SVG or can't be read. */
export function loadMark(url: string): Promise<string> {
  if (!/^https:\/\/.+\.svg(\?|$)/i.test(url)) return Promise.resolve('')
  let p = cache.get(url)
  if (!p) {
    p = fetch(url)
      .then((r) => (r.ok ? r.text() : ''))
      .then((t) => (t.length < 200_000 ? recolour(t) : ''))
      .then((svg) => {
        if (svg) keep(url, svg)
        return svg
      })
      .catch(() => '')
    cache.set(url, p)
  }
  return p
}

/** Each copy on the page needs its own ids (gradients, masks), or they clash. */
export function uniqueIds(svg: string, prefix: string): string {
  const ids = Array.from(svg.matchAll(/\bid="([^"]+)"/g), (m) => m[1])
  let out = svg
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out
      .replace(new RegExp(`\\bid="${esc}"`, 'g'), `id="${prefix}${id}"`)
      .replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${prefix}${id})`)
      .replace(new RegExp(`href="#${esc}"`, 'g'), `href="#${prefix}${id}"`)
  }
  return out
}
