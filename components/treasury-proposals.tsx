"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Clock, Vote, ExternalLink } from "lucide-react"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { formatDistanceToNow } from "date-fns"
import { formatUnits } from "ethers"
import Link from "next/link"

export function TreasuryProposals() {
  const { proposals, isLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Treasury Proposals</h3>
          </div>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Treasury Proposals</h3>
          <Button size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95" asChild>
            <Link
              href={`https://admin.daohaus.club/molochv3/0x2105/${process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS}/proposals`}
              target="_blank"
              rel="noopener noreferrer"
            >
              All Proposals
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {proposals?.slice(0, 5).map((proposal) => {
            const isActive = Number(proposal.votingEnds) * 1000 > Date.now() && !proposal.processed && !proposal.cancelled
            const status = proposal.passed
              ? "Passed"
              : proposal.cancelled
                ? "Cancelled"
                : proposal.actionFailed
                  ? "Failed"
                  : proposal.processed
                    ? "Processed"
                    : isActive
                      ? "Active"
                      : "Ended"

            const timeLeft = isActive
              ? formatDistanceToNow(new Date(Number(proposal.votingEnds) * 1000), { addSuffix: true })
              : "Ended"

            return (
              <div key={proposal.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">#{proposal.proposalId}</span>
                      <Badge variant="outline" className="text-xs">
                        {proposal.proposalType || "General"}
                      </Badge>
                      <Badge
                        className={
                          status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : status === "Passed" || status === "Processed"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }
                      >
                        {status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground text-sm md:text-base line-clamp-1">{proposal.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 text-xs md:text-sm">{proposal.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                      {Number(proposal.tributeOffered) > 0 && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            {formatUnits(proposal.tributeOffered, proposal.tributeTokenDecimals || 18)} {proposal.tributeTokenSymbol}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{timeLeft}</span>
                      </div>
                      <span className="hidden md:inline">by {proposal.proposedBy ? `${proposal.proposedBy.slice(0, 6)}...${proposal.proposedBy.slice(-4)}` : "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {status === "Active" && (
                  <div className="pt-2 border-t border-border/50 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      asChild
                    >
                      <Link
                        href={`https://admin.daohaus.club/molochv3/0x2105/${process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS}/proposal/${proposal.proposalId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View & Vote <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )
          })}

          {(!proposals || proposals.length === 0) && (
            <div className="text-center p-6 text-muted-foreground border border-dashed border-border rounded-lg">
              No proposals found.
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
