import { formatUnits } from "ethers"
import type { TokenBalance } from "@/utils/daotypes"

const STABLE_SYMBOLS = new Set(["USDC", "USDT", "DAI", "USDBC", "USDbC", "FRAX", "LUSD", "USDS"])

export interface TreasuryTokenSummary {
  totalStableUsdFormatted: string
  tokenLines: { symbol: string; balanceFormatted: string }[]
  hasPricedTotal: boolean
}

export function summarizeTreasuryTokens(tokens: TokenBalance[] | undefined): TreasuryTokenSummary {
  if (!tokens?.length) {
    return {
      totalStableUsdFormatted: "—",
      tokenLines: [],
      hasPricedTotal: false,
    }
  }

  let stableSum = 0
  const tokenLines: { symbol: string; balanceFormatted: string }[] = []

  for (const t of tokens) {
    const symbol = (t.token?.symbol || "???").toUpperCase()
    const decimals = t.token?.decimals ?? 18
    let amount = 0
    try {
      amount = Number(formatUnits(t.balance, decimals))
    } catch {
      amount = 0
    }
    if (STABLE_SYMBOLS.has(symbol)) stableSum += amount
    const display =
      amount >= 1_000_000
        ? `${(amount / 1_000_000).toFixed(2)}M`
        : amount >= 1_000
          ? `${(amount / 1_000).toFixed(2)}K`
          : amount >= 1
            ? amount.toFixed(2)
            : amount.toFixed(4)
    tokenLines.push({ symbol: t.token?.symbol || "Token", balanceFormatted: display })
  }

  const hasPricedTotal = stableSum > 0
  const totalStableUsdFormatted = hasPricedTotal
    ? `$${stableSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : "—"

  return { totalStableUsdFormatted, tokenLines, hasPricedTotal }
}

export function allocationFromBalances(tokens: TokenBalance[] | undefined): {
  category: string
  amountLabel: string
  percentage: number
  color: string
}[] {
  if (!tokens?.length) return []

  const colors = ["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", "bg-red-400", "bg-cyan-400"]

  const weights = tokens.map((t) => {
    const symbol = (t.token?.symbol || "???").toUpperCase()
    const decimals = t.token?.decimals ?? 18
    let amount = 0
    try {
      amount = Number(formatUnits(t.balance, decimals))
    } catch {
      amount = 0
    }
    if (STABLE_SYMBOLS.has(symbol)) return { symbol: t.token?.symbol || "Token", weight: amount, amountLabel: `~$${amount.toLocaleString()}` }
    const w = Math.sqrt(Math.max(amount, 1e-18))
    return {
      symbol: t.token?.symbol || "Token",
      weight: w,
      amountLabel: amount.toLocaleString(undefined, { maximumSignificantDigits: 4 }),
    }
  })

  const sum = weights.reduce((a, r) => a + r.weight, 0) || 1

  return weights.map((r, i) => ({
    category: r.symbol,
    amountLabel: r.amountLabel,
    percentage: Math.max(1, Math.round((r.weight / sum) * 100)),
    color: colors[i % colors.length],
  }))
}
