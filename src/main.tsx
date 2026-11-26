import { StrictMode, useEffect, type JSX } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './components/Layout'
import { Download } from './pages/Download'
import { Feedback } from './pages/Feedback'
import { Changelog } from './pages/Changelog'
import { Doc } from './pages/Doc'
import { Home } from './pages/Home'
import { Support } from './pages/Support'
import { Router, usePlace } from './router'
import { useHubApp } from './hub'
import { countView } from './site'
import './styles.css'

const PAGES: Record<string, () => JSX.Element> = { '/': Home, '/download': Download, '/feedback': Feedback, '/support': Support, '/changelog': Changelog }

function NotFound(): JSX.Element {
  return (
    <section className="page w">
      <h1>Page not found</h1>
      <p className="lead">
        This page doesn&apos;t exist. <a href="/">Go to the home page</a>.
      </p>
    </section>
  )
}

function App(): JSX.Element {
  const { path } = usePlace()
  // Re-draws everything once the hub answers (pages, switches: pricing, invite-only, support, downloads).
  useHubApp()
  useEffect(() => countView(path), [path])
  const Page = PAGES[path]
  return <Layout>{Page ? <Page /> : <Doc notFound={NotFound} />}</Layout>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
)
