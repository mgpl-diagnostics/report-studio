# AGENTS.md — report-studio

Next.js 16 (App Router, Turbopack, React 19) preview app for `@mgpl-diagnostics/report-kit` and
`@mgpl-diagnostics/invoice-kit`. It holds **no report logic**: layout, templates, pricing and PDF
rendering all live in the kits. Fix rendering bugs there, not here.

## Map

```
src/app/page.tsx                 reports gallery (design + variant toggles via search params)
src/app/letterhead/page.tsx      blank letterhead
src/app/invoice/page.tsx         invoice gallery
src/app/api/report-pdf/route.ts  GET sample / POST any report → PDF (runtime nodejs)
src/app/api/letterhead-pdf/      GET → stationery PDF
src/app/api/invoice-pdf/         GET sample / POST any invoice → PDF
src/app/PrintButton.tsx          the only client component (window.print)
public/designs/                  static design-option pages (scripts/design-gallery.tsx)
public/report-assets, report-fonts   copied from report-kit on install (git-ignored)
next.config.ts                   serverExternalPackages for react-pdf/resvg; Turbopack root = workspace when present
```

## Rules

- Before using a Next.js API, check `node_modules/next/dist/docs/`. This Next version may differ
  from your training data (e.g. `searchParams` is a Promise).
- PDF routes must keep `export const runtime = "nodejs"`.
- Import kits only by package name (`@mgpl-diagnostics/...`), never by relative path into a sibling folder.
- Server Components by default. The kit components are pure and need no `"use client"`.
- Run `npm run typecheck` and load every route (`/`, `/letterhead`, `/invoice`, the three PDF APIs)
  after changes.
