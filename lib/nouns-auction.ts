import { formatEther } from "ethers"

export const NOUNS_AUCTION_ABI = [
  {
    inputs: [],
    name: "auction",
    outputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "highestBid", type: "uint256" },
      { internalType: "address", name: "highestBidder", type: "address" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "bool", name: "settled", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reservePrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export type NounsAuctionStatusKind =
  | "live"
  | "ending-soon"
  | "ended-unsettled"
  | "settled"
  | "idle"

export interface NounsAuctionSnapshot {
  tokenId: string
  highestBidEth: string
  highestBidder: string
  endTime: number
  settled: boolean
  reserveEth: string
  status: NounsAuctionStatusKind
  label: string
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const ENDING_SOON_MS = 60 * 60 * 1000

function formatEthAmount(valueWei: bigint): string {
  const parsed = Number.parseFloat(formatEther(valueWei))
  if (parsed === 0) return "0"
  if (parsed < 0.0001) return "<0.0001"
  return parsed.toFixed(4).replace(/\.?0+$/, "")
}

function shortenAddress(address: string): string {
  if (!address || address === ZERO_ADDRESS) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function formatTimeRemaining(endTimeMs: number, nowMs: number): string {
  const remainingMs = Math.max(endTimeMs - nowMs, 0)
  const totalMinutes = Math.floor(remainingMs / 60_000)

  if (totalMinutes <= 0) return "0m"

  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function buildNounsAuctionSnapshot({
  tokenId,
  highestBid,
  highestBidder,
  endTime,
  settled,
  reservePrice,
  nowMs = Date.now(),
}: {
  tokenId: bigint
  highestBid: bigint
  highestBidder: string
  endTime: bigint
  settled: boolean
  reservePrice: bigint
  nowMs?: number
}): NounsAuctionSnapshot {
  const endTimeMs = Number(endTime) * 1000
  const highestBidEth = formatEthAmount(highestBid)
  const reserveEth = formatEthAmount(reservePrice)
  const hasBid =
    highestBid > 0n && highestBidder.toLowerCase() !== ZERO_ADDRESS
  const isPastEnd = endTimeMs <= nowMs

  let status: NounsAuctionStatusKind = "idle"
  let label = "No live auction"

  if (settled) {
    status = "settled"
    label = `Auction #${tokenId.toString()} settled`
  } else if (isPastEnd) {
    status = "ended-unsettled"
    label = `Auction #${tokenId.toString()} · ended · unsettled`
  } else if (endTimeMs - nowMs <= ENDING_SOON_MS) {
    status = "ending-soon"
    if (hasBid) {
      label = `Auction #${tokenId.toString()} · ${highestBidEth} ETH · ends in ${formatTimeRemaining(endTimeMs, nowMs)} · ${shortenAddress(highestBidder)}`
    } else {
      label = `Auction #${tokenId.toString()} · reserve ${reserveEth} ETH · ends in ${formatTimeRemaining(endTimeMs, nowMs)}`
    }
  } else {
    status = "live"
    if (hasBid) {
      label = `Live bid · ${highestBidEth} ETH · ${shortenAddress(highestBidder)} · ends in ${formatTimeRemaining(endTimeMs, nowMs)}`
    } else {
      label = `Auction #${tokenId.toString()} · reserve ${reserveEth} ETH · ends in ${formatTimeRemaining(endTimeMs, nowMs)}`
    }
  }

  return {
    tokenId: tokenId.toString(),
    highestBidEth,
    highestBidder,
    endTime: Number(endTime),
    settled,
    reserveEth,
    status,
    label,
  }
}
