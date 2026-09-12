type KidzAuctionUpdateListener = (version: number) => void

interface KidzAuctionEventBus {
  listeners: Set<KidzAuctionUpdateListener>
}

declare global {
  // eslint-disable-next-line no-var
  var __kidzAuctionEventBus: KidzAuctionEventBus | undefined
}

function getEventBus(): KidzAuctionEventBus {
  if (!globalThis.__kidzAuctionEventBus) {
    globalThis.__kidzAuctionEventBus = {
      listeners: new Set(),
    }
  }

  return globalThis.__kidzAuctionEventBus
}

export function subscribeKidzAuctionUpdates(
  listener: KidzAuctionUpdateListener
): () => void {
  const bus = getEventBus()
  bus.listeners.add(listener)
  return () => bus.listeners.delete(listener)
}

export function notifyKidzAuctionUpdate(version: number): void {
  const bus = getEventBus()
  bus.listeners.forEach((listener) => listener(version))
}
