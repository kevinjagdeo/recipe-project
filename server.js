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
    const { appHtml, dehydratedState } = await render(req.url)

    const html = template
      .replace('<!--app-html-->', appHtml)
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
