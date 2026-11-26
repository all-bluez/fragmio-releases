// The Fragmio mark (its colours follow the chosen palette) and the allbluez. wordmark.
import { useId, type JSX } from 'react'

export function FragmioMark(): JSX.Element {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="lg" width="30" height="30" viewBox="10 22 84 56" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--g1)' }} />
          <stop offset="1" style={{ stopColor: 'var(--g2)' }} />
        </linearGradient>
        <mask id={`m${id}`}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="64" cy="30" r="7" fill="#000" />
          <circle cx="64" cy="70" r="7" fill="#000" />
          <path d="M30 40V60L47 50Z" fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        </mask>
        <clipPath id={`a${id}`}>
          <rect width="61" height="100" />
        </clipPath>
        <clipPath id={`b${id}`}>
          <rect x="67" width="33" height="100" />
        </clipPath>
      </defs>
      <g mask={`url(#m${id})`}>
        <rect x="10" y="30" width="80" height="40" rx="8" fill={`url(#g${id})`} clipPath={`url(#a${id})`} />
      </g>
      <g transform="translate(4 -3) rotate(8 78 50)">
        <g mask={`url(#m${id})`}>
          <rect x="10" y="30" width="80" height="40" rx="8" fill={`url(#g${id})`} opacity=".7" clipPath={`url(#b${id})`} />
        </g>
      </g>
    </svg>
  )
}

export function AllbluezLogo(): JSX.Element {
  return (
    <svg className="ab-logo" viewBox="0 0 4889 787" role="img" aria-label="allbluez">
      <g transform="translate(-30 770) scale(1 -1)">
        <g fill="currentColor">
          <path
            transform="translate(0 0)"
            d="M563 0 536 204 564 286 536 367 563 573H801L763 287L801 0ZM614 286Q602 195 561.5 126.5Q521 58 457.5 20.5Q394 -17 312 -17Q229 -17 165.0 21.0Q101 59 65.5 127.5Q30 196 30 286Q30 378 65.5 446.5Q101 515 165.0 552.5Q229 590 312 590Q394 590 457.5 553.0Q521 516 562.0 447.5Q603 379 614 286ZM261 286Q261 248 276.5 219.0Q292 190 320.0 173.0Q348 156 384 156Q421 156 455.0 173.0Q489 190 515.0 219.0Q541 248 553 286Q541 324 515.0 353.5Q489 383 455.0 400.0Q421 417 384 417Q348 417 320.0 400.0Q292 383 276.5 353.5Q261 324 261 286Z"
          />
          <path transform="translate(799 0)" d="M52 770H281V0H52Z" />
          <path transform="translate(1093 0)" d="M52 770H281V0H52Z" />
          <path
            transform="translate(1387 0)"
            d="M52 770H281V417L253 359V202L281 149V0H52ZM211 286Q223 379 263.5 447.5Q304 516 368.0 553.0Q432 590 512 590Q597 590 660.0 552.5Q723 515 759.0 446.5Q795 378 795 286Q795 196 759.0 127.5Q723 59 660.0 21.0Q597 -17 512 -17Q431 -17 367.5 20.5Q304 58 264.0 126.5Q224 195 211 286ZM563 286Q563 324 547.5 353.5Q532 383 504.5 400.0Q477 417 441 417Q404 417 369.5 400.0Q335 383 310.0 353.5Q285 324 272 286Q285 248 310.0 219.0Q335 190 369.5 173.0Q404 156 441 156Q477 156 504.5 173.0Q532 190 547.5 219.0Q563 248 563 286Z"
          />
          <path transform="translate(2171 0)" d="M52 770H281V0H52Z" />
          <path
            transform="translate(2465 0)"
            d="M300 -16Q220 -16 162.5 17.0Q105 50 75.0 110.5Q45 171 45 251V573H274V284Q274 229 302.0 199.0Q330 169 381 169Q420 169 446.0 184.0Q472 199 485.5 228.0Q499 257 499 299L568 263Q556 172 517.0 109.5Q478 47 422.5 15.5Q367 -16 300 -16ZM537 0 499 237V573H728V202L767 0Z"
          />
          <path
            transform="translate(3217 0)"
            d="M395 -17Q289 -17 206.0 21.0Q123 59 75.0 128.0Q27 197 27 289Q27 379 73.5 447.0Q120 515 200.5 552.5Q281 590 381 590Q486 590 560.0 545.5Q634 501 673.5 418.5Q713 336 713 224H214V355H581L514 310Q510 349 494.0 376.5Q478 404 451.5 418.0Q425 432 389 432Q348 432 319.0 416.0Q290 400 274.5 371.5Q259 343 259 307Q259 256 281.5 221.0Q304 186 350.0 167.5Q396 149 464 149Q526 149 587.0 164.0Q648 179 698 208V66Q637 26 561.5 4.5Q486 -17 395 -17Z"
          />
          <path transform="translate(3919 0)" d="M39 0V158L417 436L581 411H41V573H668V415L290 137L151 162H670V0Z" />
        </g>
        <circle cx="4784" cy="135" r="135" className="ab-dot" fill="#d6336c" />
      </g>
    </svg>
  )
}
