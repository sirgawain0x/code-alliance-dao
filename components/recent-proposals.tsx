"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Clock, User, MessageSquare } from "lucide-react"
import { useDaoProposals } from "../hooks/useDaoProposals"
import { ProposalItem } from "../utils/daotypes"
import { useMemo } from "react"

export function RecentProposals() {
  const { proposals, isLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    queryOptions: {
      first: 10,
      orderBy: "createdAt",
      orderDirection: "desc"
    }
  });

  const proposalList: {
    id: string;
    title: string;
    description: string;
    author: string;
    status: string;
    timeLeft: string;
    comments: number;
    category: string;
  }[] = useMemo(() => {
    if (!proposals) return [];

    const now = new Date().getTime() / 1000;

    return proposals.map((p: ProposalItem) => {
      let status = "voting";
      if (p.passed) status = "passed";
      else if (p.cancelled) status = "cancelled";
      else if (p.processed) status = "executed";
      else if (Number(p.votingEnds) < now) status = "expired";

      let timeLeft = "";
      if (Number(p.votingEnds) > now) {
        const daysLeft = Math.ceil((Number(p.votingEnds) - now) / 86400);
        timeLeft = `${daysLeft} days to vote`;
      } else {
        timeLeft = "Voting ended";
      }

      return {
        id: p.proposalId || p.id,
        title: p.title || "Untitled Proposal",
        description: p.description || "No description provided.",
        author: p.proposedBy ? `${p.proposedBy.slice(0, 6)}...${p.proposedBy.slice(-4)}` : "Unknown",
        status: status,
        timeLeft: timeLeft,
        comments: 0, // Placeholder
        category: "Governance" // Placeholder
      }
    });
  }, [proposals]);

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-lg"></div>)}
        </div>
      </Card>
    )
  }

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
          {proposalList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No proposals found.</div>
          ) : (
            proposalList.map((proposal) => (
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
                            : proposal.status === "passed" || proposal.status === "executed"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground">{proposal.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{proposal.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{proposal.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{proposal.timeLeft}</span>
                      </div>
                      {proposal.comments > 0 && (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{proposal.comments} comments</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
