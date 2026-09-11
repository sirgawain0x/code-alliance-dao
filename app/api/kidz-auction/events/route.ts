import { getKidzAuctionCacheVersion } from "@/lib/kidz-auction-cache"
import { subscribeKidzAuctionUpdates } from "@/lib/kidz-auction-events"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const encoder = new TextEncoder()
  let keepAliveTimer: ReturnType<typeof setInterval> | undefined
  let unsubscribe: (() => void) | undefined

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (payload: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        )
      }

      sendEvent({
        type: "snapshot-version",
        version: getKidzAuctionCacheVersion(),
      })

      unsubscribe = subscribeKidzAuctionUpdates((version) => {
        sendEvent({
          type: "snapshot-version",
          version,
        })
      })

      keepAliveTimer = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"))
      }, 25_000)
    },
    cancel() {
      if (keepAliveTimer) clearInterval(keepAliveTimer)
      if (unsubscribe) unsubscribe()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
