// Page text from Admin → Apps → Fragmio, and release notes from GitHub, as headings, paragraphs and lists.
//   ## Heading   - item   **bold**   `code`   [text](link)   {owner} {studio} {email} {phone}
import { Fragment, type JSX, type ReactNode } from 'react'
import { hubData } from '../hub'

function Inline({ text }: { text: string }): JSX.Element {
  const o = hubData()?.owner ?? {}
  const parts: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\{(owner|studio|email|phone)\}|(https?:\/\/[^\s)]+)/g
  let last = 0
  for (let m = re.exec(text); m; m = re.exec(text)) {
    parts.push(text.slice(last, m.index))
    const k = m.index
    if (m[1]) parts.push(<b key={k}>{m[1]}</b>)
    else if (m[2]) parts.push(<code key={k}>{m[2]}</code>)
    else if (m[3] || m[6]) {
      const href = m[4] ?? m[6]
      const safe = /^(https?:\/\/|\/|mailto:|#)/i.test(href) ? href : '#'
      parts.push(
        <a key={k} href={safe} {...(/^https?:/i.test(safe) ? { target: '_blank', rel: 'noopener' } : {})}>
          {m[3] ?? m[6]}
        </a>
      )
    } else if (m[5] === 'email')
      parts.push(
        o.email ? (
          <a key={k} href={`mailto:${o.email}`}>
            {o.email}
          </a>
        ) : (
          'the email on the contact page'
        )
      )
    else if (m[5] === 'phone') parts.push(o.phone ?? '')
    else if (m[5] === 'owner') parts.push(o.name || 'its maker')
    else parts.push(o.studio || 'AllBlueZ')
    last = k + m[0].length
  }
  parts.push(text.slice(last))
  return <>{parts.map((p, i) => (typeof p === 'string' ? <Fragment key={`t${i}`}>{p}</Fragment> : p))}</>
}

const BULLET = /^\s*[-*•]\s+/
const HEAD = /^(#{1,4})\s+/

export function Rich({ text }: { text: string }): JSX.Element {
  const out: ReactNode[] = []
  // Lines become runs: a heading, list lines, or text lines (an empty line ends a paragraph).
  let run: { kind: 'p' | 'ul'; lines: string[] } | null = null
  const flush = (): void => {
    if (!run) return
    const r = run
    const key = out.length
    out.push(
      r.kind === 'ul' ? (
        <ul key={key}>
          {r.lines.map((l, j) => (
            <li key={j}>
              <Inline text={l.replace(BULLET, '')} />
            </li>
          ))}
        </ul>
      ) : (
        <p key={key}>
          {r.lines.map((l, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              <Inline text={l} />
            </Fragment>
          ))}
        </p>
      )
    )
    run = null
  }
  for (const raw of text.replace(/\r/g, '').split('\n')) {
    const l = raw.trimEnd()
    if (!l.trim()) {
      flush()
      continue
    }
    const h = HEAD.exec(l)
    if (h) {
      flush()
      out.push(h[1].length <= 2 ? <h2 key={out.length}>{l.replace(HEAD, '')}</h2> : <h3 key={out.length}>{l.replace(HEAD, '')}</h3>)
      continue
    }
    const kind = BULLET.test(l) ? 'ul' : 'p'
    if (run && run.kind !== kind) flush()
    run ??= { kind, lines: [] }
    run.lines.push(l)
  }
  flush()
  return <>{out}</>
}
