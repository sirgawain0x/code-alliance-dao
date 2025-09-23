import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"

const votingHistory = [
  {
    id: "PROP-006",
    title: "Partnership with TechCorp Accelerator",
    status: "passed",
    finalVotes: { for: 1567, against: 234, abstain: 89 },
    yourVote: "for",
    endDate: "2 days ago",
    category: "Partnership",
    author: "partnerships.dao",
  },
  {
    id: "PROP-005",
    title: "Update Governance Token Distribution",
    status: "failed",
    finalVotes: { for: 445, against: 892, abstain: 123 },
    yourVote: "against",
    endDate: "1 week ago",
    category: "Governance",
    author: "governance.lead",
  },
  {
    id: "PROP-004",
    title: "Increase SubDAO Creation Budget",
    status: "passed",
    finalVotes: { for: 1234, against: 156, abstain: 67 },
    yourVote: "for",
    endDate: "2 weeks ago",
    category: "Treasury",
    author: "treasury.dao",
  },
  {
    id: "PROP-003",
    title: "Community Grant Program Expansion",
    status: "passed",
    finalVotes: { for: 987, against: 234, abstain: 123 },
    yourVote: "abstain",
    endDate: "3 weeks ago",
    category: "Community",
    author: "community.fund",
  },
]

export function VotingHistory() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Voting History</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {votingHistory.map((proposal) => (
            <div key={proposal.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{proposal.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {proposal.category}
                    </Badge>
                    <Badge variant={proposal.status === "passed" ? "default" : "destructive"} className="text-xs">
                      {proposal.status === "passed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {proposal.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                      {proposal.status}
                    </Badge>
                    <Badge
                      variant={
                        proposal.yourVote === "for"
                          ? "default"
                          : proposal.yourVote === "against"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      You: {proposal.yourVote}
                    </Badge>
                  </div>

                  <h4 className="font-medium text-foreground">{proposal.title}</h4>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{proposal.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Ended {proposal.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Vote Results */}
              <div className="flex items-center space-x-6 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-muted-foreground">For: {proposal.finalVotes.for}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-muted-foreground">Against: {proposal.finalVotes.against}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-muted-foreground">Abstain: {proposal.finalVotes.abstain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
