# Gabriel Isuekebho · Portfolio

A creative, non-generic developer portfolio with a **"designed terminal"** aesthetic
(silver-phosphor `#C1CFCF` on near-black, with a light mode). Backend / AI / Bitcoin / fintech focus.

**Live:** https://conradgabe.vercel.app

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · cmdk
- **Type:** Geist Mono (terminal/UI) + Space Grotesk (display/headings)
- **Quality:** WCAG 2.1 AA (axe: 0 violations) · Lighthouse A11y/Best-Practices/SEO 100, Performance ~93

## Features

- **Terminal UI** with a boot sequence, typewriter hero, and a `⌘K` command palette (cmdk) that maps commands (`whoami`, `ls projects/`, `git log`, …) to sections and routes.
- **Five project case studies** at `/projects/<slug>`, each with real product screenshots (or a stylized CSS/SVG mock for the backend-only projects).
- **Interactive API documentation** for every project at `/projects/<slug>/api` — a Swagger-style, terminal-themed OpenAPI viewer (collapsible operations, endpoint filter, expand/collapse all, a schemas panel) plus a downloadable raw spec. GraphQL projects render their SDL instead.
- **Live Medium feed** (`@conradgabe`) and **tokenless GitHub activity** (public contributions + top languages).
- **Light / dark** themes and an optional CRT mode; full keyboard nav and reduced-motion support.

## Projects

| Slug | Project | API reference |
|------|---------|---------------|
| `clipn` | ClipN — AI long-form to short-form clip pipeline | 81-endpoint OpenAPI + renderer sidecar |
| `quant-platform` | Algome — quant strategy execution & backtesting engine | 41-endpoint OpenAPI |
| `pg-tailor` | PG-Tailor — AI résumé tailoring & job-matching (Next.js · Gemini · SerpAPI) | ~30-endpoint OpenAPI (SSE) |
| `b2b-saas` | B2B SaaS — multi-tenant backend | Data-model / tenancy reference |
| `graphql-api` | GraphQL API — schema-first (Strawberry) | GraphQL SDL + example operations |

## Develop

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Where content lives

- **`lib/site.ts`** — identity, taglines, socials, focus areas, skills, **projects** (case studies), command map
- **`lib/resume.ts`** — résumé summary + `experience` / `education` / `certifications`
- **`lib/api-docs.ts`** — per-project API reference content (terminal summary, GraphQL SDL/examples)
- **`lib/specs.ts`** + **`lib/specs/*.json`** — real OpenAPI specs, typed and rendered by the full-spec viewer
- **`lib/medium.ts`** — live Medium feed (`@conradgabe`)
- **`lib/github.ts`** — tokenless public GitHub contributions + languages
- **Routes:** case studies at `/projects/<slug>`, full API reference at `/projects/<slug>/api`, raw spec download at `/api-specs/<slug>`, résumé at `/resume` (print-to-PDF)
- **API rendering:** `components/sections/ApiReference.tsx` (terminal summary) and `components/sections/OpenApiView.tsx` (interactive full spec)

## Visual + a11y tooling (dev only)

```bash
node scripts/shoot.mjs    # screenshots → .screenshots/ (set BASE_URL to target a server)
node scripts/a11y.mjs     # axe-core accessibility audit across key pages
```

## TODO (handoff)

- [ ] **Contact form**: set `NEXT_PUBLIC_WEB3FORMS_KEY` (free key from web3forms.com); without it the form falls back to a `mailto:` link
- [ ] **Domain** (optional): add a custom domain on Vercel and update `metadataBase` in `app/layout.tsx`
- [ ] **Tagline** (optional): three options live in `lib/site.ts` (`taglines`); the first is the default in the hero

## Deploy (Vercel)

```bash
npx vercel          # first run prompts login + project setup
npx vercel --prod   # promote to production
```

Add `NEXT_PUBLIC_WEB3FORMS_KEY` under the project's Environment Variables for the contact form.
