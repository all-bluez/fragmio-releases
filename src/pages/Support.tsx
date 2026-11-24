// Support the maker: UPI (QR code and ID) and card / netbanking through the hub's Pay page or a Razorpay link.
import { useState, type JSX } from 'react'
import { usePageMeta } from '../router'
import { site } from '../site'

export function Support(): JSX.Element {
  usePageMeta('Support Fragmio', 'Support the maker of Fragmio with UPI, card or netbanking.')
  const [qr, setQr] = useState(true)
  const [copied, setCopied] = useState(false)
  return (
    <section className="page w">
      <h1>Support Fragmio</h1>
      <p className="lead">Hi, I&apos;m ZAK. I build Fragmio on my own. If it saves you time, a small contribution helps me keep it going and make it better.</p>
      <div className="two">
        <div className="panel">
          <h2 style={{ fontSize: '20px' }}>Pay with UPI</h2>
          <p className="muted" style={{ margin: '4px 0 16px' }}>
            Scan with any UPI app: Google Pay, PhonePe, Paytm or your bank&apos;s app.
          </p>
          {/* Put your QR code in public/support-qr.png */}
          <div className="qr">
            {qr ? <img src="/support-qr.png" alt="UPI QR code" onError={() => setQr(false)} /> : 'Your QR code goes here (public/support-qr.png)'}
          </div>
          {site.upiId && (
            <p className="upi">
              UPI ID: <b>{site.upiId}</b>{' '}
              <button
                className="btn ghost"
                type="button"
                style={{ padding: '5px 12px' }}
                onClick={() => void navigator.clipboard.writeText(site.upiId).then(() => setCopied(true))}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </p>
          )}
        </div>
        <div className="stack">
          {site.razorpayUrl && (
            <div className="panel">
              <h3 style={{ fontSize: '16px' }}>Card, netbanking or wallet</h3>
              <p className="muted" style={{ margin: '4px 0 16px' }}>
                A secure payment page by Razorpay.
              </p>
              <a className="btn" href={site.razorpayUrl} target="_blank" rel="noopener">
                Support with Razorpay
              </a>
            </div>
          )}
          <div className="note">
            Can&apos;t pay? That&apos;s fine. <b>Sharing Fragmio</b> with a friend or{' '}
            <a href="/feedback" style={{ color: 'var(--a)' }}>
              sending feedback
            </a>{' '}
            helps just as much.
          </div>
        </div>
      </div>
    </section>
  )
}
