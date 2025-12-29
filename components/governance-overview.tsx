"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Vote, Users, Clock, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useDao } from "@/hooks/useDao"



const votingMechanisms = [
  {
    name: "Token Voting",
    description: "Standard governance token-based voting",
    usage: "Parent DAO & Crypto SubDAOs",
    active: true,
  },
  {
    name: "Reputation Voting",
    description: "Merit-based voting for non-crypto projects",
    usage: "Traditional SubDAOs",
    active: true,
  },
  {
    name: "Quadratic Voting",
    description: "Budget allocation and resource distribution",
    usage: "Treasury decisions",
    active: true,
  },
  {
    name: "Conviction Voting",
    description: "Long-term commitment signaling",
    usage: "Strategic initiatives",
    active: false,
  },
]

export function GovernanceOverview() {
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  });

  const { proposals, isLoading: proposalsLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  });

  // Calculate active proposals
  const activeProposals = useMemo(() => {
    if (!proposals) return [];
    const now = new Date().getTime() / 1000;
    return proposals.filter((p) => {
      return !p.processed && !p.cancelled && Number(p.votingEnds) > now;
    });
  }, [proposals]);

  if (proposalsLoading || daoLoading || !dao) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg"></div>
  }

  const passedProposals = proposals?.filter(p => p.passed).length || 0;
  const totalProposals = proposals?.length || 0;
  const passedRate = totalProposals > 0 ? Math.round((passedProposals / totalProposals) * 100) : 0;

  const governanceStats = [
    {
      label: "Your Voting Power",
      value: "0", // Placeholder as we don't have user wallet connection yet
      subtitle: "CA Tokens",
      icon: Vote,
      color: "text-blue-400",
    },
    {
      label: "Active Proposals",
      value: activeProposals?.length.toString() || "0",
      subtitle: "Awaiting votes",
      icon: Clock,
      color: "text-orange-400",
    },
    {
      label: "Participation Rate",
      value: "78%", // Hardcoded for now, requires complex calculation
      subtitle: "Last 30 days",
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Proposals Passed",
      value: `${passedRate}%`,
      subtitle: `${passedProposals} of ${totalProposals} passed`,
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {governanceStats.map((stat) => (
          <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Voting Mechanisms */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Voting Mechanisms</h3>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {votingMechanisms.map((mechanism) => (
              <div key={mechanism.name} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{mechanism.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${mechanism.active ? "bg-green-400" : "bg-gray-400"}`} />
                </div>
                <p className="text-sm text-muted-foreground">{mechanism.description}</p>
                <p className="text-xs text-muted-foreground">Used for: {mechanism.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Governance Health */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Governance Health Metrics</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Voter Turnout</span>
                <span className="text-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">Average across all proposals</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Proposal Quality</span>
                <span className="text-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Community satisfaction score</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Execution Rate</span>
                <span className="text-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Passed proposals implemented</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
