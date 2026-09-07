"use client"

import { useQuery } from "@tanstack/react-query"
import { createPublicClient, formatEther, http } from "viem"
import { optimism } from "viem/chains"
import { auctionAbi } from "@buildeross/sdk/contract"

import { getAnnouncedBillContracts } from "@/lib/announced-bill-config"
import { getRpcUrl } from "@/utils/endpoints"

export interface NounsAuctionSnapshot {
  tokenId: number
  highestBidEth: string
  highestBidder: string
  startTime: number
  endTime: number
  settled: boolean
  reserveEth: string
}

export function useNounsBuilderAuction() {
  const contracts = getAnnouncedBillContracts()

  const query = useQuery({
    queryKey: ["nouns-auction", contracts.auction],
    queryFn: async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || getRpcUrl({ chainid: "10" })
      const client = createPublicClient({
        chain: optimism,
        transport: http(rpcUrl),
      })

      const [auction, reservePrice] = await Promise.all([
        client.readContract({
          address: contracts.auction as `0x${string}`,
          abi: auctionAbi,
          functionName: "auction",
        }),
        client.readContract({
          address: contracts.auction as `0x${string}`,
          abi: auctionAbi,
          functionName: "reservePrice",
        }),
      ])

      const [tokenId, highestBid, highestBidder, startTime, endTime, settled] = auction

      return {
        tokenId: Number(tokenId),
        highestBidEth: formatEther(highestBid),
        highestBidder: String(highestBidder),
        startTime: Number(startTime),
        endTime: Number(endTime),
        settled: Boolean(settled),
        reserveEth: formatEther(reservePrice),
      } satisfies NounsAuctionSnapshot
    },
    staleTime: 15_000,
  })

  return {
    auction: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
