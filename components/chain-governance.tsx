"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, User, ArrowRight } from "lucide-react"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useDao } from "@/hooks/useDao"
import Link from "next/link"
import { useMemo } from "react"

function formatTimeRemaining(votingEnds: string): string {
  const now = Math.floor(Date.now() / 1000)
  const ends = Number(votingEnds)
  const diff = ends - now

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)

  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

function getStatus(proposal: { processed: boolean; cancelled: boolean; votingEnds: string }): string {
  if (proposal.cancelled) return "Cancelled"
  if (proposal.processed) return "Processed"
  const now = Math.floor(Date.now() / 1000)
  if (Number(proposal.votingEnds) > now) return "Active"
  return "Ended"
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "Processed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

export function ChainGovernance() {
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  })

  const { proposals, isLoading: proposalsLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    queryOptions: {
      first: 4,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  })

  const isLoading = daoLoading || proposalsLoading

  const recentProposals = useMemo(() => {
    if (!proposals) return []
    return proposals.slice(0, 4)
  }, [proposals])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Governance</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!recentProposals || recentProposals.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Governance</h2>
          <Link href="/governance">
            <Button variant="outline" size="sm">
              View all proposals
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        <Card className="stat-card-gradient p-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading proposals..." : "No proposals found. Create a proposal to get started."}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Governance</h2>
        <Link href="/governance">
          <Button variant="outline" size="sm">
            View all proposals
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {recentProposals.map((proposal) => {
          const status = getStatus(proposal)
          const timeRemaining = formatTimeRemaining(proposal.votingEnds)
          const yesVotes = Number(proposal.yesVotes || 0)
          const noVotes = Number(proposal.noVotes || 0)
          const totalVotes = yesVotes + noVotes
          const quorum = Number(proposal.dao?.totalShares || 0)
          const quorumPercent = Number(proposal.dao?.quorumPercent || 0)
          const requiredQuorum = Math.ceil((quorum * quorumPercent) / 100)
          const quorumProgress = requiredQuorum > 0 ? (totalVotes / requiredQuorum) * 100 : 0

          return (
            <Link key={proposal.id} href={`/governance/proposal/${(proposal as any).proposalId || proposal.id.split('-').pop()}`}>
              <Card className="stat-card-gradient p-6 dao-card-hover cursor-pointer">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">#{(proposal as any).proposalId || proposal.id.split('-').pop() || proposal.id}</span>
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(status)}`}>
                          {status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {proposal.title || `Proposal ${proposal.proposalId}`}
                      </h3>
                      {proposal.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{proposal.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {proposal.proposedBy && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">
                              {proposal.proposedBy.slice(0, 6)}...{proposal.proposedBy.slice(-4)}
                            </span>
                          </div>
                        )}
                        {status === "Active" && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{timeRemaining} remaining</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  {status === "Active" && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Voting Progress</span>
                        <span className="text-foreground">
                          {totalVotes} / {requiredQuorum} votes
                        </span>
                      </div>

                      <Progress value={Math.min(quorumProgress, 100)} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-green-400">For</span>
                            <span className="text-foreground">{yesVotes}</span>
                          </div>
                          <Progress
                            value={totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0}
                            className="h-1"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-red-400">Against</span>
                            <span className="text-foreground">{noVotes}</span>
                          </div>
                          <Progress
                            value={totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
