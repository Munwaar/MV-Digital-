# MV Digital Studio — Portfolio

A production-ready portfolio for **MV Digital Studio**, rebuilt from scratch as a standard
React + Vite application (no Replit, no monorepo, no workspace packages).

Cinematic 3D hero (React Three Fiber + bloom post-processing), GSAP/Framer Motion
animation, Lenis smooth scroll, and a fully responsive, accessible layout.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, zero PostCSS config needed)
- **React Three Fiber** + **Three.js** + **Drei** + **@react-three/postprocessing**
- **GSAP** (loader timeline, magnetic buttons, cursor)
- **Framer Motion** (scroll reveals, page-level transitions)
- **Lenis** (inertia smooth scrolling, synced to GSAP's ticker)
- **React Icons**

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # type-checks then builds to /dist
npm run preview    # serve the production build locally
```

No environment variables are required. The project runs immediately after `npm install`.

## Project structure

```
src/
  components/
    layout/       Nav, Footer, Loader, Cursor — chrome around every page
    three/         Scene, FloatingShards, ParticleField, CameraRig, PostFX
    ui/            RevealText, SectionHeading, MagneticButton — shared primitives
    sections/       Hero, Studio, Services, Work, Process, Testimonials, Contact
  data/
    content.ts      All copy and structured content in one place
  hooks/
    useLenis.ts      Smooth scroll, synced with GSAP's ticker
    useMagnetic.ts   Magnetic hover pull for buttons/links
    useMousePosition.ts   Pointer tracking for 3D parallax and cursor
  lib/
    utils.ts        cn(), easing constants, lerp/clamp helpers
  App.tsx            Composition root
  main.tsx           React entry point
  index.css          Design tokens (Tailwind v4 @theme) + global styles
public/
  favicon.svg, robots.txt, sitemap.xml, site.webmanifest, og-image.svg
```

Every component is single-purpose and reusable; below-the-fold sections
(`Work`, `Process`, `Testimonials`, `Contact`) and the 3D `Scene` are
code-split with `React.lazy` so the initial bundle stays lean.

## Design system

- **Palette** — deep ink background (`#0A0908`), molten copper accent (`#FF6A2B`),
  warm ember highlight (`#FFB347`), a cool steel counterpoint (`#7C93A3`), and a
  warm paper foreground (`#F3EDE4`). Defined as Tailwind v4 `@theme` tokens in
  `src/index.css` — change them once, and every component updates.
- **Type** — Fraunces (display serif, used sparingly for headlines), Sora (UI/body
  grotesk), JetBrains Mono (labels, eyebrows, data).
- **Signature motif** — "The Aperture": a lens-blade iris that opens on load and
  recurs as the custom cursor ring and the section frame-corners on project cards.

## 3D scene notes

`src/components/three/Scene.tsx` renders once as a fixed background canvas:

- `FloatingShards` — four transmissive/emissive geometric forms with independent
  drift and rotation.
- `ParticleField` — a single `Points` object (700 instances) for ember-like ambience,
  cheap regardless of count.
- `CameraRig` — lerped pointer parallax plus a scroll-driven dolly/tilt, read from
  refs (no React re-renders on scroll or pointer move).
- `PostFX` — bloom, subtle noise and vignette via `@react-three/postprocessing`.
- Wrapped in `WebGLErrorBoundary` so a WebGL failure (old browser, disabled GPU)
  never breaks the rest of the page — the 2D content still renders and functions.

## Performance & accessibility

- Below-the-fold sections and the 3D scene are lazy-loaded and code-split
  (see `manualChunks` in `vite.config.ts`).
- Camera/cursor/scroll state is stored in refs, not React state, to avoid
  re-renders on high-frequency events.
- `prefers-reduced-motion` is respected by Lenis, the cursor, magnetic hover,
  and global CSS.
- Visible focus rings on every interactive element (`:focus-visible`).
- Semantic HTML (`<nav>`, `<main>`, `<footer>`, `<dl>`, form `<label>`s) throughout.

## SEO

- Full meta tags, Open Graph and Twitter Card markup in `index.html`.
- `ProfessionalService` JSON-LD structured data.
- `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest`, SVG favicon
  and OG image included.

Update `mvdigitalstudio.com` references in `index.html` and
`public/{robots.txt,sitemap.xml}` to your real domain before deploying.

## Deployment

The build output is a static `dist/` folder — deploy it anywhere that serves
static files.

**Vercel**
```bash
npm i -g vercel
vercel --prod
```
(Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.)

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Any static host (S3, Cloudflare Pages, GitHub Pages, nginx, etc.)**
```bash
npm run build
# upload the contents of ./dist
```

If deploying to a sub-path (e.g. GitHub Pages project sites), set `base` in
`vite.config.ts`:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

## Editing content

All copy — hero headline, services, pricing, projects, process steps,
testimonials, contact copy, nav links, socials — lives in
`src/data/content.ts`. Update that one file to change the site's content
without touching component code.

To swap the accent palette or fonts, edit the `@theme` block at the top of
`src/index.css`.

## Changelog

- **Rebrand** — all copy, SEO metadata and structured data updated to
  MV Digital Studio; services narrowed to web-development offerings only
  (no AI/ML/Java/app-dev); a new **Pricing** section (`#pricing`) was added
  with INR plans, matching the existing card-grid design language.
- **Scroll fix** — `src/hooks/useLenis.ts` no longer disables GSAP's ticker
  lag-smoothing (the actual cause of scroll momentum "catching up" after any
  main-thread stall), and touch/wheel multipliers were reset to Lenis's
  defaults so upward scroll is no longer fighting excess momentum. See the
  comment block in that file for the full root-cause writeup.

