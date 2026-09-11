import { useQuery } from "@tanstack/react-query"
import { ethers } from "ethers"
import {
  buildNounsAuctionSnapshot,
  NOUNS_AUCTION_ABI,
  type NounsAuctionSnapshot,
} from "@/lib/nouns-auction"
import { normalizeChainId } from "@/lib/dao-config"
import { getRpcUrl } from "@/utils/endpoints"

export function useNounsAuction({
  chainId,
  auctionHouseAddress,
  enabled = true,
}: {
  chainId?: string
  auctionHouseAddress?: string
  enabled?: boolean
}) {
  const queryKey = ["nouns-auction", chainId, auctionHouseAddress]

  const { data, isLoading, isError } = useQuery({
    queryKey,
    enabled: enabled && !!chainId && !!auctionHouseAddress,
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<NounsAuctionSnapshot> => {
      if (!chainId || !auctionHouseAddress) {
        throw new Error("Missing chainId or auctionHouseAddress")
      }

      const chainIdDecimal = normalizeChainId(chainId)
      if (!chainIdDecimal) throw new Error("Invalid chainId")
      const rpcKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || undefined
      const rpcUrl = getRpcUrl({ chainid: chainIdDecimal, rpcKey })
      const provider = new ethers.JsonRpcProvider(rpcUrl)
      const auctionContract = new ethers.Contract(
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
    },
  })

  return {
    auction: data,
    isLoading,
    isError,
    hasData: !!data,
  }
}
