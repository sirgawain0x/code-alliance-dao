import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Clock, Vote } from "lucide-react"

const treasuryProposals = [
  {
    id: "TPROP-001",
    title: "Diversify into Real Estate Investment Trusts",
    description: "Allocate 5% of treasury to REITs for stable income generation",
    amount: "$120,000",
    requestedBy: "treasury.committee",
    status: "active",
    votes: { for: 567, against: 123, abstain: 45 },
    timeLeft: "4 days",
    category: "Investment",
  },
  {
    id: "TPROP-002",
    title: "Emergency Fund Increase",
    description: "Increase emergency reserves from 15% to 20% of total treasury",
    amount: "$120,000",
    requestedBy: "risk.management",
    status: "active",
    votes: { for: 445, against: 89, abstain: 67 },
    timeLeft: "2 days",
    category: "Risk Management",
  },
  {
    id: "TPROP-003",
    title: "SubDAO Funding Allocation Q2",
    description: "Quarterly funding allocation for active SubDAOs based on performance",
    amount: "$300,000",
    requestedBy: "parent.dao",
    status: "passed",
    votes: { for: 892, against: 156, abstain: 78 },
    timeLeft: "Completed",
    category: "Funding",
  },
]

export function TreasuryProposals() {
  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0
  }

  const getTotalVotes = (votes: { for: number; against: number; abstain: number }) => {
    return votes.for + votes.against + votes.abstain
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Treasury Proposals</h3>
          <Button size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">New Proposal</Button>
        </div>

        <div className="space-y-4">
          {treasuryProposals.map((proposal) => {
            const totalVotes = getTotalVotes(proposal.votes)
            return (
              <div key={proposal.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{proposal.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {proposal.category}
                      </Badge>
                      <Badge
                        className={
                          proposal.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : proposal.status === "passed"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground">{proposal.title}</h4>
                    <p className="text-sm text-muted-foreground">{proposal.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{proposal.amount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{proposal.timeLeft}</span>
                      </div>
                      <span>by {proposal.requestedBy}</span>
                    </div>
                  </div>
                </div>

                {proposal.status === "active" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-green-400 font-medium">{proposal.votes.for}</div>
                        <div className="text-muted-foreground">For</div>
                        <Progress value={getVotePercentage(proposal.votes.for, totalVotes)} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-medium">{proposal.votes.against}</div>
                        <div className="text-muted-foreground">Against</div>
                        <Progress value={getVotePercentage(proposal.votes.against, totalVotes)} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 font-medium">{proposal.votes.abstain}</div>
                        <div className="text-muted-foreground">Abstain</div>
                        <Progress value={getVotePercentage(proposal.votes.abstain, totalVotes)} className="h-1 mt-1" />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <Vote className="h-3 w-3 mr-1" />
                        Vote
                      </Button>
                    </div>
                  </div>
                )}

                {proposal.status === "passed" && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400">✓ Proposal passed and executed</span>
                    <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
                      View Results
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
