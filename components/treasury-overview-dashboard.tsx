"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, PieChart, Shield } from "lucide-react"
import { useDao } from "@/hooks/useDao"
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances"
import { formatEther } from "ethers"
import { allocationFromBalances, summarizeTreasuryTokens } from "@/utils/treasury-helpers"
import { useMemo } from "react"

const CHAIN = "8453"

export function TreasuryOverviewDashboard() {
  const { dao, isLoading } = useDao({
    chainid: CHAIN,
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const { tokens, isLoading: tokLoading } = useDaoTokenBalances({
    chainid: CHAIN,
    safeAddress: dao?.safeAddress,
  })

  const summary = useMemo(() => summarizeTreasuryTokens(tokens), [tokens])
  const fundAllocation = useMemo(() => allocationFromBalances(tokens), [tokens])

  if (isLoading || !dao) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg"></div>
  }

  const shamans = dao.shamen?.length ?? 0
  const vaults = dao.vaults?.length ?? 0

  const treasuryStats = [
    {
      label: "Total Shares",
      value: Math.round(Number(formatEther(dao.totalShares || "0"))).toLocaleString(),
      subValue: dao.shareTokenSymbol,
      change: "On-chain",
      changeType: "neutral" as const,
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "Total Loot",
      value: Math.round(Number(formatEther(dao.totalLoot || "0"))).toLocaleString(),
      subValue: dao.lootTokenSymbol,
      change: "On-chain",
      changeType: "neutral" as const,
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      label: "Stables (est.)",
      value: summary.totalStableUsdFormatted,
      subValue: summary.hasPricedTotal ? "USDC / USDT / DAI…" : "No stable balance",
      change: "Indexer",
      changeType: "neutral" as const,
      icon: PieChart,
      color: "text-purple-400",
    },
    {
      label: "Shamans / Vaults",
      value: `${shamans} / ${vaults}`,
      subValue: "Moloch config",
      change: "Subgraph",
      changeType: "neutral" as const,
      icon: Shield,
      color: "text-orange-400",
    },
  ]

  const topPct = fundAllocation[0]?.percentage ?? 0
  const concentration = Math.min(100, topPct)
  const riskMetrics = [
    { label: "Largest bucket (balances)", level: concentration, status: concentration > 70 ? "high" : concentration > 45 ? "medium" : "low" },
    { label: "Token count", level: Math.min(100, (tokens?.length || 0) * 8), status: "low" },
  ]

  const getRiskColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {treasuryStats.map((stat) => (
          <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.subValue ? <p className="text-xs text-muted-foreground">{stat.subValue}</p> : null}
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card-gradient p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Token mix</h3>
              <div className="text-sm text-muted-foreground">
                {tokLoading ? "Loading…" : `${tokens?.length || 0} tokens`}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Percentages approximate relative weights (stables by USD, others by balance scale).
            </p>
            <div className="space-y-4">
              {!fundAllocation.length ? (
                <p className="text-sm text-muted-foreground">No balances from Sequence indexer.</p>
              ) : (
                fundAllocation.map((fund) => (
                  <div key={fund.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{fund.category}</span>
                      <div className="text-right">
                        <span className="text-foreground font-medium">{fund.amountLabel}</span>
                        <span className="text-muted-foreground ml-2">({fund.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={fund.percentage} className="h-2" />
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Concentration hints</h3>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Not investment advice — simple heuristics from indexed Safe balances.
            </p>
            <div className="space-y-4">
              {riskMetrics.map((risk) => (
                <div key={risk.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{risk.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getRiskColor(risk.status)}`}>
                        {risk.status.toUpperCase()}
                      </span>
                      <span className="text-foreground">{risk.level}%</span>
                    </div>
                  </div>
                  <Progress value={risk.level} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">DAO parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Quorum</span>
              <p className="text-foreground font-medium">{dao.quorumPercent}%</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Voting period</span>
              <p className="text-foreground font-medium">{Number(dao.votingPeriod) / 3600}h</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Proposals (lifetime)</span>
              <p className="text-foreground font-medium">{dao.proposalCount}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
