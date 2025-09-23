import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Clock, CheckCircle, XCircle } from "lucide-react"

const recentVotes = [
  {
    id: "PROP-001",
    title: "Increase SubDAO Creation Budget",
    status: "passed",
    votes: { for: 892, against: 156, abstain: 23 },
    endTime: "2 days ago",
  },
  {
    id: "PROP-002",
    title: "New Mentorship Program Guidelines",
    status: "active",
    votes: { for: 445, against: 89, abstain: 12 },
    endTime: "3 days remaining",
  },
  {
    id: "PROP-003",
    title: "Treasury Diversification Strategy",
    status: "failed",
    votes: { for: 234, against: 567, abstain: 45 },
    endTime: "1 week ago",
  },
]

export function GovernanceMetrics() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Governance Activity</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentVotes.map((vote) => (
            <div key={vote.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{vote.id}</span>
                    <Badge
                      variant={
                        vote.status === "passed" ? "default" : vote.status === "active" ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {vote.status === "passed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {vote.status === "active" && <Clock className="h-3 w-3 mr-1" />}
                      {vote.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                      {vote.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground">{vote.title}</h4>
                  <p className="text-xs text-muted-foreground">{vote.endTime}</p>
                </div>
                <Vote className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-muted-foreground">For: {vote.votes.for}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-muted-foreground">Against: {vote.votes.against}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-muted-foreground">Abstain: {vote.votes.abstain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
