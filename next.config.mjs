/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize resource loading
  experimental: {
    optimizePackageImports: ['@reown/appkit', 'wagmi', '@tanstack/react-query'],
  },
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
