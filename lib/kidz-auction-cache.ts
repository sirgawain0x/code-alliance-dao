import type { NounsAuctionSnapshot } from "@/lib/nouns-auction"
import { getKidzAuctionCacheKey } from "@/lib/kidz-auction-config"
import { notifyKidzAuctionUpdate } from "@/lib/kidz-auction-events"

export interface CachedKidzAuctionEntry {
  chainId: string
  chainIdHex: string
  auctionHouseAddress: string
  snapshot: NounsAuctionSnapshot
  updatedAt: string
}

interface KidzAuctionCacheState {
  version: number
  updatedAt: string
  entries: Record<string, CachedKidzAuctionEntry>
}

declare global {
  // eslint-disable-next-line no-var
  var __kidzAuctionCache: KidzAuctionCacheState | undefined
}

function getInitialCacheState(): KidzAuctionCacheState {
  return {
    version: 0,
    updatedAt: new Date(0).toISOString(),
    entries: {},
  }
}

function getCacheState(): KidzAuctionCacheState {
  if (!globalThis.__kidzAuctionCache) {
    globalThis.__kidzAuctionCache = getInitialCacheState()
  }

  return globalThis.__kidzAuctionCache
}

export function getKidzAuctionCacheVersion(): number {
  return getCacheState().version
}

export function getCachedKidzAuction({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): CachedKidzAuctionEntry | undefined {
  const cacheKey = getKidzAuctionCacheKey({ chainId, auctionHouseAddress })
  return getCacheState().entries[cacheKey]
}

export function getCachedKidzAuctionSnapshot({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): NounsAuctionSnapshot | undefined {
  return getCachedKidzAuction({ chainId, auctionHouseAddress })?.snapshot
}

export function setCachedKidzAuctionEntry(
  entry: CachedKidzAuctionEntry
): CachedKidzAuctionEntry {
  const cache = getCacheState()
  const cacheKey = getKidzAuctionCacheKey({
    chainId: entry.chainId,
    auctionHouseAddress: entry.auctionHouseAddress,
  })

  cache.entries[cacheKey] = entry
  cache.version += 1
  cache.updatedAt = entry.updatedAt
  notifyKidzAuctionUpdate(cache.version)

  return entry
}

export function listCachedKidzAuctionEntries(): CachedKidzAuctionEntry[] {
  return Object.values(getCacheState().entries)
}
