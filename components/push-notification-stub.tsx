"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type PushPermission = NotificationPermission | "unsupported"

export function PushNotificationStub() {
  const [permission, setPermission] = useState<PushPermission>("default")

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported")
      return
    }

    setPermission(Notification.permission)
  }, [])

  async function requestPushPermission() {
    if (permission === "unsupported") return

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result !== "granted") return

    const registration = await navigator.serviceWorker.ready
    // Scaffold only: persist subscription + VAPID + server send is a follow-up.
    console.info("[PWA] Push permission granted. Subscription wiring is not yet implemented.", {
      scope: registration.scope,
    })
  }

  if (permission === "unsupported") return null

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Bid alerts (coming soon)</p>
      <p className="mt-1">
        Enable notifications to get Kidz auction updates. Full push delivery is scaffolded in the
        service worker; subscription storage and VAPID sending will ship in a follow-up.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={requestPushPermission}
        disabled={permission === "granted"}
      >
        {permission === "granted" ? "Notifications enabled" : "Enable notifications"}
      </Button>
    </div>
  )
}
