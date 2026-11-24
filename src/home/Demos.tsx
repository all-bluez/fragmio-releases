// The home page's live examples. One choice ("Show examples for") changes all of them.
import { useEffect, useRef, useState, type CSSProperties, type JSX, type RefObject } from 'react'
import { KINDS, setKind, useKind, type Kind } from '../makes'
import { EXAMPLES, SOURCES, pane, stars } from './examples'

const reduced = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches
const Html = ({ html, className, style }: { html: string; className?: string; style?: CSSProperties }): JSX.Element => (
  <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
)

// ---- "Show examples for" ----
const KIND_NAMES: Record<Kind, string> = { gaming: 'Gaming', podcast: 'Podcasts', teaching: 'Teaching', vlog: 'Vlogs' }
export function TypePicker(): JSX.Element {
  const kind = useKind()
  return (
    <div className="types" role="group" aria-label="Show examples for">
      <span>Show examples for</span>
      {KINDS.map((k) => (
        <button key={k} type="button" className={kind === k ? 'on' : ''} aria-pressed={kind === k} onClick={() => setKind(k)}>
          {KIND_NAMES[k]}
        </button>
      ))}
    </div>
  )
}

// ---- Hero: the words that take turns ----
const WORDS = ['a week of short clips.', 'ten Shorts in one go.', 'a month of Reels.', 'clips people share.']
export function HeroWords(): JSX.Element {
  const [i, setI] = useState(0)
  const [out, setOut] = useState(false)
  useEffect(() => {
    if (reduced()) return
    let t = 0
    const id = setInterval(() => {
      setOut(true)
      t = window.setTimeout(() => {
        setI((n) => (n + 1) % WORDS.length)
        setOut(false)
      }, 350)
    }, 2800)
    return () => {
      clearInterval(id)
      clearTimeout(t)
    }
  }, [])
  return <span className={`rot${out ? ' out' : ''}`}>{WORDS[i]}</span>
}

