"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink, Wallet } from "lucide-react"
import Link from "next/link"
import { formatEther } from "ethers"

import { Button } from "@/components/ui/button"
import { useDao } from "@/hooks/useDao"
import {
  getTreasuryEthWarning,
  getTreasurySkippedTokenWarning,
  hasTreasuryRpcDegradation,
  useSafeTreasuryBalances,
} from "@/hooks/useSafeTreasuryBalances"
import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import { getBlockExplorerUrl } from "@/utils/endpoints"

export function TreasuryOverviewDashboard() {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: daoAddress,
  })
  const {
    data: treasury,
    isLoading: treasuryLoading,
    isError: treasuryError,
  } = useSafeTreasuryBalances({
    chainId: "8453",
    daoAddress,
    safeAddress: dao?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS,
  })

  const safeAddress = treasury?.safeAddress || dao?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS
  const hardRpcFailure = hasTreasuryRpcDegradation(treasury, treasuryError)
  const skippedWarning = getTreasurySkippedTokenWarning(treasury)
  const ethWarning = getTreasuryEthWarning(treasury)
  const displayTokens = (treasury?.tokens ?? []).filter(
    (token) =>
      !(token.symbol === "ETH" && token.address === null && treasury?.ethFetchFailed)
  )

  if (daoLoading || treasuryLoading) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />
  }
  const explorerUrl = getBlockExplorerUrl({
    chainid: "8453",
    address: safeAddress,
  })

  const treasuryStats = [
    {
      label: "Safe ETH",
      value: treasury?.ethFetchFailed
        ? "—"
        : Number(treasury?.ethFormatted || "0").toLocaleString(undefined, {
            maximumFractionDigits: 4,
          }),
      subValue: treasury?.ethFetchFailed ? "RPC unavailable" : "ETH",
    },
    {
      label: "Total Shares",
      value: dao
        ? Math.round(Number(formatEther(dao.totalShares || "0"))).toLocaleString()
        : "—",
      subValue: dao?.shareTokenSymbol || "vCRTV",
    },
    {
      label: "Total Loot",
      value: dao
        ? Math.round(Number(formatEther(dao.totalLoot || "0"))).toLocaleString()
        : "—",
      subValue: dao?.lootTokenSymbol || "nvCRTV",
    },
    {
      label: "Active Members",
      value: dao ? String(dao.activeMemberCount || "0") : "—",
      subValue: dao ? "on-chain" : "subgraph unavailable",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {treasuryStats.map((stat) => (
          <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.subValue}</p>
          </Card>
        ))}
      </div>

      <Card className="stat-card-gradient p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground">Safe Balances</h3>
            <p className="text-sm text-muted-foreground font-mono break-all">{safeAddress}</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 self-start" asChild>
            <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <Wallet className="h-4 w-4 mr-2" />
              View Safe
              <ExternalLink className="h-3 w-3 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {hardRpcFailure ? (
            <p className="text-sm text-amber-400">
              Unable to load live balances from RPC. Safe address is shown above — verify on
              BaseScan.
            </p>
          ) : displayTokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No balances found for this Safe.</p>
          ) : (
            displayTokens.map((token) => (
              <div
                key={`${token.symbol}-${token.address || "eth"}`}
                className="flex items-center justify-between border-b border-border/40 pb-2"
              >
                <div>
                  <p className="font-medium text-foreground">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                </div>
                <p className="font-mono text-foreground">{token.formatted}</p>
              </div>
            ))
          )}

          {ethWarning ? <p className="text-sm text-amber-400">{ethWarning}</p> : null}
          {skippedWarning ? <p className="text-sm text-amber-400">{skippedWarning}</p> : null}
        </div>
      </Card>
    </div>
  )
}
