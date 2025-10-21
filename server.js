import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { render } from './dist/server/entry-server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

const template = fs.readFileSync(
  path.resolve(__dirname, 'dist/client/index.html'),
  'utf-8',
)

app.use(
  '/assets',
  express.static(path.resolve(__dirname, 'dist/client/assets')),
)

app.get('*', async (req, res, next) => {
  try {
    // Extract appHtml, dehydrated cache, and helmetContext from your SSR render
    const { appHtml, dehydratedState, helmetContext } = await render(req.url)

    const helmet = helmetContext.helmet

    const html = template
      .replace('<!--app-html-->', appHtml)
      // Replace title tag with Helmet title
      .replace('<title>My App</title>', helmet.title.toString())
      // Inject Helmet meta, link, script tags for SEO
      .replace(
        '<!--helmet-meta-->',
        `
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          ${helmet.script.toString()}
        `,
      )
      // Inject React Query dehydrated state for client
      .replace(
        '<!--ssr-state-->',
        `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}</script>`,
      )

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (err) {
    next(err)
  }
})

app.listen(PORT, () => {
  console.log(`SSR server running on http://localhost:${PORT}`)
})
