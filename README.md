# Gabriel Isuekebho — Portfolio

A creative, non-generic developer portfolio with a **"designed terminal"** aesthetic
(silver-phosphor `#C1CFCF` on near-black, with a light mode). Backend/AI/Bitcoin/fintech focus.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · cmdk
- **Type:** Geist Mono (terminal/UI) + Space Grotesk (display/headings)
- **Quality:** WCAG 2.1 AA (axe: 0 violations) · Lighthouse A11y/Best-Practices/SEO 100, Performance ~93

## Develop

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Where content lives

- **`lib/site.ts`** — identity, taglines, socials, focus areas, skills, **projects** (case studies), command map
- **`lib/resume.ts`** — résumé summary + `experience` / `education` / `certifications` (⚠️ **fill these in** — currently empty placeholders)
- **`lib/medium.ts`** — pulls the live Medium feed (`@conradgabe`)
- **`lib/github.ts`** — tokenless public GitHub contributions + languages
- Project case studies render at `/projects/<slug>`; résumé at `/resume` (has a print-to-PDF button)

## Visual + a11y tooling (dev only)

```bash
node scripts/shoot.mjs    # screenshots → .screenshots/ (set BASE_URL to target a server)
node scripts/a11y.mjs     # axe-core accessibility audit across key pages
```

## TODO (handoff)

- [ ] **Résumé**: fill `lib/resume.ts` (`experience`, `education`, `certifications`)
- [ ] **Project screenshots**: replace the stylized mock UIs (`components/mocks/ProjectMock.tsx`) — drop images in `public/` and wire them into the project case studies
- [ ] **Contact form**: set `NEXT_PUBLIC_WEB3FORMS_KEY` (free key from web3forms.com) — without it the form falls back to a `mailto:` link
- [ ] **Tagline**: pick one of the three in `lib/site.ts` (`taglines`)
- [ ] **Domain**: add a custom domain on Vercel; update `metadataBase` in `app/layout.tsx`

## Deploy (Vercel)

```bash
npx vercel          # first run prompts login + project setup
npx vercel --prod   # promote to production
```

Add `NEXT_PUBLIC_WEB3FORMS_KEY` under the project's Environment Variables for the contact form.
