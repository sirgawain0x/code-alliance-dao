import type { Metadata } from "next"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://dao.creativeplatform.xyz")

export const SITE_NAME = "Creative Organization DAO"

export const SITE_SHORT_NAME = "Creative DAO"

export const SITE_DESCRIPTION =
  "Governance hub for the Creative Organization DAO — proposals, treasury, and community on Base."

export const SITE_TAGLINE =
  "Decentralized governance for creators, culture, and the Creative economy."

/** Brand purple from Creative Platform logo gradient */
export const THEME_COLOR = "#644698"

/** Dark splash / PWA background aligned with app dark theme */
export const BACKGROUND_COLOR = "#0a0a0f"

export const OG_IMAGE_PATH = "/og-image.png"

export const OG_IMAGE_WIDTH = 1200

export const OG_IMAGE_HEIGHT = 630

export const PWA_ICONS = {
  icon192: "/icons/icon-192.png",
  icon512: "/icons/icon-512.png",
  icon512Maskable: "/icons/icon-512-maskable.png",
  appleTouch: "/icons/apple-touch-icon.png",
} as const

export function createSiteMetadata({
  title,
  description,
  path,
  openGraphTitle,
}: {
  title?: string
  description?: string
  /** Route path for canonical/OG URL. Omit on root layout to avoid wrong defaults. */
  path?: string
  openGraphTitle?: string
} = {}): Metadata {
  const pageTitle = title ?? SITE_NAME
  const pageDescription = description ?? SITE_DESCRIPTION
  const canonicalUrl =
    path === undefined ? undefined : path === "/" ? SITE_URL : `${SITE_URL}${path}`
  const ogTitle = openGraphTitle ?? pageTitle
  const ogImageUrl = `${SITE_URL}${OG_IMAGE_PATH}`

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(SITE_URL),
    ...(canonicalUrl
      ? {
          alternates: {
            canonical: canonicalUrl,
          },
        }
      : {}),
    applicationName: SITE_SHORT_NAME,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: PWA_ICONS.icon192, sizes: "192x192", type: "image/png" },
        { url: PWA_ICONS.icon512, sizes: "512x512", type: "image/png" },
        { url: "/Creative_logo-200.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: PWA_ICONS.appleTouch, sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: SITE_SHORT_NAME,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      siteName: SITE_NAME,
      title: ogTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: `${SITE_NAME} — governance for the Creative economy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  }
}
