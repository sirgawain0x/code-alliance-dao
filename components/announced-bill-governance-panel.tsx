"use client"

import { formatDistanceToNow } from "date-fns"
import { Clock, Gavel, Loader2, Plus, User, Wallet } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ProposalState } from "@buildeross/types"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"

import { NounsCreateProposalForm } from "@/components/nouns-create-proposal-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNounsBuilderActions } from "@/hooks/useNounsBuilderActions"
import { useNounsBuilderAuction } from "@/hooks/useNounsBuilderAuction"
import { useNounsBuilderMembership } from "@/hooks/useNounsBuilderMembership"
import { useNounsBuilderProposals } from "@/hooks/useNounsBuilderProposals"
import { useNounsBuilderTreasury } from "@/hooks/useNounsBuilderTreasury"
import { ANNOUNCED_BILL_PUBLIC_SITE } from "@/lib/announced-bill-config"
import { sanitizePublicCopy } from "@/lib/nouns-proposal-copy"

function proposalStateLabel(state: number): string {
  switch (state) {
    case ProposalState.Pending:
      return "Pending"
    case ProposalState.Active:
      return "Active"
    case ProposalState.Canceled:
      return "Cancelled"
    case ProposalState.Defeated:
      return "Defeated"
    case ProposalState.Succeeded:
      return "Succeeded"
    case ProposalState.Queued:
      return "Queued"
    case ProposalState.Expired:
      return "Expired"
    case ProposalState.Executed:
      return "Executed"
    case ProposalState.Vetoed:
      return "Vetoed"
    default:
      return "Unknown"
  }
}

function proposalStateClass(state: number): string {
  switch (state) {
    case ProposalState.Active:
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case ProposalState.Succeeded:
    case ProposalState.Queued:
    case ProposalState.Executed:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case ProposalState.Defeated:
    case ProposalState.Vetoed:
    case ProposalState.Canceled:
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

function formatTimeRemaining(endTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTimestamp - now
  if (diff <= 0) return "Ended"
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

export function AnnouncedBillGovernancePanel() {
  const [showCreate, setShowCreate] = useState(false)
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  const { proposals, isLoading: proposalsLoading } = useNounsBuilderProposals()
  const { auction, isLoading: auctionLoading } = useNounsBuilderAuction()
  const { treasury, isLoading: treasuryLoading } = useNounsBuilderTreasury()
  const { membership, isLoading: membershipLoading } = useNounsBuilderMembership()
  const { queue, execute, isPending, state: actionState } = useNounsBuilderActions()

  const isLoading = proposalsLoading || auctionLoading || treasuryLoading || membershipLoading

  const sortedProposals = useMemo(
    () => [...proposals].sort((a, b) => b.proposalNumber - a.proposalNumber),
    [proposals]
  )

  function handleCreateClick() {
    if (!isConnected) {
      open()
      return
    }
    setShowCreate(true)
  }

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">Announced Bill</h1>
            <Badge variant="outline">Optimism</Badge>
            <Badge variant="secondary">Creative Kidz</Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-3xl">
            {sanitizePublicCopy(
              "Nonprofit DAO stewarding Creative Kidz Nouns auction proceeds for underserved children's digital art tools."
            )}
          </p>
          <a
            href={ANNOUNCED_BILL_PUBLIC_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            kidz.creativeplatform.xyz
          </a>
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          {isConnected ? "Create Proposal" : "Connect to Propose"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Nouns</p>
              <p className="text-2xl font-bold">{membership?.nounCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">{membership?.voteCount ?? 0} votes</p>
            </div>
            <User className="h-7 w-7 text-blue-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="text-2xl font-bold">
                {Number(treasury?.ethBalance ?? 0).toFixed(4)} ETH
              </p>
            </div>
            <Wallet className="h-7 w-7 text-green-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-5 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Auction (read-only)</p>
              <p className="text-lg font-semibold">
                Creative Kidz #{auction?.tokenId ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                High bid {Number(auction?.highestBidEth ?? 0).toFixed(4)} ETH · Reserve{" "}
                {Number(auction?.reserveEth ?? 0).toFixed(3)} ETH
              </p>
              {auction?.endTime ? (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {auction.settled
                    ? "Settled"
                    : `${formatTimeRemaining(auction.endTime)} remaining`}
                </p>
              ) : null}
            </div>
            <Gavel className="h-7 w-7 text-purple-400 shrink-0" />
          </div>
        </Card>
      </div>

      {showCreate ? <NounsCreateProposalForm onClose={() => setShowCreate(false)} /> : null}

      <Card className="stat-card-gradient p-6">
        <h3 className="text-lg font-semibold mb-4">Proposals</h3>
        {sortedProposals.length === 0 ? (
          <p className="text-muted-foreground text-sm">No proposals found yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedProposals.map((proposal) => {
              const totalVotes =
                proposal.forVotes + proposal.againstVotes + proposal.abstainVotes
              const quorumProgress =
                proposal.quorumVotes > 0 ? (proposal.forVotes / proposal.quorumVotes) * 100 : 0
              const canQueue = proposal.state === ProposalState.Succeeded
              const canExecute = proposal.state === ProposalState.Queued

              return (
                <div
                  key={proposal.proposalId}
                  className="border border-border/50 rounded-lg p-5 space-y-3 bg-card/40"
                >
                  <Link href={`/governance/proposal/${proposal.proposalId}`} className="block space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        #{proposal.proposalNumber}
                      </span>
                      <Badge className={`text-xs ${proposalStateClass(proposal.state)}`}>
                        {proposalStateLabel(proposal.state)}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg">{proposal.title}</h4>
                    {proposal.body ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">{proposal.body}</p>
                    ) : null}
                  </Link>

                  {proposal.state === ProposalState.Active ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Quorum progress</span>
                        <span>
                          {proposal.forVotes} / {proposal.quorumVotes} for votes
                        </span>
                      </div>
                      <Progress value={Math.min(quorumProgress, 100)} className="h-1.5" />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <span className="text-green-400">For {proposal.forVotes}</span>
                        <span className="text-red-400">Against {proposal.againstVotes}</span>
                        <span className="text-muted-foreground">Abstain {proposal.abstainVotes}</span>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {canQueue ? (
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() => queue({ proposalId: proposal.proposalId })}
                      >
                        {isPending && actionState.lastAction === "queue" ? (
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : null}
                        Queue
                      </Button>
                    ) : null}
                    {canExecute ? (
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          execute({
                            targets: proposal.targets,
                            values: proposal.values.map((value) => BigInt(value)),
                            calldatas: proposal.calldatas,
                            descriptionHash: proposal.descriptionHash,
                            proposer: proposal.proposer,
                          })
                        }
                      >
                        {isPending && actionState.lastAction === "execute" ? (
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : null}
                        Execute
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/governance/proposal/${proposal.proposalId}`}>View</Link>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Proposed {formatDistanceToNow(new Date(proposal.timeCreated * 1000), { addSuffix: true })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
