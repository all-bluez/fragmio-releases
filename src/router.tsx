// A small router: the pages are plain links (<a href="/download">), and clicks on links to this site
// change the page without reloading it. Links to a section (/#pricing) scroll there once the page is shown.
import { createContext, useContext, useEffect, useState, type JSX, type ReactNode } from 'react'

type Place = { path: string; search: string; hash: string }
const read = (): Place => ({ path: location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/', search: location.search, hash: location.hash })
const Ctx = createContext<Place>(read())
export const usePlace = (): Place => useContext(Ctx)

export function go(href: string): void {
  history.pushState(null, '', href)
  dispatchEvent(new PopStateEvent('popstate'))
}

function scrollToHash(hash: string): void {
  if (!hash) return void scrollTo(0, 0)
  // The new page may still be drawing: try for a moment.
  let tries = 0
  const tick = (): void => {
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    else if (tries++ < 20) setTimeout(tick, 50)
  }
  tick()
}

export function Router({ children }: { children: ReactNode }): JSX.Element {
  const [place, setPlace] = useState(read)
  useEffect(() => {
    const onPop = (): void => {
      const next = read()
      setPlace(next)
      scrollToHash(next.hash)
    }
    const onClick = (e: MouseEvent): void => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === '/get' || url.pathname.startsWith('/api/') || /\.[a-z0-9]+$/i.test(url.pathname)) return
      // Same page, only a section: let the browser scroll.
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return
      e.preventDefault()
      go(url.pathname + url.search + url.hash)
    }
    addEventListener('popstate', onPop)
    document.addEventListener('click', onClick)
    if (location.hash) scrollToHash(location.hash)
    return () => {
      removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])
  return <Ctx.Provider value={place}>{children}</Ctx.Provider>
}

/** Page title and description for the page being shown. */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
