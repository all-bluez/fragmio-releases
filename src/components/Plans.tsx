// Pricing: names, prices and badges come live from the hub (you change them in admin → Products).
// The numbers written in the page are shown until the hub answers, or if it can't be reached.
import { useEffect, useState, type JSX } from 'react'
import { buyLink, site } from '../site'

type Product = { slug: string; name: string; price_paise: number; months: number | null; badge?: string }
let loading: Promise<Record<string, Product>> | null = null
function hubProducts(): Promise<Record<string, Product>> {
  loading ??= fetch(`${site.hubUrl}/api/public`)
    .then((r) => r.json())
    .then((d: { ok?: boolean; products?: Product[] }) => Object.fromEntries((d.ok ? (d.products ?? []) : []).map((p) => [p.slug, p])))
    .catch(() => ({}))
  return loading
}
const rupees = (p: number): string => '₹' + (p / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export function BuyButton({ plan, className }: { plan: string; className?: string }): JSX.Element {
  const b = buyLink(plan)
  return (
    <a className={className} href={b.href}>
      {b.label}
    </a>
  )
}

type Fallback = { name: string; price: string; per: string; badge: string }
export function PlanCard({
  slug,
  className,
  buttonClass,
  fallback
}: {
  slug: string
  className?: string
  buttonClass?: string
  fallback: Fallback
}): JSX.Element {
  const [live, setLive] = useState<Product | null>(null)
  useEffect(() => {
    let on = true
    void hubProducts().then((all) => on && setLive(all[slug] ?? null))
    return () => {
      on = false
    }
  }, [slug])
  const name = live?.name ? live.name.replace(/^Fragmio Pro\s*[·:-]?\s*/i, '') || live.name : fallback.name
  const price = live ? rupees(live.price_paise) : fallback.price
  const per = live?.months ? `${rupees(Math.round(live.price_paise / live.months / 100) * 100)} a month` : fallback.per
  const badge = live ? (live.badge ?? '') : fallback.badge
  return (
    <div className={className}>
      {badge && <span className="badge">{badge}</span>}
      <h3>{name}</h3>
      <div className="pr">{price}</div>
      <p className="per">{per}</p>
      <BuyButton plan={slug} className={buttonClass} />
    </div>
  )
}
