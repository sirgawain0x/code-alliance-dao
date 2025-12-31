"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Users, Building2, TrendingUp, Shield } from "lucide-react"
import { useDao } from "../hooks/useDao"
import { useMemo } from "react"

export function ParentDAOOverview() {
  const { dao, isLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  });

  const stats = useMemo(() => {
    if (!dao) return null;

    return {
      totalMembers: Number(dao.activeMemberCount) || 0,
      activeSubdaos: dao.shamen?.length || 0, // Using shamen as a proxy for subdaos/integrations
      treasuryValue: "$2.4M", // Placeholder as treasury calculation is complex and requires token pricing
      governanceScore: 94, // Placeholder metric
      voterParticipation: Number(dao.proposalCount) > 0 ? 78 : 0, // Placeholder
      proposalSuccessRate: 85, // Placeholder
      communityEngagement: 92, // Placeholder
      mission: dao.profile?.description || "To democratically govern and support innovative projects through a decentralized incubator ecosystem that bridges traditional and blockchain technologies.",
      vision: dao.profile?.longDescription || "To become the leading DAO-governed incubator that empowers diverse teams to build the future of technology through collaborative governance and shared resources."
    }
  }, [dao]);

  if (isLoading || !stats) {
    return <div className="animate-pulse space-y-6">
      <div className="h-24 bg-muted rounded-lg w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-lg"></div>)}
      </div>
    </div>
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{dao?.name || "Creative Organization DAO"}</h1>
              <p className="text-muted-foreground">Parent DAO governing the incubator ecosystem</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
            <Badge variant="secondary">Parent DAO</Badge>
            <Badge variant="outline">Established {new Date(Number(dao?.createdAt) * 1000).getFullYear()}</Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">View Constitution</Button>
          <Button>Create Proposal</Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-green-400">+12% this month</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active SubDAOs/Shamen</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeSubdaos}</p>
              <p className="text-xs text-green-400">+2 this quarter</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Treasury Value</p>
              <p className="text-2xl font-bold text-foreground">{stats.treasuryValue}</p>
              <p className="text-xs text-green-400">+8.5% this month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Governance Score</p>
              <p className="text-2xl font-bold text-foreground">{stats.governanceScore}%</p>
              <p className="text-xs text-green-400">Excellent</p>
            </div>
            <Shield className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Mission & Vision */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Mission & Vision</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Our Mission</h4>
              <p className="text-sm text-muted-foreground">
                {stats.mission}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Our Vision</h4>
              <p className="text-sm text-muted-foreground">
                {stats.vision}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Governance Health */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Governance Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Voter Participation</span>
                <span className="text-foreground">{stats.voterParticipation}%</span>
              </div>
              <Progress value={stats.voterParticipation} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Proposal Success Rate</span>
                <span className="text-foreground">{stats.proposalSuccessRate}%</span>
              </div>
              <Progress value={stats.proposalSuccessRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Community Engagement</span>
                <span className="text-foreground">{stats.communityEngagement}%</span>
              </div>
              <Progress value={stats.communityEngagement} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

