import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, MessageSquare } from "lucide-react"

const proposals = [
  {
    id: "PROP-004",
    title: "Establish AI Research SubDAO",
    description: "Create a specialized SubDAO focused on artificial intelligence research and development projects.",
    author: "alice.eth",
    status: "discussion",
    timeLeft: "5 days to vote",
    comments: 23,
    category: "SubDAO Creation",
  },
  {
    id: "PROP-005",
    title: "Update Governance Token Distribution",
    description:
      "Revise the token distribution mechanism to better reward long-term contributors and active participants.",
    author: "bob.dao",
    status: "voting",
    timeLeft: "2 days remaining",
    comments: 45,
    category: "Governance",
  },
  {
    id: "PROP-006",
    title: "Partnership with TechCorp Accelerator",
    description: "Establish strategic partnership to provide additional resources and mentorship opportunities.",
    author: "charlie.gov",
    status: "draft",
    timeLeft: "Draft phase",
    comments: 8,
    category: "Partnership",
  },
]

export function RecentProposals() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Proposals</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View All
            </Button>
            <Button size="sm">Create Proposal</Button>
          </div>
        </div>

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border border-border rounded-lg p-4 space-y-3 dao-card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{proposal.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {proposal.category}
                    </Badge>
                    <Badge
                      variant={
                        proposal.status === "voting"
                          ? "default"
                          : proposal.status === "discussion"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {proposal.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground">{proposal.title}</h4>
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{proposal.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{proposal.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{proposal.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
