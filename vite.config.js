import { defineConfig, loadEnv } from 'vite'
import { Buffer } from 'node:buffer'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import chatHandler from './api/chat.js'
import { loanServices } from './src/data/loan-services-data.js'
import { contactInfo, officeHours } from './src/data/contact.js'
import { getPageSchemas, getPageSeo } from './src/seo/seoConfig.js'

const seoRoutes = [
  '/',
  '/about',
  '/support',
  '/services',
  '/emi-calculator',
  ...loanServices.map(({ id }) => `/services/${id}`),
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function replaceMeta(html, attribute, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta(?=[^>]*\\b${attribute}="${escapedName}")[^>]*>`, 's')
  const safeContent = escapeHtml(content)
  return html.replace(pattern, (tag) => {
    if (/\bcontent="/.test(tag)) {
      return tag.replace(/\bcontent="[^"]*"/, `content="${safeContent}"`)
    }
    return tag.replace(/\/?>$/, ` content="${safeContent}" />`)
  })
}

function withRouteSeo(template, page, service) {
  const openingHours = [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: officeHours.days,
    opens: officeHours.opens,
    closes: officeHours.closes,
  }]
  let preparedTemplate = template.replace(
    '"__SFC_OPENING_HOURS__"',
    JSON.stringify(openingHours),
  )
  let html = preparedTemplate.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
  html = replaceMeta(html, 'name', 'description', page.description)
  html = replaceMeta(html, 'name', 'robots', page.noindex ? 'noindex, nofollow' : 'index, follow')
  html = replaceMeta(html, 'property', 'og:title', page.title)
  html = replaceMeta(html, 'property', 'og:description', page.description)
  if (page.noindex) {
    html = html.replace(/<meta property="og:url"[^>]*>\s*/s, '')
  } else {
    html = replaceMeta(html, 'property', 'og:url', `https://sarathifinconnect.com${page.path}`)
  }
  html = replaceMeta(html, 'property', 'og:image', 'https://sarathifinconnect.com/og-image.png')
  html = replaceMeta(html, 'name', 'twitter:title', page.title)
  html = replaceMeta(html, 'name', 'twitter:description', page.description)
  html = replaceMeta(html, 'name', 'twitter:image', 'https://sarathifinconnect.com/og-image.png')
  if (!page.noindex) {
    html = html.replace(
      '</head>',
      `  <link rel="canonical" href="https://sarathifinconnect.com${page.path}" />\n</head>`,
    )
  }

  const schemas = getPageSchemas(page)
  if (schemas.length) {
    html = html.replace(
      '</head>',
      `  <script id="route-jsonld" type="application/ld+json">${JSON.stringify(schemas)}</script>\n</head>`,
    )
  }

  const heading = service
    ? `${service.name} loan consultancy`
    : page.title.replace(/\s+\|\s+Sarathi FinConnect$/, '')
  const serviceContent = service
    ? [
        ['Key features', service.highlights],
        ['Eligibility information', service.eligibility],
        ['Documents you may need', service.documents],
        ['Application steps', service.steps],
        ['Terms to review', service.terms],
      ]
        .filter(([, items]) => items?.length)
        .map(([title, items]) => `<section><h2>${escapeHtml(title)}</h2><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`)
        .join('')
    : ''
  const serviceLinks = page.path === '/services'
    ? `<ul>${loanServices.map((item) => `<li><a href="/services/${item.id}">${escapeHtml(item.name)}</a></li>`).join('')}</ul>`
    : ''
  const contactFallback = page.path === '/support'
    ? `<p>Call <a href="tel:${contactInfo.phone.replace(/\s/g, '')}">${escapeHtml(contactInfo.phone)}</a>, email <a href="mailto:${contactInfo.email}">${escapeHtml(contactInfo.email)}</a>, or visit ${escapeHtml(contactInfo.address)}.</p>`
    : ''
  const fallbackContent = `<noscript><main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(service?.intro || page.description)}</p>${serviceContent}${serviceLinks}${contactFallback}<p>Sarathi FinConnect is a loan consultancy and financial advisory firm, not a direct lender. Lenders make lending decisions and set final terms.</p><nav aria-label="Main pages"><a href="/">Home</a> · <a href="/services">Services</a> · <a href="/about">About</a> · <a href="/support">Contact</a></nav></main></noscript>`
  return html.replace('</body>', `${fallbackContent}\n</body>`)
}

function routeSeoDev() {
  return {
    name: 'route-seo-dev',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const pathname = new URL(
          context.originalUrl || context.path,
          'http://localhost',
        ).pathname
        const route = pathname === '/index.html' ? '/' : pathname.replace(/\/$/, '') || '/'
        const service = route.startsWith('/services/')
          ? loanServices.find((item) => `/services/${item.id}` === route)
          : undefined
        return withRouteSeo(html, getPageSeo(route, service), service)
      },
    },
  }
}

function routeSeoSnapshots() {
  return {
    name: 'route-seo-snapshots',
    apply: 'build',
    closeBundle() {
      const outputDirectory = resolve(process.cwd(), 'dist')
      const indexPath = resolve(outputDirectory, 'index.html')
      const template = readFileSync(indexPath, 'utf8')

      for (const route of seoRoutes) {
        const service = route.startsWith('/services/')
          ? loanServices.find((item) => `/services/${item.id}` === route)
          : undefined
        const page = getPageSeo(route, service)
        const html = withRouteSeo(template, page, service)
        const filePath = route === '/'
          ? indexPath
          : resolve(outputDirectory, `${route.slice(1)}.html`)
        mkdirSync(dirname(filePath), { recursive: true })
        writeFileSync(filePath, html, 'utf8')
      }

      const notFoundPage = getPageSeo('/__not-found__')
      writeFileSync(
        resolve(outputDirectory, '404.html'),
        withRouteSeo(template, notFoundPage),
        'utf8',
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY

  return {
    plugins: [
      routeSeoDev(),
      react(),
      tailwindcss(),
      routeSeoSnapshots(),
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
                if (size > 48_000) {
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
