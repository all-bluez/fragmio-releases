// Any page made in Admin → Apps → Fragmio (Privacy, Terms, or one you added), at its own address (/privacy…).
import type { JSX } from 'react'
import { Rich } from '../components/Rich'
import { useHubApp } from '../hub'
import { usePageMeta, usePlace } from '../router'

export function Doc({ notFound }: { notFound: () => JSX.Element }): JSX.Element {
  const { path } = usePlace()
  const { app, ready } = useHubApp()
  const page = app?.pages.find((p) => '/' + p.path === path)
  usePageMeta(page ? `${page.title} · Fragmio` : 'Fragmio', page?.description)
  if (!page) return ready ? notFound() : <section className="page w doc" aria-busy="true" />
  const others = (app?.pages ?? []).filter((p) => p !== page && p.footer !== false)
  return (
    <section className="page w doc">
      <header className="doc-head">
        <h1>{page.title}</h1>
        {page.updated && <p className="muted">Last updated {page.updated}</p>}
      </header>
      <div className="doc-body">
        <Rich text={page.body} />
      </div>
      {others.length > 0 && (
        <nav className="doc-more" aria-label="More pages">
          {others.map((p) => (
            <a key={p.path} href={'/' + p.path}>
              {p.title}
            </a>
          ))}
        </nav>
      )}
    </section>
  )
}
