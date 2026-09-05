"use client"

import { useQuery } from "@tanstack/react-query"

import type { SafeTransaction } from "@/services/safe-transactions"

export function useSafeTransactions({
  chainId = "8453",
  safeAddress,
  limit = 20,
}: {
  chainId?: string
  safeAddress?: string
  limit?: number
}) {
  return useQuery({
    queryKey: ["safe-transactions", chainId, safeAddress, limit],
    enabled: Boolean(safeAddress),
    queryFn: async (): Promise<SafeTransaction[]> => {
      const params = new URLSearchParams({
        chainId,
        limit: String(limit),
        safeAddress: safeAddress!,
      })

      const response = await fetch(`/api/safe-transactions?${params.toString()}`)
      if (!response.ok) throw new Error("Unable to load Safe transactions")

      const payload = (await response.json()) as { transactions: SafeTransaction[] }
      return payload.transactions || []
    },
    staleTime: 60_000,
  })
}
