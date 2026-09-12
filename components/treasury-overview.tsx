"use client"

import { Card } from "@/components/ui/card"
import { Wallet } from "lucide-react"

import { useDao } from "@/hooks/useDao"
import { useSafeTreasuryBalances } from "@/hooks/useSafeTreasuryBalances"
import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"

export function TreasuryOverview() {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  const { dao } = useDao({
    chainid: "8453",
    daoid: daoAddress,
  })
  const { data: treasury, isLoading } = useSafeTreasuryBalances({
    chainId: "8453",
    daoAddress,
    safeAddress: dao?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS,
  })

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-muted rounded-lg" />
  }

  return (
    <Card className="stat-card-gradient p-6 min-w-0 overflow-hidden">
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">Treasury Overview</h3>
          <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        <div className="space-y-2 min-w-0">
          <p className="text-sm text-muted-foreground">Safe ETH balance</p>
          <p className="text-2xl font-bold text-foreground">
            {Number(treasury?.ethFormatted || "0").toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            ETH
          </p>
          <p
            className="text-xs text-muted-foreground font-mono truncate min-w-0"
            title={treasury?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS}
          >
            {treasury?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS}
          </p>
        </div>

        <div className="space-y-3 min-w-0">
          <h4 className="font-medium text-foreground">Token balances</h4>
          {(treasury?.tokens || []).map((token) => (
            <div
              key={`${token.symbol}-${token.address || "eth"}`}
              className="flex justify-between gap-2 text-sm min-w-0"
            >
              <span className="text-muted-foreground shrink-0">{token.symbol}</span>
              <span className="text-foreground font-mono truncate min-w-0 text-right">{token.formatted}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
