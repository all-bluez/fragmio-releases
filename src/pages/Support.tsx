// Support the maker: the hub's Pay page (UPI, card, netbanking, wallets through Razorpay), in Fragmio's colours.
import type { JSX } from 'react'
import { usePageMeta } from '../router'
import { site } from '../site'

const AMOUNTS = [49, 99, 199, 499]

export function Support(): JSX.Element {
  usePageMeta('Support Fragmio', 'Support the maker of Fragmio with UPI, card or netbanking.')
  return (
    <section className="page w">
      <h1>Support Fragmio</h1>
      <p className="lead">Hi, I&apos;m ZAK. I build Fragmio on my own. If it saves you time, a small contribution helps me keep it going and make it better.</p>
      <div className="two">
        <div className="panel support-pay">
          <h2 style={{ fontSize: '20px' }}>Pay any amount</h2>
          <p className="muted" style={{ margin: '4px 0 16px' }}>
            UPI, cards, netbanking or wallets, on a secure page by Razorpay. You get a receipt by email.
          </p>
          <div className="amounts">
            {AMOUNTS.map((a) => (
              <a key={a} className="btn ghost" href={`${site.supportUrl}&amount=${a}`}>
                ₹{a}
              </a>
            ))}
          </div>
          <a className="btn" href={site.supportUrl}>
            Support Fragmio
          </a>
          <p className="muted small" style={{ marginTop: '14px' }}>
            Payments are handled by{' '}
            <a href={site.hubUrl} style={{ color: 'var(--a)' }}>
              allbluez.
            </a>
            , Fragmio&apos;s maker.{' '}
            <a href={`${site.hubUrl}/refunds`} style={{ color: 'var(--a)' }}>
              Refunds
            </a>
          </p>
        </div>
        <div className="stack">
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
