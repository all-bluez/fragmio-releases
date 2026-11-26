// Everything the pages need to know about the current release and the links, from config.js and version.json.
// Both are written by the release automation, and each push redeploys the site, so the bundled copy is always current.
import '../config.js'
import versionFile from '../version.json'
import { hubData } from './hub'

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
const hub = (c.hubUrl || 'https://allbluez-hub.vercel.app').replace(/\/+$/, '')
// The download buttons start the installer itself; GitHub's release page is only the fallback.
const installer = isVersion(version) && c.installerUrl ? c.installerUrl.replace(/\{v\}/g, version) : ''

export const site = {
  // The switches in Admin → Apps → Fragmio. Until the hub answers: pricing only once a stable version is out,
  // invite-only (the access form) during alpha and beta, support and downloads on.
  get showPricing(): boolean {
    return hubData()?.switches.pricing ?? channel === 'stable'
  },
  get invite(): boolean {
    return hubData()?.switches.invite ?? channel !== 'stable'
  },
  get showSupport(): boolean {
    return hubData()?.switches.support ?? true
  },
  get downloads(): boolean {
    return hubData()?.switches.downloads ?? true
  },
  version,
  channel,
  stable: channel === 'stable',
  channelLabel: channel === 'stable' ? 'Free' : `Free ${channel}`,
  date: pretty(v.date) ?? c.date ?? '',
  installerUrl: installer,
  // Every download button: /get starts the newest installer (newest stable once there is one), from GitHub.
  downloadHref: '/get',
  downloadName: 'the newest installer (.exe)',
  latestUrl: c.downloadUrl || 'https://github.com/all-bluez/fragmio-releases/releases/latest',
  releasesUrl: c.releasesUrl || 'https://github.com/all-bluez/fragmio-releases/releases',
  hubUrl: hub,
  // Payments happen on the hub's Pay page, drawn in Fragmio's colours.
  buyProUrl: `${hub}/pay?app=fragmio`,
  supportUrl: `${hub}/pay?app=support`,
  portfolioUrl: 'https://zeeshan-ahmad-khan.vercel.app',
  feedbackFormUrl: c.feedbackFormUrl ?? '',
  youtubeChannel: c.youtubeChannel ?? '',
  tutorials: c.tutorials ?? []
}

/** "Buy now" for a plan: the hub's Pay page with that plan chosen (stable), or Get access during the beta. */
export function buyLink(plan: string): { href: string; label: string } {
  if (!site.stable) return { href: '/download#access', label: 'Free in the beta' }
  return { href: `${hub}/pay?app=fragmio&plan=${encodeURIComponent(plan)}`, label: 'Buy now' }
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
