import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import newsHandler from './netlify/functions/news.js'

function localNewsFunction() {
  return {
    name: 'new-z-local-news-function',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith('/.netlify/functions/news')) return next()
        try {
          const origin = `http://${request.headers.host || 'localhost'}`
          const result = await newsHandler(new Request(new URL(request.url || '/', origin)))
          response.statusCode = result.status
          result.headers.forEach((value, key) => response.setHeader(key, value))
          response.end(await result.text())
        } catch {
          response.statusCode = 502
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ error: 'The local news service could not complete this request. Please retry.' }))
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localNewsFunction()],
})
