# MGPL Report Studio

Next.js app that previews and prints everything from the MGPL Diagnostics kits. It is also the
**reference integration** to copy into other apps.

| Route | What |
|---|---|
| `/` | All sample reports. Navy Sidebar / Classic design, Header / Non-header variant, Print, Open/Download PDF |
| `/letterhead` | Blank Navy Sidebar letterhead (print **borderless** to make pre-printed paper) |
| `/invoice` | Sample patient invoices (paid, discount + part payment, GST, multi-page, refund) |
| `/designs/index.html` | The 6 design options the Navy Sidebar was chosen from |
| `GET /api/report-pdf?sample=cbc&variant=header&design=sidebar[&download=1]` | sample report PDF |
| `POST /api/report-pdf` `{ report, variant, design }` | PDF for any report |
| `GET /api/letterhead-pdf` | stationery PDF |
| `GET /api/invoice-pdf?sample=paid&variant=header` · `POST { invoice, variant }` | invoice PDF |

PDFs are rendered in Node.js by the kits (react-pdf). No browser is involved.

## Run

```bash
npm install        # postinstall copies report fonts/images into public/
npm run dev        # http://localhost:3000
```

The kits come from GitHub Packages (`.npmrc` maps `@mgpl-diagnostics` to `npm.pkg.github.com`). Set
`GITHUB_TOKEN` to a token with `read:packages`. Inside the local MGPL workspace (sibling folders
`report-kit/`, `invoice-kit/`) npm links them instead, and `next.config.ts` lets Turbopack read them.

## Use the kits in your own Next.js app

1. `npm i @mgpl-diagnostics/report-kit @mgpl-diagnostics/invoice-kit`
2. In `package.json`: `"postinstall": "mgpl-report-assets public"`
3. In `next.config.ts`: `serverExternalPackages: ["@react-pdf/renderer", "@resvg/resvg-js"]`
4. Copy a route from `src/app/api/*` for PDFs (`export const runtime = "nodejs"`) and render
   `<LabReport/>` or `<InvoiceDocument/>` in pages. See `src/app/page.tsx` and `src/app/invoice/page.tsx`.

## Scripts

`dev`, `build`, `start`, `typecheck`, `designs` (regenerates `public/designs/`).

See [AGENTS.md](AGENTS.md) for conventions.
