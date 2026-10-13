// BACKEND — the only place this app touches the MGPL kits. Everything under /api/mgpl/* is served
// by createMgplApi(): templates, reports, invoices, letterhead, fonts/images. The pages call it
// through @mgpl-diagnostics/client, exactly as a separate frontend app (or another domain) would.
import { createMgplApi } from "@mgpl-diagnostics/invoice-kit";

export const runtime = "nodejs";

const api = createMgplApi({
  basePath: "/api/mgpl",
  samples: true, // demo data for the preview pages; leave off in production
});

export { api as GET, api as POST, api as OPTIONS };
