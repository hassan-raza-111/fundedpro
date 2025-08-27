# FundedPro Landing

A modern, responsive landing page built with Next.js App Router, Tailwind CSS v4, and shadcn/ui (Radix). Optimized for performance, accessibility, and secure defaults.

## Tech Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`) with custom OKLCH tokens
- shadcn/ui + Radix primitives, `lucide-react` icons

## Getting Started
- Install: `pnpm install` (or `npm install`)
- Dev: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`

## Structure
- `app/` layout, global CSS, and page composition
- `components/` sections (navigation, hero, highlights, plans, testimonials, about, FAQ, footer)
- `components/ui/` shadcn primitives
- `hooks/` shared hooks (toast, media)
- `lib/` utilities (`cn`)

## Responsiveness
- All sections use responsive grids and spacing
- Fixed navbar offset via `scroll-mt-*` to prevent anchor overlap
- Plans table uses horizontal scroll with sticky feature column on small screens
- Footer newsletter stacks on mobile, inline on larger screens

## Performance
- Dynamic import below-the-fold sections (Testimonials, About, FAQ, Footer)
- Hero counters use `requestAnimationFrame` for smooth updates
- Background visuals memoized and generated client-side after mount to avoid hydration mismatches
- Numbers use tabular numerals and fixed widths to prevent layout shift
- Removed unused components and duplicates to slim the bundle

## Accessibility
- Focus-visible rings on interactive elements
- Respect `prefers-reduced-motion` in scroll animations
- Adequate touch targets and clear contrast

## Security
Configured in `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `poweredByHeader: false`

Recommended for production (via CDN/proxy or Next headers):
- HSTS: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- CSP (start report-only, then enforce):
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'`
Adjust if adding third-party assets.

## Deployment
- Works well on Vercel. If using `next/image` later, configure `images` domains and enable optimization.
- Serve over HTTPS and enable HSTS at your edge.

## Troubleshooting
- Hydration mismatch on hero background: fixed by generating particles after mount.
- Viewport warning: fixed using `export const viewport` in `app/layout.tsx`.

## Scripts
- `dev`, `build`, `start`, `lint`

