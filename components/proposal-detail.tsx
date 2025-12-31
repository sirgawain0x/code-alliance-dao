"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Clock, User, MessageSquare, Vote } from "lucide-react"

interface ProposalDetailProps {
  proposalId: string
  initialMetadata?: any
}

import { useProposal } from "@/hooks/useProposal"
import { useDao } from "@/hooks/useDao"
import { useMember } from "@/hooks/useMember"

import { useAppKitAccount } from "@reown/appkit/react"
import { Skeleton } from "./ui/skeleton"

export function ProposalDetail({ proposalId, initialMetadata }: ProposalDetailProps) {
  const { dao } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  });

  const { proposal, isLoading } = useProposal({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    proposalid: proposalId
  });

  const { address } = useAppKitAccount();

  const { member } = useMember({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    memberaddress: address?.toLowerCase()
  });

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0
  }

  const getQuorumPercentage = (total: number, quorum: number) => {
    return quorum > 0 ? (total / quorum) * 100 : 0
  }

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

  const yesVotes = Number(proposal.yesVotes || 0)
  const noVotes = Number(proposal.noVotes || 0)
  // Assuming abstain is not strictly tracked in this subgraph schema or defaults to 0
  const abstainVotes = 0
  const totalVotes = yesVotes + noVotes + abstainVotes
  const quorum = Number(proposal.dao?.totalShares || 0)
  const quorumPercent = Number(proposal.dao?.quorumPercent || 0)
  const requiredQuorum = Math.ceil((quorum * quorumPercent) / 100)

  // Use metadata description if available, otherwise fall back to on-chain description/details
  const description = initialMetadata?.full_description || proposal.description || proposal.details || "No description provided"

  // Calculate relative time strings (simplified)
  const now = Math.floor(Date.now() / 1000)
  const votingEnds = Number(proposal.votingEnds)
  const timeLeftSeconds = votingEnds - now
  const timeLeft = timeLeftSeconds > 0
    ? `${Math.floor(timeLeftSeconds / 86400)}d ${Math.floor((timeLeftSeconds % 86400) / 3600)}h`
    : "Ended"

  const status = proposal.cancelled ? "Cancelled" : (proposal.processed ? "Processed" : (timeLeftSeconds > 0 ? "Active" : "Ended"))

  // Check if user has voted
  const userVote = proposal.votes?.find(vote => vote.member.memberAddress.toLowerCase() === address?.toLowerCase());

  const proposalData = {
    id: proposalId,
    title: proposal.title,
    description: description,
    fullDescription: description, // Assuming full description is same for now
    author: proposal.proposedBy,
    category: proposal.proposalType,
    status: status,
    created: new Date(Number(proposal.createdAt) * 1000).toLocaleDateString(),
    timeLeft: timeLeft,
    votingPower: {
      for: yesVotes,
      against: noVotes,
      abstain: abstainVotes,
      total: totalVotes,
      quorum: requiredQuorum,
    },
    comments: 0, // No comments in subgraph
    votingType: "Token Voting",
    yourVote: userVote ? (userVote.approved ? "For" : "Against") : null,
    yourVotingPower: member?.shares ? Number(member.shares) : 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{proposalData.id}</span>
            <Badge variant="outline">{proposalData.category}</Badge>
            <Badge variant="secondary">{proposalData.votingType}</Badge>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{proposalData.status}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{proposalData.title}</h1>
          <p className="text-muted-foreground">{proposalData.description}</p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{proposalData.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Created {proposalData.created}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{proposalData.comments} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Section */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Cast Your Vote</h3>
            <div className="text-sm text-muted-foreground">
              Your voting power: {proposalData.yourVotingPower} vCRTV tokens
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voting Progress */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Voting Progress</span>
                <span className="text-foreground">
                  {proposalData.votingPower.total} / {proposalData.votingPower.quorum} votes
                </span>
              </div>

              <Progress
                value={getQuorumPercentage(proposalData.votingPower.total, proposalData.votingPower.quorum)}
                className="h-3"
              />

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400">For</span>
                    <span className="text-foreground">{proposalData.votingPower.for}</span>
                  </div>
                  <Progress
                    value={getVotePercentage(proposalData.votingPower.for, proposalData.votingPower.total)}
                    className="h-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {getVotePercentage(proposalData.votingPower.for, proposalData.votingPower.total).toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">Against</span>
                    <span className="text-foreground">{proposalData.votingPower.against}</span>
                  </div>
                  <Progress
                    value={getVotePercentage(proposalData.votingPower.against, proposalData.votingPower.total)}
                    className="h-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {getVotePercentage(proposalData.votingPower.against, proposalData.votingPower.total).toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Abstain</span>
                    <span className="text-foreground">{proposalData.votingPower.abstain}</span>
                  </div>
                  <Progress
                    value={getVotePercentage(proposalData.votingPower.abstain, proposalData.votingPower.total)}
                    className="h-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {getVotePercentage(proposalData.votingPower.abstain, proposalData.votingPower.total).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">Time remaining: {proposalData.timeLeft}</div>
            </div>

            {/* Voting Actions */}
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {proposalData.yourVote ? (
                  <span className="text-foreground font-semibold">You voted: {proposalData.yourVote}</span>
                ) : (
                  "Choose your vote and optionally add a comment explaining your decision."
                )}
              </div>

              {!proposalData.yourVote && (
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Vote className="h-4 w-4 mr-2" />
                    Vote For
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10 bg-transparent"
                  >
                    Vote Against
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-gray-400 border-gray-400/20 hover:bg-gray-400/10 bg-transparent"
                  >
                    Abstain
                  </Button>
                </div>
              )}

              <Textarea
                placeholder="Add a comment explaining your vote (optional)"
                className="bg-muted border-border"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Proposal Details</TabsTrigger>
          <TabsTrigger value="discussion">Discussion ({proposalData.comments})</TabsTrigger>
          <TabsTrigger value="votes">Vote Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground">{proposalData.fullDescription}</div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="discussion" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Discussion</h3>
                <Button size="sm" disabled>Add Comment</Button>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">Comments are not yet supported on-chain.</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Vote Breakdown</h3>
              <p className="text-muted-foreground">
                Detailed voting information and voter list will be displayed here.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
