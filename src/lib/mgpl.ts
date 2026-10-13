// FRONTEND — one shared client. Point baseUrl at another origin to use a separate backend.
import { createMgplClient } from "@mgpl-diagnostics/client";

export const mgpl = createMgplClient({ baseUrl: process.env.NEXT_PUBLIC_MGPL_API ?? "/api/mgpl" });
