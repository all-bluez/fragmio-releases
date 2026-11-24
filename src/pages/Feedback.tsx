// Feedback: the app opens this page with ?type=problem&app=1.16.3&channel=beta&os=Windows 11.
// The form sends to api/feedback.js, which saves the message and emails it to the maker.
import { useState, type FormEvent, type JSX } from 'react'
import { usePageMeta, usePlace } from '../router'

type Kind = 'idea' | 'problem' | 'like'
const KINDS: [Kind, string][] = [
  ['idea', 'Idea'],
  ['problem', 'Problem'],
  ['like', 'Something I like']
]
type State = { kind: 'idle' | 'sending' | 'bad' | 'done'; text?: string }

export function Feedback(): JSX.Element {
  const q = new URLSearchParams(usePlace().search)
  const [kind, setKind] = useState<Kind>(q.get('type') === 'problem' ? 'problem' : 'idea')
  const [state, setState] = useState<State>({ kind: 'idle' })
  const problem = kind === 'problem'
  usePageMeta(q.get('type') === 'problem' ? 'Report a problem · Fragmio' : 'Send feedback · Fragmio', 'Tell us what you like and what Fragmio should do next.')
  const version = q.get('app') ?? ''
  const channel = q.get('channel') ?? ''
  const os = q.get('os') ?? ''

  async function submit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement>
    const message = f.message.value.trim()
    const name = f.name.value.trim()
    const email = f.email.value.trim()
    if (message.length < 5) return setState({ kind: 'bad', text: 'Please write a little more.' })
    if (name.length < 2) return setState({ kind: 'bad', text: 'Please enter your name.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setState({ kind: 'bad', text: 'Please enter a valid email address.' })
    setState({ kind: 'sending', text: 'Sending…' })
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, message, name, email, version, channel, os, website: f.website.value })
      })
      const res = (await r.json().catch(() => ({ ok: false }))) as { ok?: boolean; error?: string }
      if (res.ok) setState({ kind: 'done' })
      else setState({ kind: 'bad', text: res.error || 'Something went wrong. Please try again in a minute.' })
    } catch {
      setState({ kind: 'bad', text: 'No connection. Please try again.' })
    }
  }

  return (
    <section className="page w">
      <h1>{q.get('type') === 'problem' ? 'Report a problem' : 'Send feedback'}</h1>
      <p className="lead">
        {q.get('type') === 'problem'
          ? 'Tell us what happened and what you expected. Every report is read.'
          : "What do you like, what's confusing, and what should Fragmio do next? Every message is read."}
      </p>
      <div className="panel">
        {state.kind === 'done' ? (
          <div className="fb-done" role="status">
            <h3>Thank you!</h3>
            <p className="muted">Your message reached us. If we need to know more, we&apos;ll reply to your email.</p>
            <button type="button" className="btn ghost" onClick={() => setState({ kind: 'idle' })}>
              Send another
            </button>
          </div>
        ) : (
          <form className="fb-form" noValidate onSubmit={(e) => void submit(e)}>
            <fieldset>
              <legend>What is it about?</legend>
              <div className="fb-kinds">
                {KINDS.map(([k, label]) => (
                  <label key={k} className={kind === k ? 'on' : ''}>
                    <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="fb-field">
              <span>{problem ? 'What happened?' : 'Your message'}</span>
              <textarea
                name="message"
                rows={7}
                maxLength={5000}
                required
                placeholder={
                  problem
                    ? 'What you did, what you expected, and what happened instead. If you can, paste the last lines of the log too (Help → Open log folder in the app).'
                    : 'Tell us anything. Ideas, what you love, what got in your way.'
                }
              />
            </label>
            <div className="fb-two">
              <label className="fb-field">
                <span>Your name</span>
                <input type="text" name="name" autoComplete="name" required maxLength={80} placeholder="Your name" />
              </label>
              <label className="fb-field">
                <span>Your email</span>
                <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
              </label>
            </div>
            <small className="fb-note">So we can reply. We never share your details or send you anything else.</small>
            {version && (
              <p className="fb-about">
                Sent with your version: <b>Fragmio {version}{channel ? ` ${channel}` : ''}</b>
                {os ? ` · ${os}` : ''}
              </p>
            )}
            <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="fb-send">
              <button className="btn" type="submit" disabled={state.kind === 'sending'}>
                {state.kind === 'sending' ? 'Sending…' : 'Send'}
              </button>
              <p className={`access-msg${state.kind === 'bad' ? ' bad' : ''}`} role="status">
                {state.kind === 'bad' ? state.text : ''}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
