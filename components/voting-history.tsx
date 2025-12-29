"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"

import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useDao } from "@/hooks/useDao"
import Link from "next/link"

// Helper function to format votes (reuse from active-proposals if possible, or duplicate for now)
function getStatus(proposal: { processed: boolean; cancelled: boolean; votingEnds: string }): string {
  if (proposal.cancelled) return "cancelled"
  if (proposal.processed) return "passed" // Simplified: processed usually means passed and executed
  const now = Math.floor(Date.now() / 1000)
  if (Number(proposal.votingEnds) > now) return "active"
  return "failed" // Simplified: ended but not processed usually means failed
}

export function VotingHistory() {
  const { dao } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  })

  // Fetch all proposals
  const { proposals, isLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    queryOptions: {
      first: 5, // Just get recent ones
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  })

  if (isLoading) return <div className="text-center p-4">Loading history...</div>
  if (!proposals || proposals.length === 0) return <div className="text-center p-4">No voting history found.</div>

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
          {proposals.map((proposal) => {
            const status = getStatus(proposal)
            // Only show ended proposals in history? Or all? User request implied "Voting History".
            // Let's filter for non-active ones if we want true "history", but typically recent history includes active ones too.
            // For now, let's show all fetched (which is recent 5).

            const yesVotes = Number(proposal.yesVotes || 0)
            const noVotes = Number(proposal.noVotes || 0)
            const abstainVotes = 0

            return (
              <Link key={proposal.id} href={`/governance/proposal/${(proposal as any).proposalId || proposal.id.split('-').pop()}`}>
                <div className="border border-border rounded-lg p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">#{(proposal as any).proposalId || proposal.id.split('-').pop()}</span>
                        <Badge variant="outline" className="text-xs">
                          {proposal.proposalType}
                        </Badge>
                        <Badge variant={status === "passed" ? "default" : status === "failed" ? "destructive" : "secondary"} className="text-xs">
                          {status === "passed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                          {status}
                        </Badge>
                      </div>

                      <h4 className="font-medium text-foreground">{proposal.title || `Proposal ${proposal.id.split('-').pop()}`}</h4>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{proposal.proposedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(Number(proposal.createdAt) * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Vote Results */}
                  <div className="flex items-center space-x-6 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-muted-foreground">For: {yesVotes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-muted-foreground">Against: {noVotes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-muted-foreground">Abstain: {abstainVotes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
