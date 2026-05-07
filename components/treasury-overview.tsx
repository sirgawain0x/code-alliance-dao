"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, PieChart } from "lucide-react"
import { useDao } from "@/hooks/useDao"
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances"
import { allocationFromBalances, summarizeTreasuryTokens } from "@/utils/treasury-helpers"
import { Progress } from "@/components/ui/progress"
import { useMemo } from "react"

const CHAIN = "8453"

export function TreasuryOverview() {
  const { dao, isLoading: daoLoading } = useDao({
    chainid: CHAIN,
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const { tokens, isLoading: tokLoading } = useDaoTokenBalances({
    chainid: CHAIN,
    safeAddress: dao?.safeAddress,
  })

  const summary = useMemo(() => summarizeTreasuryTokens(tokens), [tokens])
  const allocations = useMemo(() => allocationFromBalances(tokens), [tokens])

  if (daoLoading || tokLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="h-40 animate-pulse bg-muted rounded-lg" />
      </Card>
    )
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Treasury Overview</h3>
          <Button variant="outline" size="sm" type="button" asChild>
            <a href={`https://app.safe.global/home?safe=base:${dao?.safeAddress}`} target="_blank" rel="noreferrer">
              <PieChart className="h-4 w-4 mr-2" />
              Safe app
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Stablecoin total is summed at ~$1 per unit (USDC, USDT, DAI, etc.). Other tokens are listed without USD
          pricing.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-muted-foreground">Stablecoin holdings (est.)</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{summary.totalStableUsdFormatted}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Tracked tokens</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{tokens?.length ?? 0}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Allocation (by balances)</h4>
          {!allocations.length ? (
            <p className="text-sm text-muted-foreground">No token balances from indexer.</p>
          ) : (
            allocations.map((allocation) => (
              <div key={allocation.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{allocation.category}</span>
                  <span className="text-foreground">{allocation.amountLabel}</span>
                </div>
                <Progress value={allocation.percentage} className="h-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
