// Feedback: the app opens this page with ?type=problem&app=1.16.3&channel=beta&os=Windows 11.
import type { JSX } from 'react'
import { usePageMeta, usePlace } from '../router'
import { site } from '../site'

export function Feedback(): JSX.Element {
  const q = new URLSearchParams(usePlace().search)
  const problem = q.get('type') === 'problem'
  usePageMeta(problem ? 'Report a problem · Fragmio' : 'Send feedback · Fragmio', 'Tell us what you like and what Fragmio should do next.')
  const form = site.feedbackFormUrl
  return (
    <section className="page w">
      <h1>{problem ? 'Report a problem' : 'Send feedback'}</h1>
      <p className="lead">
        {problem
          ? 'Tell us what happened and what you expected. Please attach the newest log file (Help → Open log folder in the app).'
          : "What do you like, what's confusing, and what should Fragmio do next? Every message is read."}
      </p>
      {q.get('app') && (
        <p className="note" style={{ margin: '-8px 0 20px' }}>
          Your version:{' '}
          <b>
            Fragmio {q.get('app')}
            {q.get('channel') ? ` ${q.get('channel')}` : ''} · {q.get('os') || ''}
          </b>
          . Please mention it in the form.
        </p>
      )}
      <div className="panel">
        {form ? (
          <>
            <iframe className="form-frame" title="Feedback form" loading="lazy" src={form + (form.includes('?') ? '&' : '?') + 'embedded=true'} />
            <p style={{ marginTop: '14px' }}>
              <a target="_blank" rel="noopener" href={form} style={{ color: 'var(--a)' }}>
                Open the form in a new tab
              </a>
            </p>
          </>
        ) : (
          <div>
            <h3 style={{ fontSize: '16px' }}>The feedback form is coming soon</h3>
            <p className="muted">Thanks for wanting to help. Please check back in a few days.</p>
          </div>
        )}
      </div>
    </section>
  )
}
