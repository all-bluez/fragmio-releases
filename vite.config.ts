// The website is a React app. Two files stay at the top of the repo because the release automation writes them:
// version.json (also read by the app's update check) and config.js (version, date, channel and links).
// Both are bundled into the site, and version.json is also copied next to it, so the site's own /version.json keeps working.
import { copyFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const versionFile = (): Plugin => ({
  name: 'version-json',
  configureServer(server) {
    // /get runs on Vercel only (api/get.js); in npm run dev the download buttons open the releases page instead.
    server.middlewares.use('/get', (_req, res) => {
      res.statusCode = 302
      res.setHeader('Location', 'https://github.com/all-bluez/fragmio-releases/releases')
      res.end()
    })
    // Only the plain file: the site's own code also asks for it (as /version.json?import), and that goes to Vite.
    server.middlewares.use('/version.json', (req, res, next) => {
      if (req.url && req.url !== '/') return next()
      res.setHeader('Content-Type', 'application/json')
      res.end(readFileSync(resolve('version.json')))
    })
  },
  closeBundle() {
    copyFileSync(resolve('version.json'), resolve('dist', 'version.json'))
  }
})

export default defineConfig({
  plugins: [react(), versionFile()]
})
