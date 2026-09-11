"use client"

import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import type { NounsAuctionSnapshot } from "@/lib/nouns-auction"
import { findKidzAuctionTarget } from "@/lib/kidz-auction-config"

const LIVE_FALLBACK_REFETCH_MS = 10 * 60 * 1000

interface KidzAuctionApiResponse {
  version: number
  chainId: string
  auctionHouseAddress: string
  updatedAt: string
  auction: NounsAuctionSnapshot
}

function isLiveLikeAuctionStatus(status?: NounsAuctionSnapshot["status"]): boolean {
  return status === "live" || status === "ending-soon"
}

async function fetchKidzAuctionSnapshot({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): Promise<KidzAuctionApiResponse> {
  const params = new URLSearchParams({
    chainId,
    auctionHouseAddress,
  })

  const response = await fetch(`/api/kidz-auction?${params.toString()}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Unable to load Kidz auction snapshot")
  }

  return response.json() as Promise<KidzAuctionApiResponse>
}

export function useNounsAuction({
  chainId,
  auctionHouseAddress,
  enabled = true,
}: {
  chainId?: string
  auctionHouseAddress?: string
  enabled?: boolean
}) {
  const queryClient = useQueryClient()
  const target = findKidzAuctionTarget({ chainId, auctionHouseAddress })
  const isSupportedTarget = Boolean(target)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nouns-auction", chainId, auctionHouseAddress],
    enabled: enabled && isSupportedTarget && !!chainId && !!auctionHouseAddress,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const status = query.state.data?.auction.status
      return isLiveLikeAuctionStatus(status) ? LIVE_FALLBACK_REFETCH_MS : false
    },
    queryFn: async () => {
      if (!chainId || !auctionHouseAddress) {
        throw new Error("Missing chainId or auctionHouseAddress")
      }

      return fetchKidzAuctionSnapshot({ chainId, auctionHouseAddress })
    },
  })

  useEffect(() => {
    if (!enabled || !isSupportedTarget || !chainId || !auctionHouseAddress) return

    const eventSource = new EventSource("/api/kidz-auction/events")

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["nouns-auction", chainId, auctionHouseAddress],
      })
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [enabled, isSupportedTarget, chainId, auctionHouseAddress, queryClient])

  return {
    auction: data?.auction,
    isLoading,
    isError,
    hasData: !!data?.auction,
  }
}
