// What the visitor makes (picked with "Show examples for" on the home page). Sent with Get access,
// so the beta list shows it. Remembered in this browser.
import { useSyncExternalStore } from 'react'
import { store } from './site'

export type Kind = 'gaming' | 'podcast' | 'teaching' | 'vlog'
export const KINDS: Kind[] = ['gaming', 'podcast', 'teaching', 'vlog']
export const MAKES: Record<Kind, string> = { gaming: 'Gaming', podcast: 'Podcasts', teaching: 'Education', vlog: 'Other' }

const saved = store.get('fr-type') as Kind | null
let kind: Kind = saved && KINDS.includes(saved) ? saved : 'gaming'
let chosen = !!(saved && KINDS.includes(saved)) // only sent when the visitor picked it
const subs = new Set<() => void>()

export function setKind(k: Kind): void {
  kind = k
  chosen = true
  store.set('fr-type', k)
  subs.forEach((f) => f())
}

const subscribe = (f: () => void): (() => void) => {
  subs.add(f)
  return () => subs.delete(f)
}
export const useKind = (): Kind => useSyncExternalStore(subscribe, () => kind)
export const useMakes = (): string => useSyncExternalStore(subscribe, () => (chosen ? MAKES[kind] : ''))
