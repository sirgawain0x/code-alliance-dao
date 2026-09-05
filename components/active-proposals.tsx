"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { formatUnits } from "ethers"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { Clock, ExternalLink, Loader2, MoreHorizontal, Plus, User } from "lucide-react"

import { CreateProposalForm } from "@/components/create-proposal-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBaalActions } from "@/hooks/useBaalActions"
import { useDao } from "@/hooks/useDao"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"
import { getDaoHausAdminProposalUrl, getDaoHausAdminProposalsUrl } from "@/lib/dao-haus-links"

function formatShareVotes(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  try {
    return Number(formatUnits(String(value), 18))
  } catch {
    return Number(value) || 0
  }
}

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

function getStatus(proposal: {
  processed: boolean
  cancelled: boolean
  votingEnds: string
  graceEnds?: string
  passed: boolean
  actionFailed: boolean
  sponsored: boolean
}): string {
  if (proposal.cancelled) return "Cancelled"
  if (proposal.processed) return "Processed"
  if (proposal.actionFailed) return "Failed"
  if (!proposal.sponsored) return "Needs Sponsor"

  const now = Math.floor(Date.now() / 1000)
  if (Number(proposal.votingEnds) > now) return "Active"

  const graceEnds = Number(proposal.graceEnds || 0)
  if (graceEnds === 0 || now > graceEnds) return proposal.passed ? "Ready" : "Failed"

  return proposal.passed ? "Passed" : "Failed"
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "Needs Sponsor":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "Ready":
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

function getProposalNumber(proposal: { proposalId?: string; id: string }): string {
  return String(proposal.proposalId || proposal.id.split("-").pop() || proposal.id)
}

function getCreateProposalHelper({
  isConnected,
  canCreateProposal,
}: {
  isConnected: boolean
  canCreateProposal: boolean
}): string | null {
  if (!isConnected) return "Connect a wallet to create proposals."
  if (!canCreateProposal) {
    return "Proposals require vCRTV voting shares (or admin). Acquire shares to submit."
  }
  return null
}

export function ActiveProposals() {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  const [showCreate, setShowCreate] = useState(false)
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  const { primaryProfile, isLoading: isProfileLoading } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress,
  })
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: daoAddress,
  })
  const { proposals, isLoading: proposalsLoading } = useDaoProposals({
    chainid: "8453",
    daoid: daoAddress,
    queryOptions: {
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  })
  const { sponsor, processProposal, isPending, state } = useBaalActions({
    daoid: daoAddress,
  })

  const isLoading = daoLoading || proposalsLoading
  const canCreateProposal = Boolean(primaryProfile?.capabilities.canCreateProposal)
  const canVote = Boolean(primaryProfile?.capabilities.canVote)
  const createProposalHelper = isProfileLoading
    ? null
    : getCreateProposalHelper({ isConnected, canCreateProposal })

  function handleCreateProposalClick() {
    if (!isConnected) {
      open()
      return
    }
    setShowCreate(true)
  }

  const getVotePercentage = (votes: number, total: number) =>
    total > 0 ? (votes / total) * 100 : 0

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
          const yesVotes = formatShareVotes(proposal.yesBalance || proposal.yesVotes)
          const noVotes = formatShareVotes(proposal.noBalance || proposal.noVotes)
          const totalVotes = yesVotes + noVotes
          const quorum = formatShareVotes(dao?.totalShares)
          const quorumPercent = Number(dao?.quorumPercent || 0)
          const requiredQuorum = Math.ceil((quorum * quorumPercent) / 100)
          const quorumProgress = requiredQuorum > 0 ? (totalVotes / requiredQuorum) * 100 : 0
          const proposalNumber = getProposalNumber(proposal)
          const adminProposalUrl = getDaoHausAdminProposalUrl(proposalNumber)

          return (
            <div
              key={proposal.id}
              className="border border-border/50 rounded-lg p-6 space-y-4 dao-card-hover bg-card/50 hover:bg-card hover:border-border transition-all duration-200"
            >
              <Link href={`/governance/proposal/${proposalNumber}`}>
                <div className="space-y-4 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{proposalNumber}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getStatusColor(status)}`}
                        >
                          {status}
                        </Badge>
                        {proposal.proposalType && (
                          <Badge variant="outline" className="text-xs">
                            {proposal.proposalType}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground text-lg line-clamp-2 leading-tight">
                        {proposal.title || `Proposal ${proposalNumber}`}
                      </h4>
                      {proposal.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {proposal.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        {proposal.proposedBy && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">
                              {proposal.proposedBy.slice(0, 6)}...
                              {proposal.proposedBy.slice(-4)}
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
                          <span>
                            {formatDistanceToNow(
                              new Date(Number(proposal.createdAt) * 1000),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {status === "Active" && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quorum Progress</span>
                        <span className="text-foreground text-xs font-mono">
                          {totalVotes.toLocaleString()} / {requiredQuorum.toLocaleString()}{" "}
                          needed
                        </span>
                      </div>

                      <Progress value={Math.min(quorumProgress, 100)} className="h-1.5" />

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 font-medium">For</span>
                            <span className="text-foreground">{yesVotes.toLocaleString()}</span>
                          </div>
                          <Progress
                            value={getVotePercentage(yesVotes, totalVotes)}
                            className="h-1 bg-green-950/20 [&>div]:bg-green-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-red-400 font-medium">Against</span>
                            <span className="text-foreground">{noVotes.toLocaleString()}</span>
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

              <div className="flex flex-wrap gap-2 pt-1">
                {status === "Needs Sponsor" && (
                  <Button
                    size="sm"
                    disabled={!canVote || isPending}
                    onClick={() => sponsor({ proposalId: proposalNumber })}
                  >
                    {isPending && state.lastAction === "sponsor" ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    ) : null}
                    Sponsor
                  </Button>
                )}
                {status === "Ready" && (
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      processProposal({
                        proposalId: proposalNumber,
                        proposalData: proposal.proposalData || "0x",
                      })
                    }
                  >
                    {isPending && state.lastAction === "process" ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    ) : null}
                    Process
                  </Button>
                )}
                {adminProposalUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={adminProposalUrl} target="_blank" rel="noopener noreferrer">
                      View on DAOhaus
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const categorizedProposals = useMemo(() => {
    if (!proposals) return { all: [], active: [], passed: [], failed: [] }

    return {
      all: proposals,
      active: proposals.filter((p) => ["Active", "Needs Sponsor"].includes(getStatus(p as any))),
      passed: proposals.filter((p) =>
        ["Passed", "Processed", "Ready"].includes(getStatus(p as any))
      ),
      failed: proposals.filter((p) =>
        ["Failed", "Cancelled"].includes(getStatus(p as any))
      ),
    }
  }, [proposals])

  const adminProposalsUrl = getDaoHausAdminProposalsUrl()

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
    <div className="space-y-6">
      {showCreate && (
        <CreateProposalForm onClose={() => setShowCreate(false)} />
      )}

      <Card className="stat-card-gradient p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Governance Proposals</h3>
              {createProposalHelper && (
                <p className="text-sm text-muted-foreground">{createProposalHelper}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="default" className="gap-2" onClick={handleCreateProposalClick}>
                <Plus className="h-4 w-4" />
                {!isConnected ? "Connect to Create" : "Create Proposal"}
              </Button>
              {adminProposalsUrl && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                      Advanced
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={adminProposalsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in DAOhaus
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
    </div>
  )
}
