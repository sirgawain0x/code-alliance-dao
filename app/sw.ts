import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()

// Scaffold: full Kidz bid push requires VAPID keys + subscription store (follow-up PR).
self.addEventListener("push", (event) => {
  if (!event.data) return

  let title = "Creative Organization DAO"
  let body = "You have a new notification."

  try {
    const payload = event.data.json() as { title?: string; body?: string }
    if (payload.title) title = payload.title
    if (payload.body) body = payload.body
  } catch {
    body = event.data.text()
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "creative-dao-notification",
      data: { url: "/" },
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
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus()
        }
      }

      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
      return undefined
    }),
  )
})
