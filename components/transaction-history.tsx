"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, ExternalLink } from "lucide-react"
import Link from "next/link"

import { useDao } from "@/hooks/useDao"
import { useSafeTransactions } from "@/hooks/useSafeTransactions"
import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import { getBlockExplorerUrl } from "@/utils/endpoints"

function truncateAddress(address: string | null | undefined): string {
  if (!address) return "—"
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function truncateHash(hash: string | null | undefined): string {
  if (!hash) return "—"
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`
}

export function TransactionHistory() {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  const { dao } = useDao({
    chainid: "8453",
    daoid: daoAddress,
  })

  const safeAddress = dao?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS
  const { data: transactions, isLoading, isError } = useSafeTransactions({
    chainId: "8453",
    safeAddress,
    limit: 20,
  })

  const explorerBase = getBlockExplorerUrl({ chainid: "8453" })

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
            <p className="text-xs text-muted-foreground font-mono break-all">{safeAddress}</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 self-start" asChild>
            <Link href={`${explorerBase}/address/${safeAddress}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on BaseScan
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-10 bg-muted border-border" disabled />
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Select disabled>
              <SelectTrigger className="flex-1 sm:w-32 bg-muted border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Unable to load Safe transaction history.
          </p>
        ) : !transactions?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No Safe transactions recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="border border-border rounded-lg p-3 md:p-4 dao-card-hover">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                  <div className="flex items-start md:items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        tx.type === "incoming"
                          ? "bg-green-500/10"
                          : tx.type === "outgoing"
                            ? "bg-red-500/10"
                            : "bg-yellow-500/10"
                      }`}
                    >
                      {tx.type === "incoming" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowUpRight
                          className={`h-4 w-4 ${
                            tx.type === "outgoing" ? "text-red-400" : "text-yellow-400"
                          }`}
                        />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-foreground text-sm md:text-base truncate">
                          {tx.description}
                        </h4>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <span className="flex-shrink-0">{tx.timestamp}</span>
                        {tx.txHash && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <Link
                              href={getBlockExplorerUrl({ chainid: "8453", txHash: tx.txHash })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono hover:text-foreground"
                            >
                              {truncateHash(tx.txHash)}
                            </Link>
                          </>
                        )}
                        {tx.counterparty && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="truncate hidden md:block font-mono">
                              {tx.type === "incoming" ? "From" : "To"}: {truncateAddress(tx.counterparty)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 md:text-right flex-shrink-0">
                    <div
                      className={`font-medium text-sm md:text-base font-mono ${
                        tx.type === "incoming"
                          ? "text-green-400"
                          : tx.type === "outgoing"
                            ? "text-red-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {tx.type === "incoming" ? "+" : tx.type === "outgoing" ? "-" : ""}
                      {tx.value} {tx.asset}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
