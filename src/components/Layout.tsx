// The header, footer and colour picker around every page.
import { useEffect, useState, type JSX, type ReactNode } from 'react'
import { site, store } from '../site'
import { usePlace } from '../router'
import { AllbluezLogo, FragmioMark } from './Logos'

const PALETTES: [string, string, string][] = [
  ['berry', 'Berry', 'linear-gradient(135deg,#D6336C,#7048E8)'],
  ['duo', 'Duo: teal light, berry dark', 'linear-gradient(135deg,#0E9F8E 50%,#D6336C 50%)'],
  ['teal', 'Teal', 'linear-gradient(135deg,#0E9F8E,#2E7BF2)'],
  ['aurora', 'Aurora', 'linear-gradient(135deg,#0EA5A4,#8B5CF6)'],
  ['sunset', 'Sunset', 'linear-gradient(135deg,#F76707,#D6336C)'],
  ['ocean', 'Ocean', 'linear-gradient(135deg,#0EA5E9,#4F46E5)'],
  ['grape', 'Grape', 'linear-gradient(135deg,#7048E8,#F06595)'],
  ['forest', 'Forest', 'linear-gradient(135deg,#2B8A3E,#1098AD)']
]

const NAV: [string, string][] = (
  [
    ['/#features', 'Features'],
    ['/#templates', 'Templates'],
    ['/#pricing', 'Pricing'],
    ['/#faq', 'FAQ'],
    ['/download', 'Download'],
    ['/feedback', 'Feedback']
  ] as [string, string][]
).filter(([href]) => site.showPricing || href !== '/#pricing')

function MoonSun(): JSX.Element {
  return (
    <>
      <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </>
  )
}

export function Layout({ children }: { children: ReactNode }): JSX.Element {
  const place = usePlace()
  const [menu, setMenu] = useState(false)
  const [pal, setPal] = useState(() => document.documentElement.dataset.pal || 'berry')

  // Light / dark and the palette live on <html>, set before the page draws (see index.html).
  const toggleMode = (): void => {
    const r = document.documentElement
    r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark'
    store.set('fr-theme', r.dataset.theme)
  }
  useEffect(() => {
    document.documentElement.dataset.pal = pal
    store.set('fr-palette', pal)
  }, [pal])

  // The phone menu closes on a new page, Escape, or a wide window.
  useEffect(() => setMenu(false), [place.path, place.hash])
  useEffect(() => {
    const key = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setMenu(false)
    }
    const size = (): void => {
      if (innerWidth > 960) setMenu(false)
    }
    addEventListener('keydown', key)
    addEventListener('resize', size)
    return () => {
      removeEventListener('keydown', key)
      removeEventListener('resize', size)
    }
  }, [])

  const links = (
    <>
      {NAV.map(([href, label]) => (
        <a key={href} href={href} aria-current={place.path === href ? 'page' : undefined}>
          {label}
        </a>
      ))}
      <a href={site.releasesUrl} target="_blank" rel="noopener">
        Changelog
      </a>
    </>
  )

  return (
    <>
      <header className="nav">
        <div className="w">
          <a className="logo" href="/">
            <FragmioMark />
            Fragmio {!site.stable && <span className="beta">{site.channel.toUpperCase()}</span>}
          </a>
          <nav>{links}</nav>
          <div className="r">
            <button className="icon-btn" type="button" aria-label="Switch light or dark" onClick={toggleMode}>
              <MoonSun />
            </button>
            {site.stable ? (
              <a href="/download" className="btn">
                Download
              </a>
            ) : (
              <a href="/#get" className="btn">
                Get access
              </a>
            )}
            <button
              className="icon-btn menu-btn"
              type="button"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mnav"
              onClick={() => setMenu(!menu)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path className="l1" d="M4 7h16" />
                <path className="l2" d="M4 12h16" />
                <path className="l3" d="M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="mnav" id="mnav" hidden={!menu}>
          {links}
          <a className="btn" href="/download">
            Download for Windows
          </a>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <div className="w">
          <div className="fcols">
            <div>
              <a className="logo" href="/" style={{ margin: '0 0 10px' }}>
                <FragmioMark />
                Fragmio
              </a>
              <p className="muted" style={{ fontSize: '13.5px', maxWidth: '30ch' }}>
                Turn one long video into many short clips, on your own PC.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="/download">Download</a>
              <a href={site.releasesUrl} target="_blank" rel="noopener">
                All releases
              </a>
              <a href={site.releasesUrl} target="_blank" rel="noopener">
                Changelog
              </a>
              <a href="/#features">Features</a>
            </div>
            <div>
              <h4>Help</h4>
              <a href="/feedback">Send feedback</a>
              <a href="/feedback?type=problem">Report a problem</a>
              <a href="/#faq">FAQ</a>
              <a href="/#privacy">Privacy</a>
            </div>
            <div>
              <h4>ZAK</h4>
              <a href="/support">Support the maker</a>
              <a href="https://github.com/zeeshan-ahmad-khan" target="_blank" rel="noopener">
                GitHub
              </a>
              <a href="https://zeeshan-ahmad-khan.netlify.app/" target="_blank" rel="noopener">
                Resume
              </a>
            </div>
          </div>
          <div className="fb">
            <span>
              © {new Date().getFullYear()}{' '}
              <a className="by-ab" href={site.hubUrl}>
                Fragmio by{' '}
                <span className="inline-logo">
                  <AllbluezLogo />
                </span>
              </a>
            </span>
            <span>
              Made with <span className="heart">♥</span> by <a href="/support">ZAK</a>
            </span>
          </div>
        </div>
      </footer>
      <div className="picker" role="group" aria-label="Website colours">
        {PALETTES.map(([p, name, bg]) => (
          <button
            key={p}
            type="button"
            data-name={name}
            aria-label={name}
            aria-pressed={pal === p}
            className={pal === p ? 'on' : ''}
            style={{ background: bg }}
            onClick={() => setPal(p)}
          />
        ))}
        <hr />
        <button className="mode" type="button" data-name="Light / dark" aria-label="Switch light or dark" onClick={toggleMode}>
          <MoonSun />
        </button>
      </div>
    </>
  )
}
