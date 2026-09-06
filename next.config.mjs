const reownProjectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (process.env.NODE_ENV === 'production' && !reownProjectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_REOWN_PROJECT_ID (or NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID). ' +
      'Set a Reown project ID for wallet connect before building for production.'
  )
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true, // Enable source maps for better debugging
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize resource loading
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-ethers', '@phosphor-icons/webcomponents', 'lit'],
  // experimental: {
  //   optimizePackageImports: ['wagmi', '@tanstack/react-query'],
  // },
  webpack: (config, { isServer }) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "@react-native-async-storage/async-storage"
    );

    if (isServer) {
      // For server-side, provide a mock for indexedDB
      config.resolve.alias = {
        ...config.resolve.alias,
        'idb-keyval': false,
      };
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
        os: false
      };
    }
    return config;
  },
}

export default nextConfig
