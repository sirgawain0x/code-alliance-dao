import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { NetworkOnly, Serwist } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

// Prepend NetworkOnly for /api/* so live stats are never served from SW cache.
const runtimeCaching = [
  {
    matcher: ({ sameOrigin, url: { pathname } }: { sameOrigin: boolean; url: URL }) =>
      sameOrigin && pathname.startsWith("/api/"),
    handler: new NetworkOnly({ networkTimeoutSeconds: 10 }),
  },
  ...defaultCache,
]

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
})

serwist.addEventListeners()

// Scaffold: full Kidz bid push requires VAPID keys + subscription store (follow-up PR).
self.addEventListener("push", (event) => {
  if (!event.data) return

  let title = "Creative Organization DAO"
  let body = "You have a new notification."
  let targetUrl = "/"

  try {
    const payload = event.data.json() as { title?: string; body?: string; url?: string }
    if (payload.title) title = payload.title
    if (payload.body) body = payload.body
    if (payload.url) targetUrl = payload.url
  } catch {
    body = event.data.text()
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "creative-dao-notification",
      data: { url: targetUrl },
    }),
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const targetUrl =
    typeof event.notification.data?.url === "string"
      ? event.notification.data.url
      : "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clients) => {
      for (const client of clients) {
        if (!client.url.includes(self.location.origin) || !("focus" in client)) continue

        await client.focus()

        if ("navigate" in client && typeof client.navigate === "function") {
          return client.navigate(targetUrl)
        }

        return
      }

      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
      return undefined
    }),
  )
})
