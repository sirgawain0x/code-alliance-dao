"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, User, Vote, Plus, Filter } from "lucide-react"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useDao } from "@/hooks/useDao"
import Link from "next/link"
import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"

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

function getStatus(proposal: { processed: boolean; cancelled: boolean; votingEnds: string; passed: boolean; actionFailed: boolean }): string {
  if (proposal.cancelled) return "Cancelled"
  if (proposal.processed) return "Processed"
  if (proposal.actionFailed) return "Failed"

  const now = Math.floor(Date.now() / 1000)
  if (Number(proposal.votingEnds) > now) return "Active"

  // If ended but not processed/cancelled/failed, check passed status
  return proposal.passed ? "Passed" : "Failed"
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "Processed":
    case "Passed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "Failed":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20"
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

  const ProposalList = ({ items }: { items: any[] }) => {
    if (items.length === 0) {
      return (
        <div className="text-center p-12 border border-dashed border-border/50 rounded-lg">
          <p className="text-muted-foreground">No proposals found in this category.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {items.map((proposal) => {
          const status = getStatus(proposal)
          const timeRemaining = formatTimeRemaining(proposal.votingEnds)
          const yesVotes = Number(proposal.yesVotes || 0)
          const noVotes = Number(proposal.noVotes || 0)
          const totalVotes = yesVotes + noVotes
          const quorum = Number(dao?.totalShares || 0)
          const quorumPercent = Number(dao?.quorumPercent || 0)
          const requiredQuorum = Math.ceil((quorum * quorumPercent) / 100)
          const quorumProgress = requiredQuorum > 0 ? (totalVotes / requiredQuorum) * 100 : 0

          return (
            <Link key={proposal.id} href={`/governance/proposal/${(proposal as any).proposalId || proposal.id.split('-').pop()}`}>
              <div className="border border-border/50 rounded-lg p-6 space-y-4 dao-card-hover cursor-pointer bg-card/50 hover:bg-card hover:border-border transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">#{(proposal as any).proposalId || proposal.id.split('-').pop() || proposal.id}</span>
                      <Badge variant="secondary" className={`text-xs ${getStatusColor(status)}`}>
                        {status}
                      </Badge>
                      {proposal.proposalType && (
                        <Badge variant="outline" className="text-xs">
                          {proposal.proposalType}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground text-lg line-clamp-2 leading-tight">
                      {proposal.title || `Proposal ${proposal.proposalId}`}
                    </h4>
                    {proposal.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{proposal.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
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
                      <div className="flex items-center space-x-1">
                        <span>{formatDistanceToNow(new Date(Number(proposal.createdAt) * 1000), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voting Progress - Only show for Active or recently ended */}
                {status === "Active" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quorum Progress</span>
                      <span className="text-foreground text-xs font-mono">
                        {totalVotes} / {requiredQuorum} needed
                      </span>
                    </div>

                    <Progress value={Math.min(quorumProgress, 100)} className="h-1.5" />

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-medium">For</span>
                          <span className="text-foreground">{yesVotes}</span>
                        </div>
                        <Progress
                          value={getVotePercentage(yesVotes, totalVotes)}
                          className="h-1 bg-green-950/20 [&>div]:bg-green-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 font-medium">Against</span>
                          <span className="text-foreground">{noVotes}</span>
                        </div>
                        <Progress
                          value={getVotePercentage(noVotes, totalVotes)}
                          className="h-1 bg-red-950/20 [&>div]:bg-red-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  const categorizedProposals = useMemo(() => {
    if (!proposals) return { all: [], active: [], passed: [], failed: [] }

    return {
      all: proposals,
      active: proposals.filter(p => getStatus(p as any) === "Active"),
      passed: proposals.filter(p => ["Passed", "Processed"].includes(getStatus(p as any))),
      failed: proposals.filter(p => ["Failed", "Cancelled"].includes(getStatus(p as any)))
    }
  }, [proposals])

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Proposals</h3>
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

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Governance Proposals</h3>
          <Button size="sm" className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
            <Plus className="h-4 w-4" />
            Create Proposal
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex gap-2 bg-transparent p-0 mb-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="passed"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20"
            >
              Passed
            </TabsTrigger>
            <TabsTrigger
              value="failed"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20"
            >
              Failed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ProposalList items={categorizedProposals.all} />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <ProposalList items={categorizedProposals.active} />
          </TabsContent>
          <TabsContent value="passed" className="mt-0">
            <ProposalList items={categorizedProposals.passed} />
          </TabsContent>
          <TabsContent value="failed" className="mt-0">
            <ProposalList items={categorizedProposals.failed} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
