import { spawnSync } from "node:child_process"
import withSerwistInit from "@serwist/next"

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID()

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [{ url: "/", revision }],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "@reown/appkit",
    "@reown/appkit-adapter-ethers",
    "@phosphor-icons/webcomponents",
    "lit",
  ],
  webpack: (config, { isServer }) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "@react-native-async-storage/async-storage",
    )

    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "idb-keyval": false,
      }
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      }
    }
    return config
  },
}

export default withSerwist(nextConfig)
