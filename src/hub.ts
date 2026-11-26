// Fragmio's content from the allbluez. hub (Admin → Apps → Fragmio): its pages (Privacy, Terms, anything you
// add), its switches (pricing, invite-only, support, downloads), its plans and your contact details.
// Fetched once per visit; the last answer is kept so the next visit draws straight away.
import { useEffect, useState } from 'react'

export type HubPage = { path: string; title: string; description?: string; updated?: string; footer?: boolean; body: string }
export type HubProduct = { slug: string; name: string; price_paise: number; months: number | null; badge?: string; active?: boolean }
export type HubApp = {
  pages: HubPage[]
  switches: { pricing?: boolean; invite?: boolean; support?: boolean; downloads?: boolean }
  products: HubProduct[]
  owner: { name?: string; studio?: string; email?: string; phone?: string }
  hub: { url?: string; pay?: string; support?: string; terms?: string; privacy?: string; refunds?: string; contact?: string }
}

const KEY = 'fr-hub'
const HUB = ((window.FRAGMIO?.hubUrl ?? '') || 'https://allbluez-hub.vercel.app').replace(/\/+$/, '')

function kept(): HubApp | null {
  try {
    const x = JSON.parse(localStorage.getItem(KEY) || 'null') as HubApp | null
    return x && Array.isArray(x.pages) ? x : null
  } catch {
    return null
  }
}

let data: HubApp | null = kept()
let done = false
const listeners = new Set<() => void>()
let loading: Promise<void> | null = null

function load(): Promise<void> {
  loading ??= fetch(`${HUB}/api/app?slug=fragmio`)
    .then((r) => r.json())
    .then((d: { ok?: boolean } & HubApp) => {
      if (!d.ok) return
      data = { pages: d.pages ?? [], switches: d.switches ?? {}, products: d.products ?? [], owner: d.owner ?? {}, hub: d.hub ?? {} }
      try {
        localStorage.setItem(KEY, JSON.stringify(data))
      } catch {
        /* not kept */
      }
    })
    .catch(() => undefined)
    .finally(() => {
      done = true
      listeners.forEach((f) => f())
    })
  return loading
}

/** The hub's data now (null until it first answers on this browser). */
export const hubData = (): HubApp | null => data

/** Re-draws the caller when the hub answers. `ready` is true once it has (or failed). */
export function useHubApp(): { app: HubApp | null; ready: boolean } {
  const [, tick] = useState(0)
  useEffect(() => {
    const f = (): void => tick((n) => n + 1)
    listeners.add(f)
    void load()
    return () => void listeners.delete(f)
  }, [])
  return { app: data, ready: done || !!data }
}
