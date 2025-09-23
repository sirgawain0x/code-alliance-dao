import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Clock, User, MessageSquare, Vote } from "lucide-react"

interface ProposalDetailProps {
  proposalId: string
}

// Mock data - in real app this would come from API
const proposalData = {
  id: "PROP-007",
  title: "Establish AI Research SubDAO",
  description:
    "Create a specialized SubDAO focused on artificial intelligence research and development projects with initial funding of $500K.",
  fullDescription: `This proposal aims to establish a new SubDAO dedicated to artificial intelligence research and development within the Code Alliance ecosystem.

## Objectives
- Create a specialized governance structure for AI research projects
- Establish funding mechanisms for AI/ML initiatives
- Build partnerships with academic institutions and research organizations
- Develop open-source AI tools and frameworks for the community

## Funding Request
- Initial Treasury Allocation: $500,000
- Monthly Operating Budget: $50,000
- Research Grant Pool: $200,000

## Timeline
- Phase 1 (Month 1-2): SubDAO setup and governance structure
- Phase 2 (Month 3-6): Team recruitment and initial projects
- Phase 3 (Month 6-12): Full operation and first research outputs

## Success Metrics
- Number of active research projects
- Community engagement and participation
- Research publications and open-source contributions
- Partnership agreements with external organizations`,
  author: "alice.eth",
  category: "SubDAO Creation",
  status: "active",
  created: "5 days ago",
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
  yourVotingPower: 125,
}

const comments = [
  {
    author: "bob.dao",
    content: "This is an excellent proposal. AI research is crucial for our ecosystem's future.",
    timestamp: "2 days ago",
    votes: 12,
  },
  {
    author: "carol.research",
    content: "I support this initiative but think we should allocate more funding for partnerships.",
    timestamp: "1 day ago",
    votes: 8,
  },
  {
    author: "david.tech",
    content: "What specific AI domains will this SubDAO focus on? We should be more specific.",
    timestamp: "18 hours ago",
    votes: 5,
  },
]

export function ProposalDetail({ proposalId }: ProposalDetailProps) {
  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0
  }

  const getQuorumPercentage = (total: number, quorum: number) => {
    return (total / quorum) * 100
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
              Your voting power: {proposalData.yourVotingPower} CA tokens
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
                Choose your vote and optionally add a comment explaining your decision.
              </div>

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
                <Button size="sm">Add Comment</Button>
              </div>

              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>{comment.votes} votes</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
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
