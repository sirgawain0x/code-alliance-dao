"use client"

import { useState } from "react"
import Link from "next/link"
import { formatUnits } from "ethers"
import { useAppKitAccount } from "@reown/appkit/react"
import { Clock, ExternalLink, Loader2, MessageSquare, User, Vote } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBaalActions } from "@/hooks/useBaalActions"
import { useDao } from "@/hooks/useDao"
import { useMember } from "@/hooks/useMember"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"
import { useProposal } from "@/hooks/useProposal"
import { getDaoHausAdminProposalUrl } from "@/lib/dao-haus-links"

interface ProposalDetailProps {
  proposalId: string
  initialMetadata?: {
    full_description?: string
  }
}

function formatShareVotes(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  try {
    return Number(formatUnits(String(value), 18))
  } catch {
    return Number(value) || 0
  }
}

export function ProposalDetail({ proposalId, initialMetadata }: ProposalDetailProps) {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  const { dao } = useDao({
    chainid: "8453",
    daoid: daoAddress,
  })

  const { proposal, isLoading } = useProposal({
    chainid: "8453",
    daoid: daoAddress,
    proposalid: proposalId,
  })

  const { address } = useAppKitAccount()
  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress,
  })
  const { member } = useMember({
    chainid: "8453",
    daoid: daoAddress,
    memberaddress: address?.toLowerCase(),
  })
  const { vote, sponsor, processProposal, isPending, state, reset } = useBaalActions({
    daoid: daoAddress,
  })
  const [actionError, setActionError] = useState<string | null>(null)

  const getVotePercentage = (votes: number, total: number) =>
    total > 0 ? (votes / total) * 100 : 0

  const getQuorumPercentage = (total: number, quorum: number) =>
    quorum > 0 ? (total / quorum) * 100 : 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Proposal not found</div>
      </Card>
    )
  }

  const yesVotes = formatShareVotes(proposal.yesBalance || proposal.yesVotes)
  const noVotes = formatShareVotes(proposal.noBalance || proposal.noVotes)
  const totalVotes = yesVotes + noVotes
  const totalShares = formatShareVotes(proposal.dao?.totalShares || dao?.totalShares)
  const quorumPercent = Number(proposal.dao?.quorumPercent || dao?.quorumPercent || 0)
  const requiredQuorum = Math.ceil((totalShares * quorumPercent) / 100)

  const description =
    initialMetadata?.full_description ||
    proposal.description ||
    proposal.details ||
    "No description provided"

  const now = Math.floor(Date.now() / 1000)
  const votingEnds = Number(proposal.votingEnds)
  const graceEnds = Number(proposal.graceEnds || 0)
  const timeLeftSeconds = votingEnds - now
  const timeLeft =
    timeLeftSeconds > 0
      ? `${Math.floor(timeLeftSeconds / 86400)}d ${Math.floor((timeLeftSeconds % 86400) / 3600)}h`
      : "Ended"

  const isVotingOpen = timeLeftSeconds > 0 && proposal.sponsored && !proposal.processed
  const needsSponsor = !proposal.sponsored && !proposal.processed && !proposal.cancelled
  const canProcess =
    !proposal.processed &&
    !proposal.cancelled &&
    proposal.sponsored &&
    votingEnds > 0 &&
    now > votingEnds &&
    (graceEnds === 0 || now > graceEnds)

  const status = proposal.cancelled
    ? "Cancelled"
    : proposal.processed
      ? "Processed"
      : needsSponsor
        ? "Needs Sponsor"
        : timeLeftSeconds > 0
          ? "Active"
          : canProcess
            ? "Ready to Process"
            : "Ended"

  const userVote = proposal.votes?.find(
    (item) => item.member.memberAddress.toLowerCase() === address?.toLowerCase()
  )

  const display = {
    id: proposalId,
    title: proposal.title,
    description,
    fullDescription: description,
    author: proposal.proposedBy,
    category: proposal.proposalType || "Governance",
    status,
    created: new Date(Number(proposal.createdAt) * 1000).toLocaleDateString(),
    timeLeft,
    votingPower: {
      for: yesVotes,
      against: noVotes,
      total: totalVotes,
      quorum: requiredQuorum,
    },
    yourVote: userVote ? (userVote.approved ? "For" : "Against") : null,
    yourVotingPower: member?.shares ? Number(formatUnits(member.shares, 18)) : 0,
  }

  const adminProposalUrl = getDaoHausAdminProposalUrl(proposalId)
  const canVote = Boolean(primaryProfile?.capabilities.canVote)

  async function runAction(fn: () => Promise<string>) {
    setActionError(null)
    reset()
    try {
      await fn()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-muted-foreground">#{display.id}</span>
            <Badge variant="outline">{display.category}</Badge>
            <Badge variant="secondary">Token Voting</Badge>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              {display.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{display.title}</h1>
          <p className="text-muted-foreground">{display.description}</p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="font-mono">{display.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Created {display.created}</span>
            </div>
          </div>
        </div>
        {adminProposalUrl && (
          <Button variant="outline" asChild>
            <Link href={adminProposalUrl} target="_blank" rel="noopener noreferrer">
              View on DAOhaus
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Cast Your Vote</h3>
            <div className="text-sm text-muted-foreground">
              Your voting power: {display.yourVotingPower} vCRTV
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Voting Progress</span>
                <span className="text-foreground">
                  {display.votingPower.total.toLocaleString()} /{" "}
                  {display.votingPower.quorum.toLocaleString()} votes
                </span>
              </div>

              <Progress
                value={getQuorumPercentage(
                  display.votingPower.total,
                  display.votingPower.quorum
                )}
                className="h-3"
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400">For</span>
                    <span className="text-foreground">
                      {display.votingPower.for.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={getVotePercentage(
                      display.votingPower.for,
                      display.votingPower.total
                    )}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">Against</span>
                    <span className="text-foreground">
                      {display.votingPower.against.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={getVotePercentage(
                      display.votingPower.against,
                      display.votingPower.total
                    )}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Time remaining: {display.timeLeft}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Baal votes are binary (For / Against). There is no abstain.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {display.yourVote ? (
                  <span className="text-foreground font-semibold">
                    You voted: {display.yourVote}
                  </span>
                ) : isVotingOpen ? (
                  "Choose For or Against to submit an on-chain vote."
                ) : (
                  "Voting is closed for this proposal."
                )}
              </div>

              {!display.yourVote && isVotingOpen && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!canVote || isPending}
                    onClick={() =>
                      runAction(() => vote({ proposalId, approved: true }))
                    }
                  >
                    {isPending && state.lastAction === "vote-for" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Vote className="h-4 w-4 mr-2" />
                    )}
                    Vote For
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10 bg-transparent"
                    disabled={!canVote || isPending}
                    onClick={() =>
                      runAction(() => vote({ proposalId, approved: false }))
                    }
                  >
                    {isPending && state.lastAction === "vote-against" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Vote Against
                  </Button>
                </div>
              )}

              {needsSponsor && (
                <Button
                  className="w-full"
                  disabled={!canVote || isPending}
                  onClick={() => runAction(() => sponsor({ proposalId }))}
                >
                  {isPending && state.lastAction === "sponsor" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Sponsor Proposal
                </Button>
              )}

              {canProcess && (
                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={() =>
                    runAction(() =>
                      processProposal({
                        proposalId,
                        proposalData: proposal.proposalData || "0x",
                      })
                    )
                  }
                >
                  {isPending && state.lastAction === "process" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Process Proposal
                </Button>
              )}

              {!canVote && (
                <p className="text-xs text-muted-foreground">
                  Voting and sponsoring require voting shares in this DAO.
                </p>
              )}

              {(state.status === "error" || actionError) && (
                <Alert variant="destructive">
                  <AlertTitle>Action failed</AlertTitle>
                  <AlertDescription>{actionError || state.error}</AlertDescription>
                </Alert>
              )}

              {state.status === "success" && (
                <Alert>
                  <AlertTitle>Transaction confirmed</AlertTitle>
                  <AlertDescription>Tx {state.hash?.slice(0, 10)}…</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Proposal Details</TabsTrigger>
          <TabsTrigger value="votes">Vote Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="whitespace-pre-wrap text-foreground">{display.fullDescription}</div>
          </Card>
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Votes</h3>
              {proposal.votes?.length ? (
                <div className="space-y-3">
                  {proposal.votes.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm border-b border-border/40 pb-2"
                    >
                      <span className="font-mono text-muted-foreground">
                        {item.member.memberAddress.slice(0, 6)}…
                        {item.member.memberAddress.slice(-4)}
                      </span>
                      <span className={item.approved ? "text-green-400" : "text-red-400"}>
                        {item.approved ? "For" : "Against"} ·{" "}
                        {formatShareVotes(item.balance).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  No votes cast yet.
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
