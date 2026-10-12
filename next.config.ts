import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// Inside the local MGPL workspace the kits are linked from sibling folders, so Turbopack must be
// allowed to read the parent folder. A standalone clone installs them from GitHub instead.
const parent = join(process.cwd(), "..");
const inWorkspace =
  existsSync(join(parent, "package.json")) && JSON.parse(readFileSync(join(parent, "package.json"), "utf8")).name === "mgpl-workspace";

const nextConfig: NextConfig = {
  // Node-only PDF libraries: keep them as runtime dependencies instead of bundling.
  serverExternalPackages: ["@react-pdf/renderer", "@resvg/resvg-js"],
  agentRules: false,
  ...(inWorkspace ? { turbopack: { root: parent }, outputFileTracingRoot: parent } : {}),
};

export default nextConfig;
