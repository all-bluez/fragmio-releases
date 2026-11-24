// Private beta: "Get access" sends the email to api/request-access.js, which emails the invite code.
// The visitor stays on the page.
import { useState, type FormEvent, type JSX } from 'react'
import { useMakes } from '../makes'
import { usePlace } from '../router'

type State = { kind: 'idle' | 'sending' | 'bad' | 'done' | 'manual'; text?: string; email?: string }

export function AccessForm({ withMakes, buttonClass = 'btn' }: { withMakes?: boolean; buttonClass?: string }): JSX.Element {
  const picked = useMakes()
  const place = usePlace()
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function submit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement>
    const email = f.email.value.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setState({ kind: 'bad', text: 'Please enter a valid email address.' })
    setState({ kind: 'sending', text: 'Sending…' })
    try {
      const r = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, makes: withMakes ? f.makes.value : picked, website: f.website.value })
      })
      const res = (await r.json().catch(() => ({ ok: false }))) as { ok?: boolean; manual?: boolean; error?: string }
      if (res.ok) setState({ kind: res.manual ? 'manual' : 'done', email })
      else setState({ kind: 'bad', text: res.error || 'Something went wrong. Please try again in a minute.' })
    } catch {
      setState({ kind: 'bad', text: 'No connection. Please try again.' })
    }
  }

  if (state.kind === 'manual')
    return (
      <p className="access-msg" role="status">
        Thanks! We&apos;ll email your invite code to {state.email} soon.
      </p>
    )
  if (state.kind === 'done')
    return (
      <p className="access-msg" role="status">
        Done! Check {state.email} for your invite code (and your spam folder), then{' '}
        <a href={place.path === '/download' ? '#download-installer' : '/download'}>download Fragmio</a>.
      </p>
    )
  return (
    <>
      <form className="access-form" noValidate onSubmit={(e) => void submit(e)}>
        <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required aria-label="Your email" />
        {withMakes && (
          <select name="makes" aria-label="What do you make? (optional)" defaultValue={picked}>
            <option value="">What do you make? (optional)</option>
            <option>Gaming</option>
            <option>Podcasts</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        )}
        <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className={buttonClass} type="submit" disabled={state.kind === 'sending'}>
          Get access
        </button>
      </form>
      <p className={`access-msg${state.kind === 'bad' ? ' bad' : ''}`} role="status">
        {state.text}
      </p>
    </>
  )
}
