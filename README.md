# Maserati Watches — Cinematic 3D Showroom

A production-ready React + Vite + TanStack Start luxury watch experience.

## Stack

- **React 19** + **TypeScript**
- **Vite 7** (no Lovable dependencies)
- **TanStack Router** (file-based routing)
- **TanStack Start** (SSR/static)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** (3D watch model)
- **GSAP** (hero animations, magnetic buttons)
- **Framer Motion** (page transitions, showcase)
- **Tailwind CSS v4**
- **shadcn/ui** (Radix primitives)

## Routes

| Path | Description |
|------|-------------|
| `/` | Main showroom — hero, collections, showcase, heritage, testimonials |
| `/watch/:slug` | Individual watch detail with 360° viewer |
| `/wishlist` | Privately curated wishlist (localStorage) |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run preview    # Preview production build
```

## Deploy

### Vercel
```bash
vercel --prod
```
`vercel.json` handles SPA rewrites automatically.

### GitHub Pages / Netlify
Set publish directory to `dist/` and add a `_redirects` file:
```
/*  /index.html  200
```

## Performance

- Three.js, GSAP, Framer Motion are code-split into separate chunks
- Particle field pauses when the tab is hidden (Visibility API)
- Custom cursor uses `transform` (GPU layer) instead of `top/left`
- Images are lazy-loaded
- DPR capped at 2× for canvas performance

## Customisation

- Watch data: `src/lib/maserati-watches.ts`
- Images: `public/maserati/`
- Colors: `src/styles.css` (CSS custom properties under `:root`)
- 3D model: `src/components/maserati/WatchModel.tsx`
