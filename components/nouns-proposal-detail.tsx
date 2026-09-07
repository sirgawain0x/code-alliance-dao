"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ProposalState } from "@buildeross/types"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useNounsBuilderActions } from "@/hooks/useNounsBuilderActions"
import { useNounsBuilderMembership } from "@/hooks/useNounsBuilderMembership"
import { useNounsBuilderProposal } from "@/hooks/useNounsBuilderProposal"

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

interface NounsProposalDetailProps {
  proposalId: string
}

export function NounsProposalDetail({ proposalId }: NounsProposalDetailProps) {
  const { proposal, isLoading } = useNounsBuilderProposal({ proposalId })
  const { membership } = useNounsBuilderMembership()
  const { castVote, queue, execute, isPending, state } = useNounsBuilderActions()
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  const [reason, setReason] = useState("")

  if (isLoading) return <div className="animate-pulse h-48 bg-muted rounded-lg" />

  if (!proposal) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Proposal not found.</p>
      </Card>
    )
  }

  const canVote = proposal.state === ProposalState.Active && Boolean(membership?.voteCount)
  const quorumProgress =
    proposal.quorumVotes > 0 ? (proposal.forVotes / proposal.quorumVotes) * 100 : 0

  async function handleVote(support: 0 | 1 | 2) {
    if (!isConnected) {
      open()
      return
    }
    await castVote({ proposalId: proposal.proposalId, support, reason: reason.trim() || undefined })
  }

  return (
    <div className="space-y-6">
      <Link href="/governance" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to governance
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">#{proposal.proposalNumber}</span>
          <Badge variant="secondary">{proposalStateLabel(proposal.state)}</Badge>
          <Badge variant="outline">Announced Bill</Badge>
        </div>
        <h1 className="text-3xl font-bold">{proposal.title}</h1>
        <p className="text-sm text-muted-foreground">
          Proposed {formatDistanceToNow(new Date(proposal.timeCreated * 1000), { addSuffix: true })}
        </p>
      </div>

      <Card className="stat-card-gradient p-6 space-y-4">
        <h2 className="text-lg font-semibold">Description</h2>
        <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">{proposal.body}</div>
      </Card>

      <Card className="stat-card-gradient p-6 space-y-4">
        <h2 className="text-lg font-semibold">Votes</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-green-400">For</p>
            <p className="text-xl font-semibold">{proposal.forVotes}</p>
          </div>
          <div>
            <p className="text-red-400">Against</p>
            <p className="text-xl font-semibold">{proposal.againstVotes}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Abstain</p>
            <p className="text-xl font-semibold">{proposal.abstainVotes}</p>
          </div>
        </div>
        <Progress value={Math.min(quorumProgress, 100)} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Quorum: {proposal.forVotes} / {proposal.quorumVotes} for votes
        </p>
      </Card>

      {canVote ? (
        <Card className="stat-card-gradient p-6 space-y-4">
          <h2 className="text-lg font-semibold">Cast your vote</h2>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Optional reason"
            rows={3}
          />
          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button disabled={isPending} onClick={() => handleVote(1)}>
              {isPending && state.lastAction === "vote-for" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              For
            </Button>
            <Button variant="outline" disabled={isPending} onClick={() => handleVote(0)}>
              Against
            </Button>
            <Button variant="secondary" disabled={isPending} onClick={() => handleVote(2)}>
              Abstain
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {proposal.state === ProposalState.Succeeded ? (
          <Button disabled={isPending} onClick={() => queue({ proposalId: proposal.proposalId })}>
            Queue
          </Button>
        ) : null}
        {proposal.state === ProposalState.Queued ? (
          <Button
            disabled={isPending}
            onClick={() =>
              execute({
                targets: proposal.targets,
                values: proposal.values.map((value) => BigInt(value)),
                calldatas: proposal.calldatas,
                descriptionHash: proposal.descriptionHash,
              })
            }
          >
            Execute
          </Button>
        ) : null}
      </div>
    </div>
  )
}
