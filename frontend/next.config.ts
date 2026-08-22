import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

function loadRootEnv(): Record<string, string> {
  const envPath = path.join(__dirname, "..", ".env");
  const result: Record<string, string> = {};
  if (!fs.existsSync(envPath)) {
    return result;
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

const rootEnv = loadRootEnv();

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      rootEnv.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_INTERNAL_URL || 'http://backend:8080'}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
