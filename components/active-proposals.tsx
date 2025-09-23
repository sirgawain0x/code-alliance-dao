import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, User, MessageSquare, Vote } from "lucide-react"

const activeProposals = [
  {
    id: "PROP-007",
    title: "Establish AI Research SubDAO",
    description:
      "Create a specialized SubDAO focused on artificial intelligence research and development projects with initial funding of $500K.",
    author: "alice.eth",
    category: "SubDAO Creation",
    status: "active",
    timeLeft: "3 days, 14 hours",
    votingPower: {
      for: 1247,
      against: 234,
      abstain: 89,
      total: 1570,
      quorum: 2000,
    },
    comments: 45,
    votingType: "Token Voting",
    yourVote: null,
  },
  {
    id: "PROP-008",
    title: "Treasury Diversification Strategy",
    description:
      "Implement a diversified treasury strategy to reduce risk and increase long-term sustainability of the DAO ecosystem.",
    author: "treasury.dao",
    category: "Treasury",
    status: "active",
    timeLeft: "1 day, 8 hours",
    votingPower: {
      for: 892,
      against: 445,
      abstain: 123,
      total: 1460,
      quorum: 2000,
    },
    comments: 67,
    votingType: "Quadratic Voting",
    yourVote: "for",
  },
  {
    id: "PROP-009",
    title: "Community Mentorship Program",
    description:
      "Launch a comprehensive mentorship program connecting experienced members with newcomers to improve onboarding.",
    author: "community.lead",
    category: "Community",
    status: "active",
    timeLeft: "5 days, 2 hours",
    votingPower: {
      for: 1567,
      against: 89,
      abstain: 234,
      total: 1890,
      quorum: 2000,
    },
    comments: 23,
    votingType: "Reputation Voting",
    yourVote: null,
  },
]

export function ActiveProposals() {
  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0
  }

  const getQuorumPercentage = (total: number, quorum: number) => {
    return (total / quorum) * 100
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Proposals</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button size="sm">Create Proposal</Button>
          </div>
        </div>

        <div className="space-y-6">
          {activeProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border border-border rounded-lg p-6 space-y-4 dao-card-hover cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{proposal.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {proposal.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {proposal.votingType}
                    </Badge>
                    {proposal.yourVote && (
                      <Badge variant="default" className="text-xs">
                        You voted: {proposal.yourVote}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground text-lg">{proposal.title}</h4>
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{proposal.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{proposal.timeLeft} remaining</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{proposal.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Voting Progress</span>
                  <span className="text-foreground">
                    {proposal.votingPower.total} / {proposal.votingPower.quorum} votes
                  </span>
                </div>

                <Progress
                  value={getQuorumPercentage(proposal.votingPower.total, proposal.votingPower.quorum)}
                  className="h-2"
                />

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400">For</span>
                      <span className="text-foreground">{proposal.votingPower.for}</span>
                    </div>
                    <Progress
                      value={getVotePercentage(proposal.votingPower.for, proposal.votingPower.total)}
                      className="h-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400">Against</span>
                      <span className="text-foreground">{proposal.votingPower.against}</span>
                    </div>
                    <Progress
                      value={getVotePercentage(proposal.votingPower.against, proposal.votingPower.total)}
                      className="h-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Abstain</span>
                      <span className="text-foreground">{proposal.votingPower.abstain}</span>
                    </div>
                    <Progress
                      value={getVotePercentage(proposal.votingPower.abstain, proposal.votingPower.total)}
                      className="h-1"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>

                {!proposal.yourVote ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400/20 hover:bg-red-400/10 bg-transparent"
                    >
                      Vote Against
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-400 border-gray-400/20 hover:bg-gray-400/10 bg-transparent"
                    >
                      Abstain
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Vote className="h-4 w-4 mr-2" />
                      Vote For
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Vote cast</span>
                    <Button variant="outline" size="sm">
                      Change Vote
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
