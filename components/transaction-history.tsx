"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react"
import { useDao } from "@/hooks/useDao"
import { useSafeTransactions } from "@/hooks/useSafeTransactions"
import { formatEther } from "ethers"
import { format } from "date-fns"
import Link from "next/link"
import { getBlockExplorerUrl } from "@/utils/endpoints"

const CHAIN = "8453"

export function TransactionHistory() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const { dao, isLoading: daoLoading } = useDao({
    chainid: CHAIN,
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const { data: rows, isLoading: txLoading, isError, error } = useSafeTransactions({
    chainid: CHAIN,
    safeAddress: dao?.safeAddress,
    limit: 30,
  })

  const filtered = useMemo(() => {
    if (!rows) return []
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.direction !== typeFilter) return false
      const q = search.trim().toLowerCase()
      if (!q) return true
      return (
        (r.title || "").toLowerCase().includes(q) ||
        (r.txHash || "").toLowerCase().includes(q) ||
        (r.counterparty || "").toLowerCase().includes(q)
      )
    })
  }, [rows, search, typeFilter])

  const ethLabel = (wei: string) => {
    try {
      const v = BigInt(wei || "0")
      if (v === BigInt(0)) return "—"
      const n = Number(formatEther(v))
      return `${n >= 1 ? n.toFixed(3) : n.toFixed(6)} ETH`
    } catch {
      return "—"
    }
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          <div className="hidden sm:flex space-x-2">
            <Button variant="outline" size="sm" type="button" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Safe API
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Executed transactions for the DAO treasury Safe via the{" "}
          <a className="underline" href="https://docs.safe.global/core-api/transaction-service-overview" target="_blank" rel="noreferrer">
            Safe Transaction Service
          </a>
          . Amounts show native value when present; many ERC-20 moves appear with title only.
        </p>

        {daoLoading ? (
          <p className="text-sm text-muted-foreground">Loading treasury address…</p>
        ) : !dao?.safeAddress ? (
          <p className="text-sm text-muted-foreground">No Safe address on this DAO record.</p>
        ) : null}

        {isError ? (
          <p className="text-sm text-destructive">{error instanceof Error ? error.message : "Failed to load txs"}</p>
        ) : null}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, hash, counterparty…"
              className="pl-10 bg-muted border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1 sm:w-40 bg-muted border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {txLoading ? (
            <p className="text-sm text-muted-foreground">Loading recent transactions…</p>
          ) : !filtered.length ? (
            <p className="text-sm text-muted-foreground">No transactions match your filters.</p>
          ) : (
            filtered.map((tx) => (
              <div key={tx.id} className="border border-border rounded-lg p-3 md:p-4 dao-card-hover">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                  <div className="flex items-start md:items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        tx.direction === "incoming"
                          ? "bg-green-500/10"
                          : tx.direction === "outgoing"
                            ? "bg-red-500/10"
                            : "bg-muted"
                      }`}
                    >
                      {tx.direction === "incoming" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-400" />
                      ) : tx.direction === "outgoing" ? (
                        <ArrowUpRight className="h-4 w-4 text-red-400" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-foreground text-sm md:text-base truncate">{tx.title}</h4>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {tx.direction}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <span className="flex-shrink-0">
                          {tx.executedAt
                            ? format(new Date(tx.executedAt), "yyyy-MM-dd HH:mm")
                            : "—"}
                        </span>
                        {tx.txHash ? (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <Link
                              className="font-mono truncate max-w-[200px] text-primary hover:underline"
                              href={getBlockExplorerUrl({ chainid: CHAIN, txHash: tx.txHash })}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {tx.txHash.slice(0, 10)}…{tx.txHash.slice(-6)}
                            </Link>
                          </>
                        ) : null}
                        {tx.counterparty ? (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="truncate hidden md:block font-mono text-[11px]">{tx.counterparty}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 md:text-right flex-shrink-0">
                    <div
                      className={`font-medium text-sm md:text-base ${
                        tx.direction === "incoming"
                          ? "text-green-400"
                          : tx.direction === "outgoing"
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {tx.direction === "incoming" ? "+" : tx.direction === "outgoing" ? "-" : ""}
                      {ethLabel(tx.valueWei)}
                    </div>
                    <Badge
                      className={
                        tx.status === "completed"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center pt-2">
          <Button variant="outline" type="button" disabled>
            End of loaded page
          </Button>
        </div>
      </div>
    </Card>
  )
}
