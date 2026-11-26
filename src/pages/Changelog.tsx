// What's new in each version: the release notes from GitHub (through /api/changelog, cached for a few minutes).
import { useEffect, useState, type JSX } from 'react'
import { Rich } from '../components/Rich'
import { usePageMeta } from '../router'
import { site } from '../site'

type Release = { version: string; name: string; date: string; pre: boolean; notes: string; url: string }

/** The release's own name, if it says more than the version number. */
const title = (r: Release): string => {
  const t = r.name
    .replace(/^Fragmio\s*/i, '')
    .replace(/^v(?=\d)/i, '')
    .trim()
  return t && t !== r.version ? t : ''
}
const nice = (iso: string): string => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function Changelog(): JSX.Element {
  usePageMeta('Changelog · Fragmio', 'What changed in each version of Fragmio.')
  const [list, setList] = useState<Release[] | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    fetch('/api/changelog')
      .then((r) => r.json())
      .then((d: { ok?: boolean; releases?: Release[] }) => (d.ok ? setList(d.releases ?? []) : setFailed(true)))
      .catch(() => setFailed(true))
  }, [])
  return (
    <section className="page w doc changelog">
      <header className="doc-head">
        <h1>Changelog</h1>
        <p className="muted">What changed in each version of Fragmio. The newest is at the top.</p>
      </header>
      {failed ? (
        <p className="lead">
          Couldn&apos;t load the notes just now.{' '}
          <a href={site.releasesUrl} target="_blank" rel="noopener">
            See them on GitHub
          </a>
          .
        </p>
      ) : !list ? (
        <p className="muted" aria-busy="true">
          Loading…
        </p>
      ) : (
        <ol className="rel-list">
          {list.map((r) => (
            <li key={r.version} id={'v' + r.version}>
              <div className="rel-side">
                <a className="rel-v" href={'#v' + r.version}>
                  {r.version}
                </a>
                {r.pre && <span className="beta">BETA</span>}
                <time dateTime={r.date}>{nice(r.date)}</time>
              </div>
              <div className="rel-notes doc-body">
                {title(r) && <h2>{title(r)}</h2>}
                {r.notes.trim() ? <Rich text={r.notes} /> : <p className="muted">Small fixes and improvements.</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
