import type { MetadataRoute } from "next"
import {
  BACKGROUND_COLOR,
  PWA_ICONS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  THEME_COLOR,
} from "@/lib/site-metadata"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    theme_color: THEME_COLOR,
    background_color: BACKGROUND_COLOR,
    categories: ["finance", "productivity", "social"],
    icons: [
      {
        src: PWA_ICONS.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: PWA_ICONS.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: PWA_ICONS.icon512Maskable,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
