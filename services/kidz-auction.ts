import { Contract, JsonRpcProvider } from "ethers"

import {
  buildNounsAuctionSnapshot,
  NOUNS_AUCTION_ABI,
  type NounsAuctionSnapshot,
} from "@/lib/nouns-auction"
import {
  findKidzAuctionTarget,
  findKidzAuctionTargetsForNetwork,
  KIDZ_AUCTION_TARGETS,
  type KidzAuctionTarget,
} from "@/lib/kidz-auction-config"
import {
  getCachedKidzAuction,
  setCachedKidzAuctionEntry,
  type CachedKidzAuctionEntry,
} from "@/lib/kidz-auction-cache"
import { getRpcUrl } from "@/utils/endpoints"

function getAlchemyRpcKey(): string | undefined {
  return (
    process.env.ALCHEMY_API_KEY ||
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ||
    undefined
  )
}

async function readKidzAuctionSnapshotFromChain({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): Promise<NounsAuctionSnapshot> {
  const rpcUrl = getRpcUrl({
    chainid: chainId,
    rpcKey: getAlchemyRpcKey(),
  })
  const provider = new JsonRpcProvider(rpcUrl)
  const auctionContract = new Contract(
    auctionHouseAddress,
    NOUNS_AUCTION_ABI,
    provider
  )

  const [auction, reservePrice] = await Promise.all([
    auctionContract.auction(),
    auctionContract.reservePrice(),
  ])

  return buildNounsAuctionSnapshot({
    tokenId: auction.tokenId,
    highestBid: auction.highestBid,
    highestBidder: auction.highestBidder,
    endTime: auction.endTime,
    settled: auction.settled,
    reservePrice,
  })
}

function toCachedEntry({
  target,
  snapshot,
}: {
  target: KidzAuctionTarget
  snapshot: NounsAuctionSnapshot
}): CachedKidzAuctionEntry {
  return {
    chainId: target.chainId,
    chainIdHex: target.chainIdHex,
    auctionHouseAddress: target.auctionHouseAddress,
    snapshot,
    updatedAt: new Date().toISOString(),
  }
}

export async function refreshKidzAuctionFromChain({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): Promise<CachedKidzAuctionEntry | undefined> {
  const target = findKidzAuctionTarget({ chainId, auctionHouseAddress })
  if (!target) return undefined

  const snapshot = await readKidzAuctionSnapshotFromChain({
    chainId: target.chainId,
    auctionHouseAddress: target.auctionHouseAddress,
  })

  return setCachedKidzAuctionEntry(
    toCachedEntry({
      target,
      snapshot,
    })
  )
}

export async function refreshKidzAuctionsForNetwork(
  network?: string
): Promise<CachedKidzAuctionEntry[]> {
  const targets = findKidzAuctionTargetsForNetwork(network)
  const refreshedEntries = await Promise.all(
    targets.map((target) =>
      refreshKidzAuctionFromChain({
        chainId: target.chainId,
        auctionHouseAddress: target.auctionHouseAddress,
      })
    )
  )

  return refreshedEntries.filter(
    (entry): entry is CachedKidzAuctionEntry => Boolean(entry)
  )
}

export async function refreshAllKidzAuctions(): Promise<CachedKidzAuctionEntry[]> {
  return refreshKidzAuctionsForNetwork()
}

export async function getKidzAuctionSnapshot({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): Promise<CachedKidzAuctionEntry | undefined> {
  const target = findKidzAuctionTarget({ chainId, auctionHouseAddress })
  if (!target) return undefined

  const cachedEntry = getCachedKidzAuction({
    chainId: target.chainId,
    auctionHouseAddress: target.auctionHouseAddress,
  })

  if (cachedEntry) return cachedEntry

  return refreshKidzAuctionFromChain({
    chainId: target.chainId,
    auctionHouseAddress: target.auctionHouseAddress,
  })
}

export async function ensureKidzAuctionCacheWarm(): Promise<void> {
  await Promise.all(
    KIDZ_AUCTION_TARGETS.map((target) =>
      getKidzAuctionSnapshot({
        chainId: target.chainId,
        auctionHouseAddress: target.auctionHouseAddress,
      })
    )
  )
}
