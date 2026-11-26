import 'react'

declare module 'react' {
  // CSS custom properties in style={{ '--x': '30%' }}
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}

declare global {
  /** config.js at the top of the repo (the release automation writes version, date and channel into it). */
  interface Window {
    FRAGMIO?: {
      version?: string
      channel?: string
      date?: string
      installerUrl?: string
      downloadUrl?: string
      releasesUrl?: string
      hubUrl?: string
      feedbackFormUrl?: string
      youtubeChannel?: string
      tutorials?: { id: string; title?: string; length?: string }[]
    }
  }
}
