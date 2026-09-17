# Star Energies — Phase 1

The Phase 1 public-site foundation for Star Energies: a responsive homepage and shared shell only. No backend, admin console, price data, or Supabase integration is included.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Content and replacement points

- `lib/site.ts` centralises navigation, placeholder contact details, core homepage data, and technical terms.
- `components/mark.tsx` is the text-based identity placeholder. It can be replaced by the final SVG without changing header or footer structure.
- Development imagery is deliberately labelled in the UI; photographic replacement can be done through the `.image-plate--coal` and `.image-plate--yard` styles in `app/globals.css`.

## Verification

```bash
npm run lint
npm run build
```
