# AGENTS.md — report-studio

The reference Next.js 16 app (App Router, Turbopack, React 19) for MGPL Diagnostics. It demonstrates
the intended architecture:

- **Backend:** exactly one route, `src/app/api/mgpl/[...path]/route.ts`, which mounts `createMgplApi()`
  from invoice-kit. This is the **only** file that imports a backend kit (plus `src/contract-check.ts`, types only).
- **Frontend:** every page is a client component that uses `@mgpl-diagnostics/client` (and its unstyled
  React hooks). All UI and CSS belong to this app (`src/app/globals.css`, `src/components/`).

Rendering bugs belong in the kits, not here.

## Map

```
src/app/api/mgpl/[...path]/route.ts   backend (createMgplApi, samples enabled for the demo)
src/lib/mgpl.ts                       the client (NEXT_PUBLIC_MGPL_API or "/api/mgpl")
src/app/page.tsx                      report gallery
src/app/new/page.tsx                  result-entry form from GET /templates + live preview (?demo prefills)
src/app/invoice/page.tsx              invoice gallery
src/app/letterhead/page.tsx           blank stationery
src/components/                       Nav, Segmented, pdf-actions (popup-safe open / download)
src/contract-check.ts                 compile-time check: client types ⇄ kit types
public/designs/                       static design-option pages (scripts/design-gallery.tsx)
```

## Rules

- Before using a Next.js API, check `node_modules/next/dist/docs/`. This Next version may differ
  from your training data.
- Never import a kit from a page or component. Use the client.
- Keep `export const runtime = "nodejs"` on the API route.
- Real signatures: `MGPL_SIGNATURE_HEADER_FILE` / `MGPL_SIGNATURE_NONHEADER_FILE` in `.env.local`
  (git-ignored), pointing outside the repo. Never commit signature images.
- After changes: `npm run typecheck` (includes the contract check) and `npm run build`. The build must show
  every page as static and only `/api/mgpl/[...path]` as dynamic.

## Licence

All rights reserved (see LICENSE).
