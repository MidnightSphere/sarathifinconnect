import { defineConfig, loadEnv } from 'vite'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import chatHandler from './api/chat.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-chat-api',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use(async (request, response, next) => {
            const pathname = new URL(request.url, 'http://localhost').pathname
            if (pathname !== '/api/chat' && pathname !== '/api/chat/') {
              return next()
            }

            try {
              const chunks = []
              let size = 0
              for await (const chunk of request) {
                size += chunk.length
                if (size > 16_000) {
                  response.statusCode = 413
                  response.setHeader('Content-Type', 'application/json')
                  response.end(JSON.stringify({ error: 'Message is too large.' }))
                  return
                }
                chunks.push(chunk)
              }
              request.body = Buffer.concat(chunks).toString('utf8')

              const apiResponse = {
                setHeader(name, value) {
                  response.setHeader(name, value)
                },
                status(code) {
                  response.statusCode = code
                  return this
                },
                json(payload) {
                  response.setHeader('Content-Type', 'application/json')
                  response.end(JSON.stringify(payload))
                  return this
                },
              }

              await chatHandler(request, apiResponse)
            } catch (error) {
              server.config.logger.error('Local chat API failed.', { error })
              if (!response.headersSent) {
                response.statusCode = 500
                response.setHeader('Content-Type', 'application/json')
                response.end(JSON.stringify({ error: 'Chat request failed.' }))
              }
            }
          })
        },
      },
    ],
  }
})
