// The download page. /download?get=1 (the button in the invite email) starts the download straight away.
import { useEffect, useState, type JSX } from 'react'
import { AccessForm } from '../components/AccessForm'
import { usePageMeta, usePlace } from '../router'
import { site } from '../site'

export function Download(): JSX.Element {
  usePageMeta('Download Fragmio for Windows', 'Download Fragmio for Windows 10 and 11.')
  const { search } = usePlace()
  const [starting, setStarting] = useState(false)
  useEffect(() => {
    if (!/[?&]get=1\b/.test(search)) return
    setStarting(true)
    const id = setTimeout(() => (location.href = site.downloadHref), 600)
    return () => clearTimeout(id)
  }, [search])
  return (
    <>
      <section className="page w">
        {' '}
        <h1>Download Fragmio</h1>
        {starting && (
          <p className="auto-download" id="auto-download" role="status">
            Your download is starting. Install it, then paste your invite code when Fragmio opens.
          </p>
        )}
        <p className="lead">Free{!site.stable && <span> during the beta</span>}. For Windows 10 and 11 (64-bit).</p>{' '}
        {!site.stable && (
          <div id="access" className="panel access">
            {' '}
            <h2 style={{ fontSize: '20px' }}>Fragmio is in private beta</h2>{' '}
            <p className="muted" style={{ fontSize: '14px', margin: '6px 0 14px' }}>
              The app asks for an invite code when it first opens. Leave your email and we'll send you one.
            </p>{' '}
            <AccessForm withMakes buttonClass="btn" />{' '}
            <p className="muted" style={{ fontSize: '12.5px', marginTop: '8px' }}>
              We'll only use your email to send your invite.
            </p>{' '}
          </div>
        )}{' '}
        <div className="two">
          <div className="panel" id="download-installer">
            <h2 style={{ fontSize: '20px' }}>
              Fragmio <span>{site.version}</span> {!site.stable && <span className="beta">{site.channel.toUpperCase()}</span>}
            </h2>{' '}
            <div className="meta">
              <span>
                Released <span>{site.date}</span>
              </span>
              <span>Windows installer (.exe)</span>
            </div>{' '}
            {!site.stable && (
              <p style={{ fontSize: '13.5px', margin: '0 0 12px' }} className="muted">
                Already have your invite code? Download and install, then enter the code when Fragmio opens.
              </p>
            )}{' '}
            <a className="btn" href={site.downloadHref}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.5l7.5-1v7H3zm0 13l7.5 1v-7H3zm8.5 1.2L21 21v-8.5h-9.5zm0-15.4v7.2H21V3z" />
              </svg>
              Download the installer
            </a>{' '}
            <p className="muted" style={{ fontSize: '13.5px', marginTop: '12px' }}>
              Downloads {site.downloadName}. Didn't start?{' '}
              <a href={site.latestUrl} target="_blank" rel="noopener" style={{ color: 'var(--a)' }}>
                Download it from GitHub
              </a>{' '}
              ·{' '}
              <a style={{ color: 'var(--a)' }} href={site.releasesUrl} target="_blank" rel="noopener">
                Older versions
              </a>
            </p>{' '}
            <h3 style={{ fontSize: '16px', margin: '26px 0 6px' }}>Install</h3>
            <ol className="steps">
              <li>Run the downloaded file. Windows asks for permission once, because Fragmio installs for everyone on this PC.</li>
              <li>
                If Windows says <b>"Windows protected your PC"</b>, click <b>More info → Run anyway</b>. This shows because Fragmio is new, not because anything
                is wrong.
              </li>
              <li>Open Fragmio, start a new project and pick a video.</li>
            </ol>
          </div>{' '}
          <div className="stack">
            <div className="panel">
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Needs</h3>
              <ul className="points">
                <li>
                  <span>Windows 10 or 11, 64-bit</span>
                </li>
                <li>
                  <span>8 GB memory or more</span>
                </li>
                <li>
                  <span>An NVIDIA graphics card makes exports faster, but isn't needed</span>
                </li>
              </ul>
            </div>{' '}
            <div className="note">
              <b>Updating:</b> in Fragmio, click <b>Help → Check for updates</b>. Install the new version over the old one; your projects and saved styles stay.
            </div>
          </div>
        </div>{' '}
      </section>
    </>
  )
}
