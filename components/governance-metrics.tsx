"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Clock, CheckCircle, XCircle } from "lucide-react"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useMemo } from "react"
import { ProposalItem } from "@/utils/daotypes"

export function GovernanceMetrics() {
  const { proposals, isLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    queryOptions: {
      first: 5,
      orderBy: "createdAt",
      orderDirection: "desc"
    }
  });

  const recentVotes: {
    id: string;
    title: string;
    status: string;
    votes: { for: number; against: number; abstain: number };
    endTime: string;
  }[] = useMemo(() => {
    if (!proposals) return [];

    const now = new Date().getTime() / 1000;

    return proposals.map((p: ProposalItem) => {
      let status = "active";
      if (p.passed) status = "passed";
      else if (p.cancelled) status = "failed"; // or cancelled
      else if (Number(p.votingEnds) < now) status = "failed";

      // Calculate time string
      let timeString = "";
      if (status === "active") {
        const daysLeft = Math.ceil((Number(p.votingEnds) - now) / 86400);
        timeString = `${daysLeft} days remaining`;
      } else {
        const daysAgo = Math.ceil((now - Number(p.createdAt)) / 86400);
        timeString = `${daysAgo} days ago`;
      }

      return {
        id: p.proposalId || p.id,
        title: p.title || "Untitled Proposal",
        status,
        votes: {
          for: Number(p.yesVotes) || 0,
          against: Number(p.noVotes) || 0,
          abstain: 0 // Subgraph might not explicitly track abstain in simple view
        },
        endTime: timeString,
      }
    });
  }, [proposals]);

  if (isLoading) {
    return <Card className="stat-card-gradient p-6 h-64 animate-pulse" />
  }

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
          {recentVotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent proposals found.</div>
          ) : (
            recentVotes.map((vote) => (
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
                  {/* abstain hidden if 0 or irrelevant */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
