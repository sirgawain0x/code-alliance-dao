import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"

const SAFE_TX_SERVICE_URLS: Record<string, string> = {
  "8453": "https://safe-transaction-base.safe.global",
  "0x2105": "https://safe-transaction-base.safe.global",
}

export interface SafeTransaction {
  id: string
  txHash: string | null
  type: "incoming" | "outgoing" | "pending"
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  value: string
  asset: string
  counterparty: string | null
}

interface SafeApiTransaction {
  txHash?: string | null
  executionDate?: string | null
  submissionDate?: string | null
  isExecuted?: boolean
  isSuccessful?: boolean | null
  value?: string
  dataDecoded?: {
    method?: string
    parameters?: Array<{ name?: string; value?: string }>
  } | null
  to?: string | null
  from?: string | null
}

function getSafeTxServiceUrl(chainId: string): string | null {
  const normalized = chainId.startsWith("0x")
    ? String(parseInt(chainId, 16))
    : chainId

  return SAFE_TX_SERVICE_URLS[chainId] || SAFE_TX_SERVICE_URLS[normalized] || null
}

function formatTimestamp(isoDate: string | null | undefined): string {
  if (!isoDate) return "—"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString()
}

function mapSafeTransaction(tx: SafeApiTransaction, safeAddress: string): SafeTransaction {
  const isExecuted = tx.isExecuted === true
  const isSuccessful = tx.isSuccessful !== false
  const status = !isExecuted ? "pending" : isSuccessful ? "completed" : "failed"

  const to = tx.to?.toLowerCase() || ""
  const from = tx.from?.toLowerCase() || ""
  const safe = safeAddress.toLowerCase()
  const type = to === safe ? "incoming" : from === safe ? "outgoing" : "outgoing"

  const method = tx.dataDecoded?.method
  const description = method ? `Safe: ${method}` : "Safe transaction"

  const weiValue = tx.value || "0"
  const ethValue = Number(weiValue) / 1e18

  return {
    id: tx.txHash || `${tx.submissionDate}-${to}`,
    txHash: tx.txHash || null,
    type: status === "pending" ? "pending" : type,
    description,
    timestamp: formatTimestamp(tx.executionDate || tx.submissionDate),
    status,
    value: ethValue > 0 ? ethValue.toFixed(6) : "0",
    asset: "ETH",
    counterparty: type === "incoming" ? tx.from || null : tx.to || null,
  }
}

export async function getSafeTransactions({
  chainId = "8453",
  safeAddress = CREATIVE_ORG_SAFE_ADDRESS,
  limit = 20,
}: {
  chainId?: string
  safeAddress?: string
  limit?: number
}): Promise<SafeTransaction[]> {
  const serviceUrl = getSafeTxServiceUrl(chainId)
  if (!serviceUrl || !safeAddress) return []

  const url = `${serviceUrl}/api/v1/safes/${safeAddress}/all-transactions/?limit=${limit}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    console.warn(`Safe transaction service returned ${response.status} for ${safeAddress}`)
    return []
  }

  const payload = (await response.json()) as { results?: SafeApiTransaction[] }
  const results = payload.results || []

  return results.map((tx) => mapSafeTransaction(tx, safeAddress))
}