// ---- Text: type a title, pick a style (the styles take turns until the visitor touches them) ----
const STYLES: [string, string][] = [
  ['hook', 'Creator hook'],
  ['box', 'Line box'],
  ['clean', 'Clean'],
  ['script', 'Script']
]
export function CaptionDemo(): JSX.Element {
  const kind = useKind()
  const [text, setText] = useState(EXAMPLES[kind].caption)
  const [typed, setTyped] = useState(false)
  const [style, setStyle] = useState('hook')
  const [auto, setAuto] = useState(() => !reduced())
  useEffect(() => {
    if (!typed) setText(EXAMPLES[kind].caption)
  }, [kind, typed])
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setStyle((s) => STYLES[(STYLES.findIndex(([k]) => k === s) + 1) % STYLES.length][0]), 2400)
    return () => clearInterval(id)
  }, [auto])
  const t = stars(text || 'Your title here')
  return (
    <div className="panel demo">
      <div className="ctl">
        <span className="lab muted" style={{ fontSize: '13px' }}>
          Try it: type your title
        </span>
        <input
          value={text}
          maxLength={60}
          aria-label="Your title"
          onChange={(e) => {
            setText(e.target.value)
            setTyped(true)
            setAuto(false)
          }}
        />
        <span className="lab muted" style={{ fontSize: '13px' }}>
          Style
        </span>
        <div className="styles">
          {STYLES.map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={style === k ? 'on' : ''}
              aria-pressed={style === k}
              onClick={() => {
                setStyle(k)
                setAuto(false)
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hint">Put *stars* around a word to highlight it.</p>
      </div>
      <div className="phone">
        <div className="ppl" />
        <Html className={`cap-out ${style}`} html={style === 'box' ? `<span>${t}</span>` : t} />
      </div>
    </div>
  )
}

// ---- Auto clips: the scan plays the first time it is seen, and again for a new kind of video ----
export function AutoClipsDemo(): JSX.Element {
  const kind = useKind()
  const t = EXAMPLES[kind]
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(0) // each run restarts the animation
  const [found, setFound] = useState(false)
  const seen = useRef(false)

  useEffect(() => {
    if (reduced()) {
      setFound(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((x) => x.isIntersecting) && !seen.current) {
          seen.current = true
          setRun((n) => n + 1)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  // A new kind of video plays the scan again (once it has been seen).
  const first = useRef(true)
  useEffect(() => {
    if (first.current) return void (first.current = false)
    if (seen.current && !reduced()) setRun((n) => n + 1)
  }, [kind])
  useEffect(() => {
    if (!run) return
    setFound(false)
    const id = setTimeout(() => setFound(true), 2400)
    return () => clearTimeout(id)
  }, [run])

  return (
    <div ref={ref} key={run} className={`panel aip${reduced() ? '' : ' anim'}${run ? ' play' : ''}`}>
      <div className="aihead">
        {found ? (
          <span>
            Moments found <b>3</b>
          </span>
        ) : (
          <span>Finding moments…</span>
        )}
        <span className="aiuse">Using: NVIDIA graphics</span>
      </div>
      <div className="scan" aria-hidden="true">
        <div className="mw" />
        <i className="hl h1" />
        <i className="hl h2" />
        <i className="hl h3" />
        <b className="head" />
      </div>
      <div id="moments">
        {t.moments.map(([name, time, score], i) => (
          <div key={name} className={`mo${i === 2 ? ' off' : ''}`}>
            <i className="ck" />
            <div>
              <b>{name}</b>
              <small>{time}</small>
            </div>
            <span className="sc">{score}</span>
            <span className="pl" />
          </div>
        ))}
      </div>
      <div className="aibtn">Add 2 clips</div>
      <div className="aiout">
        {t.phones.map((c) => (
          <Html key={c} className={`ph9${t.split ? ' sp' : ''}`} html={(t.split ? '<i></i><i></i>' : '<i></i>') + `<span>${stars(c)}</span>`} />
        ))}
        <p>
          Each moment arrives on the timeline as a 9:16 clip, already framed and captioned.{' '}
          <button type="button" className="again" onClick={() => setRun((n) => n + 1)}>
            Watch again
          </button>
        </p>
      </div>
    </div>
  )
}

// ---- Before and after ----
export function BeforeAfter(): JSX.Element {
  const t = EXAMPLES[useKind()]
  const [x, setX] = useState(30)
  const cap = `<div class="capx">${stars(t.phones[0])}</div>`
  return (
    <div className="panel bap">
      <div className="ba" style={{ '--x': `${x}%` }}>
        <Html className="ba-before" html={t.before()} />
        <Html
          className="ba-after"
          html={`<div class="blur">${t.before()}</div><div class="phn" style="grid-template-rows:${t.split ? '1fr 1fr' : '1fr'}">${t.after(cap)}</div>`}
        />
        <div className="ba-line">
          <span className="ba-knob">‹ ›</span>
        </div>
        <input type="range" min="0" max="100" value={x} onChange={(e) => setX(Number(e.target.value))} aria-label="Drag to compare before and after" />
      </div>
      <div className="ba-labels">
        <span>Before · 16:9 recording</span>
        <span>After · 9:16 clip</span>
      </div>
    </div>
  )
}

export function BeforeAfterPoints(): JSX.Element {
  const t = EXAMPLES[useKind()]
  return (
    <ul className="points">
      {t.points.map((p) => (
        <li key={p}>
          <span dangerouslySetInnerHTML={{ __html: p }} />
        </li>
      ))}
    </ul>
  )
}

// ---- Try it: framing (layout, shape, background) ----
type Frame = { layout: 'fill' | 'split' | 'trio' | 'bg'; shape: string; bg: string }
const NOTES: Record<Frame['layout'], string> = {
  fill: 'Fill: one person fills the screen, centred on their face.',
  split: 'Split: two boxes, one above the other. Each box has its own crop.',
  trio: 'Trio: three boxes, for three people or a guest and two angles.',
  bg: 'On background: the whole frame, nothing cut off, over a background you choose.'
}
const CONTROLS: { key: keyof Frame; label: string; options: [string, string][] }[] = [
  {
    key: 'layout',
    label: 'Layout',
    options: [
      ['fill', 'Fill'],
      ['split', 'Split'],
      ['trio', 'Trio'],
      ['bg', 'On background']
    ]
  },
  {
    key: 'shape',
    label: 'Shape',
    options: [
      ['9:16', '9:16'],
      ['4:5', '4:5'],
      ['1:1', '1:1'],
      ['4:3', '4:3'],
      ['16:9', '16:9']
    ]
  },
  {
    key: 'bg',
    label: 'Background',
    options: [
      ['blur', 'Blur'],
      ['color', 'Colour'],
      ['gradient', 'Gradient'],
      ['picture', 'Picture']
    ]
  }
]
export function TryFrame(): JSX.Element {
  const kind = useKind()
  const t = EXAMPLES[kind]
  const [fr, setFr] = useState<Frame>({ layout: 'split', shape: '9:16', bg: 'blur' })
  const [w, h] = fr.shape.split(':').map(Number)
  const cap = `<div class="cap" style="${fr.layout === 'bg' ? 'top:9%' : ''}">${stars(t.phones[0])}</div>`
  let html: string
  if (fr.layout === 'bg') {
    const bgl = fr.bg === 'blur' ? `<div class="bgl blurred">${t.before()}</div>` : `<div class="bgl ${fr.bg}"></div>`
    html = bgl + `<div class="onbg">${t.before()}</div>` + cap
  } else {
    const src = SOURCES[kind]()
    const panes = { fill: [src.a], split: [src.a, src.b], trio: [src.a, src.b, src.c] }[fr.layout]
    const dir = w > h ? 'grid-template-columns' : 'grid-template-rows'
    html = `<div class="lay-grid" style="${dir}:repeat(${panes.length},1fr)">${panes.map(pane).join('')}</div>` + cap
  }
  return (
    <div className="panel tryp">
      <span className="try-tag">Try it</span>
      <div className="try-stage">
        <Html className={`tryph${w > h ? ' wide' : ''}`} style={{ aspectRatio: `${w}/${h}` }} html={html} />
      </div>
      <div className="try-ctl">
        {CONTROLS.map((c) => (
          <div className="ctl" key={c.key}>
            <span className="ctl-k" id={`k-${c.key}`}>
              {c.label}
            </span>
            <div className="tseg" role="group" aria-labelledby={`k-${c.key}`}>
              {c.options.map(([v, label]) => {
                const on = fr[c.key] === v && (c.key !== 'bg' || fr.layout === 'bg')
                return (
                  <button
                    key={v}
                    type="button"
                    className={on ? 'on' : ''}
                    aria-pressed={on}
                    onClick={() => setFr({ ...fr, [c.key]: v, ...(c.key === 'bg' ? { layout: 'bg' } : {}) })}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        <p className="muted small" aria-live="polite">
          {NOTES[fr.layout] + (fr.layout === 'bg' ? '' : ' Pick a background to switch to On background.')}
        </p>
      </div>
    </div>
  )
}

// ---- Try it: templates and frames ----
type Tpl = { style: CSSProperties; art: (words: string) => JSX.Element }
const TEMPLATES: Tpl[] = [
  { style: { background: 'linear-gradient(170deg,#1C2126,var(--a))' }, art: (w) => <span style={{ top: '12%' }}>{w}</span> },
  {
    style: { background: 'linear-gradient(170deg,var(--asoft),color-mix(in srgb,var(--g2) 55%,#fff))', padding: '8%' },
    art: (w) => (
      <>
        <div
          style={{ height: '100%', borderRadius: '8px', background: 'linear-gradient(135deg,var(--g1),var(--g2))', boxShadow: '0 8px 20px rgba(0,0,0,.2)' }}
        />
        <span style={{ top: '44%' }}>{w}</span>
      </>
    )
  },
  {
    style: { background: '#F2EDE4' },
    art: (w) => (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '10% 10% 30%',
            background: '#fff',
            padding: '5%',
            transform: 'rotate(-3deg)',
            boxShadow: '0 6px 16px rgba(0,0,0,.15)'
          }}
        >
          <div style={{ height: '100%', background: 'linear-gradient(135deg,var(--g1),var(--g2))' }} />
        </div>
        <span style={{ bottom: '10%', color: '#1C2126', fontFamily: 'Georgia,serif', fontStyle: 'italic', fontWeight: 600 }}>{w}</span>
      </>
    )
  },
  {
    style: { background: '#111417', display: 'grid', gridTemplateRows: '1fr 1fr', gap: '3px', padding: '3px' },
    art: (w) => (
      <>
        <i style={{ borderRadius: '6px', background: 'linear-gradient(135deg,var(--g1),color-mix(in srgb,var(--g2) 55%,#fff))' }} />
        <i style={{ borderRadius: '6px', background: 'linear-gradient(135deg,var(--g2),color-mix(in srgb,var(--g2) 55%,#fff))' }} />
        <span style={{ top: '47%', background: '#FFD84D', color: '#1C2126', width: 'auto', left: '20%', right: '20%', padding: '2px' }}>{w}</span>
      </>
    )
  },
  {
    style: { background: 'linear-gradient(170deg,var(--fb1),#111417)' },
    art: (w) => (
      <>
        <div style={{ position: 'absolute', inset: '22% 0', background: 'linear-gradient(135deg,var(--g1),var(--g2))' }} />
        <span style={{ bottom: '8%', fontSize: '9px', fontWeight: 600, opacity: 0.85 }}>@yourchannel</span>
        {w && <span style={{ top: '10%' }}>{w}</span>}
      </>
    )
  }
]
const THUMB_WORDS = ['WAIT FOR IT', '', 'day one', 'HOT TAKE', '']
const FRAMES: [string, string][] = [
  ['none', 'None'],
  ['white', 'White border'],
  ['round', 'Rounded'],
  ['film', 'Film'],
  ['glow', 'Glow'],
  ['polaroid', 'Photo']
]
export function TryTemplates(): JSX.Element {
  const [tpl, setTpl] = useState(0)
  const [words, setWords] = useState('Wait for it')
  const [frame, setFrame] = useState('none')
  const shown = (words.trim() || 'Your words').toUpperCase()
  return (
    <div className="tplay">
      <div className="try-stage">
        <span className="try-tag">Try it</span>
        <div className={`tryph big${frame === 'none' ? '' : ' fr-' + frame}`}>
          <div className="tpbody" style={TEMPLATES[tpl].style}>
            {TEMPLATES[tpl].art(shown)}
          </div>
        </div>
        <label className="tin">
          <span>Your words</span>
          <input value={words} maxLength={40} onChange={(e) => setWords(e.target.value)} />
        </label>
      </div>
      <div className="tpick">
        <h3>Templates</h3>
        <div className="tpls pick" role="group" aria-label="Templates">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              type="button"
              className={`tp${tpl === i ? ' on' : ''}`}
              style={t.style}
              aria-label={`Template ${i + 1}`}
              aria-pressed={tpl === i}
              onClick={() => setTpl(i)}
            >
              {i === 1 ? (
                <div
                  style={{
                    height: '100%',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg,var(--g1),var(--g2))',
                    boxShadow: '0 8px 20px rgba(0,0,0,.2)'
                  }}
                />
              ) : (
                t.art(THUMB_WORDS[i])
              )}
            </button>
          ))}
        </div>
        <h3>Frames</h3>
        <div className="frames" role="group" aria-label="Frames">
          {FRAMES.map(([k, label]) => (
            <button key={k} type="button" className={frame === k ? 'on' : ''} aria-pressed={frame === k} onClick={() => setFrame(k)}>
              {label}
            </button>
          ))}
        </div>
        <p className="muted small">Fragmio has 30 of each. Pick one, swap the words, done.</p>
      </div>
    </div>
  )
}

/** Sections fade in once as they come into view. */
export function useReveal(root: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const els = root.current ? Array.from(root.current.querySelectorAll('.reveal, #exprows')) : []
    if (reduced()) return void els.forEach((el) => el.classList.add('in'))
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (!x.isIntersecting) return
          x.target.classList.add('in')
          io.unobserve(x.target)
        }),
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [root])
}
