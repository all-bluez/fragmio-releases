// Everything the pages need to know about the current release and the links, from config.js and version.json.
// Both are written by the release automation, and each push redeploys the site, so the bundled copy is always current.
import '../config.js'
import versionFile from '../version.json'

const c = window.FRAGMIO ?? {}
const v = versionFile as { version?: string; channel?: string; date?: string }
const isVersion = (x?: string): x is string => !!x && /^\d+\.\d+\.\d+/.test(x)

const version = isVersion(v.version) ? v.version : (c.version ?? '')
const channel = (v.channel || c.channel || 'stable').toLowerCase()
const pretty = (iso?: string): string | null => {
  if (!iso) return null
  const d = new Date(iso + 'T12:00:00')
  return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
const hub = (c.hubUrl ?? '').replace(/\/+$/, '')
// The download buttons start the installer itself; GitHub's release page is only the fallback.
const installer = isVersion(version) && c.installerUrl ? c.installerUrl.replace(/\{v\}/g, version) : ''

export const site = {
  // Pricing (the section and its menu link) shows only once a stable version is out; hidden during alpha and beta.
  showPricing: channel === 'stable',
  version,
  channel,
  stable: channel === 'stable',
  channelLabel: channel === 'stable' ? 'Free' : `Free ${channel}`,
  date: pretty(v.date) ?? c.date ?? '',
  installerUrl: installer,
  downloadHref: installer || c.downloadUrl || '/download',
  downloadName: installer ? `Fragmio-${version}-setup.exe` : 'the installer',
  latestUrl: c.downloadUrl || 'https://github.com/all-bluez/fragmio-releases/releases/latest',
  releasesUrl: c.releasesUrl || 'https://github.com/all-bluez/fragmio-releases/releases',
  hubUrl: hub || 'https://allbluez-hub.vercel.app',
  buyProUrl: hub ? `${hub}/pay?app=fragmio` : '#',
  razorpayUrl: c.razorpayUrl || (hub ? `${hub}/pay?app=support` : ''),
  upiId: c.upiId ?? '',
  feedbackFormUrl: c.feedbackFormUrl ?? '',
  youtubeChannel: c.youtubeChannel ?? '',
  tutorials: c.tutorials ?? []
}

/** "Buy now" for a plan: the hub's Pay page with that plan chosen (stable), or Get access during the beta. */
export function buyLink(plan: string): { href: string; label: string } {
  if (!site.stable) return { href: '/download#access', label: 'Free in the beta' }
  return { href: hub ? `${hub}/pay?app=fragmio&plan=${encodeURIComponent(plan)}` : '#', label: 'Buy now' }
}

/** One page view for the hub's Analytics: no cookies, nothing about the visitor (see api/hit.js). */
export function countView(path: string): void {
  try {
    if (!location.protocol.startsWith('http') || /^(localhost|127\.)/.test(location.hostname)) return
    const hit = JSON.stringify({ p: path, r: document.referrer })
    if (navigator.sendBeacon) navigator.sendBeacon('/api/hit', new Blob([hit], { type: 'application/json' }))
    else void fetch('/api/hit', { method: 'POST', body: hit, headers: { 'Content-Type': 'application/json' }, keepalive: true })
  } catch {
    /* not counted */
  }
}

export const store = {
  get: (k: string): string | null => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k: string, val: string): void => {
    try {
      localStorage.setItem(k, val)
    } catch {
      /* not kept */
    }
  }
}
