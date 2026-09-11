"use client"

export function PushNotificationStub() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Bid alerts (coming soon)</p>
      <p className="mt-1">
        Kidz auction push notifications will arrive in a follow-up release. The service worker
        scaffold is in place; subscription storage and VAPID delivery are not wired yet.
      </p>
    </div>
  )
}
