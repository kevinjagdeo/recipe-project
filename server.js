import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { render } from './dist/server/entry-server.js'
import { generateSitemap } from './generateSitemap.js' // Import your sitemap generator

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

// Middleware for sitemap.xml using your generateSitemap function
app.use('*', async (req, res, next) => {
  if (req.originalUrl === '/sitemap.xml') {
    try {
      const sitemap = await generateSitemap()
      return res
        .status(200)
        .set({ 'Content-Type': 'application/xml' })
        .end(sitemap)
    } catch (err) {
      next(err)
    }
  }
  next()
})

app.get('*', async (req, res, next) => {
  try {
    const { appHtml, dehydratedState, helmetContext } = await render(req.url)
    const helmet = helmetContext.helmet

    const html = template
      .replace('<!--app-html-->', appHtml)
      .replace('<title>My App</title>', helmet.title.toString())
      .replace(
        '<!--helmet-meta-->',
        `
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          ${helmet.script.toString()}
        `,
      )
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
