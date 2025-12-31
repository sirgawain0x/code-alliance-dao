"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, User, Vote } from "lucide-react"
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

export function ActiveProposals() {
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  // useDaoProposals requires explicit daoid
  const { proposals, isLoading: proposalsLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    queryOptions: {
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  })

  // Combine loading states
  const isLoading = daoLoading || proposalsLoading

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0
  }

  const getQuorumPercentage = (total: number, quorum: number) => {
    return quorum > 0 ? (total / quorum) * 100 : 0
  }

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">All Proposals</h3>
          </div>
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!proposals || proposals.length === 0) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">All Proposals</h3>
            <Button size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">Create Proposal</Button>
          </div>
          <p className="text-muted-foreground">
            {isLoading ? "Loading proposals..." : "No proposals found. Create a proposal to get started."}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">All Proposals</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
              Filter
            </Button>
            <Button size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">Create Proposal</Button>
          </div>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal) => {
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
                <div className="border border-border rounded-lg p-6 space-y-4 dao-card-hover cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">#{(proposal as any).proposalId || proposal.id.split('-').pop() || proposal.id}</span>
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(status)}`}>
                          {status}
                        </Badge>
                        {proposal.proposalType && (
                          <Badge variant="outline" className="text-xs">
                            {proposal.proposalType}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground text-lg">
                        {proposal.title || `Proposal ${proposal.proposalId}`}
                      </h4>
                      {proposal.description && (
                        <p className="text-sm text-muted-foreground">{proposal.description}</p>
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
                            value={getVotePercentage(yesVotes, totalVotes)}
                            className="h-1"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-red-400">Against</span>
                            <span className="text-foreground">{noVotes}</span>
                          </div>
                          <Progress
                            value={getVotePercentage(noVotes, totalVotes)}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all duration-200 hover:scale-105 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Navigation is handled by parent Link
                      }}
                    >
                      View Details
                    </Button>

                    {status === "Active" && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-red-400/20 hover:bg-red-400/10 bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Implement vote against logic
                          }}
                        >
                          Vote Against
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Implement vote for logic
                          }}
                        >
                          <Vote className="h-4 w-4 mr-2" />
                          Vote For
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
