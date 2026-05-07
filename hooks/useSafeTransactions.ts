"use client"

import { useQuery } from "@tanstack/react-query"

const SAFE_TX_BASE: Record<string, string> = {
  "8453": "https://safe-transaction-base.safe.global",
  "1": "https://safe-transaction-mainnet.safe.global",
  "10": "https://safe-transaction-optimism.safe.global",
  "42161": "https://safe-transaction-arbitrum.safe.global",
  "137": "https://safe-transaction-polygon.safe.global",
}

export interface SafeActivityRow {
  id: string
  txHash: string | null
  executedAt: string | null
  title: string
  valueWei: string
  direction: "outgoing" | "incoming" | "internal"
  counterparty: string | null
  status: string
}

interface SafeTxResult {
  transactionHash?: string | null
  safe?: string
  to?: string | null
  from?: string | null
  value?: string | null
  executionDate?: string | null
  submissionDate?: string | null
  isExecuted?: boolean
  txType?: string
  transfers?: Array<{
    type: string
    value?: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    from?: string | null
    to?: string | null
  }>
}

function mapResultToRow(safeAddress: string, item: SafeTxResult, index: number): SafeActivityRow {
  const safe = safeAddress.toLowerCase()
  const transfers = item.transfers || []
  const primary = transfers[0]
  let direction: SafeActivityRow["direction"] = "internal"
  let title = item.txType || "Safe transaction"
  let counterparty: string | null = item.to || null
  let valueWei = item.value || "0"

  if (primary?.type === "ERC20_TRANSFER" || primary?.type === "ETHER_TRANSFER") {
    const from = (primary.from || "").toLowerCase()
    const to = (primary.to || "").toLowerCase()
    if (to === safe) direction = "incoming"
    else if (from === safe) direction = "outgoing"
    counterparty = direction === "incoming" ? primary.from || null : primary.to || null
    title = primary.tokenSymbol ? `${primary.type.includes("ETHER") ? "ETH" : primary.tokenSymbol} transfer` : "Token transfer"
    valueWei = primary.value || "0"
  } else if (item.to) {
    const to = item.to.toLowerCase()
    direction = to === safe ? "incoming" : "outgoing"
  }

  return {
    id: item.transactionHash || `idx-${index}`,
    txHash: item.transactionHash || null,
    executedAt: item.executionDate || item.submissionDate || null,
    title,
    valueWei,
    direction,
    counterparty,
    status: item.isExecuted === false ? "pending" : "completed",
  }
}

export function useSafeTransactions({
  chainid,
  safeAddress,
  limit = 25,
}: {
  chainid?: string
  safeAddress?: string | null
  limit?: number
}) {
  const base = chainid ? SAFE_TX_BASE[chainid] : undefined

  return useQuery({
    queryKey: ["safe-transactions", chainid, safeAddress, limit],
    enabled: Boolean(base && safeAddress),
    queryFn: async (): Promise<SafeActivityRow[]> => {
      if (!base || !safeAddress) return []

      const url = `${base}/api/v1/safes/${safeAddress}/all-transactions/?executed=true&queued=false&trusted=true&limit=${limit}`
      const res = await fetch(url)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Safe API ${res.status}: ${text.slice(0, 200)}`)
      }
      const json = (await res.json()) as { results?: SafeTxResult[] }
      const results = json.results || []
      return results.map((row, i) => mapResultToRow(safeAddress, row, i))
    },
  })
}
