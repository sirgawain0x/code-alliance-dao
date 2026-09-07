"use client"

import { useQuery } from "@tanstack/react-query"
import { createPublicClient, formatEther, http } from "viem"
import { optimism } from "viem/chains"

import { getAnnouncedBillContracts } from "@/lib/announced-bill-config"
import { getRpcUrl } from "@/utils/endpoints"

export function useNounsBuilderTreasury() {
  const contracts = getAnnouncedBillContracts()

  const query = useQuery({
    queryKey: ["nouns-treasury", contracts.treasury],
    queryFn: async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || getRpcUrl({ chainid: "10" })
      const client = createPublicClient({
        chain: optimism,
        transport: http(rpcUrl),
      })

      const balance = await client.getBalance({
        address: contracts.treasury as `0x${string}`,
      })

      return {
        ethBalance: formatEther(balance),
        treasuryAddress: contracts.treasury,
      }
    },
    staleTime: 30_000,
  })

  return {
    treasury: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
