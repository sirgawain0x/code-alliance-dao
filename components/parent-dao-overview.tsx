"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Users, Building2, TrendingUp, Shield } from "lucide-react"
import { useDao } from "../hooks/useDao"
import { useDaoProposals } from "../hooks/useDaoProposals"
import { useDaoTokenBalances } from "../hooks/useDaoTokenBalances"
import { summarizeTreasuryTokens } from "@/utils/treasury-helpers"
import { useOnchainMembershipProfile } from "../hooks/useOnchainMembershipProfile"
import { getDaoHausAdminProposalsUrl } from "@/lib/dao-haus-links"
import Link from "next/link"
import { CREATIVE_ORG_LOGO_SRC } from "@/config/constants"
import { useMemo } from "react"

export function ParentDAOOverview() {
  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })
  const { dao, isLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  });

  const { proposals } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const { tokens } = useDaoTokenBalances({
    chainid: "8453",
    safeAddress: dao?.safeAddress,
  })

  const stats = useMemo(() => {
    if (!dao) return null

    const treasurySummary = summarizeTreasuryTokens(tokens)
    const totalP = proposals?.length || 0
    const passed = proposals?.filter((p) => p.passed).length || 0
    const passRate = totalP > 0 ? Math.round((passed / totalP) * 100) : 0
    const voted = proposals?.filter((p) => Number(p.yesVotes) + Number(p.noVotes) > 0).length || 0
    const voteParticipation = totalP > 0 ? Math.round((voted / totalP) * 100) : 0

    return {
      totalMembers: Number(dao.activeMemberCount) || 0,
      activeSubdaos: dao.shamen?.length || 0,
      treasuryValue: treasurySummary.totalStableUsdFormatted,
      treasuryNote: treasurySummary.hasPricedTotal ? "Stablecoins only (est.)" : "Configure Sequence + balances",
      proposalSuccessRate: passRate,
      voterParticipation: voteParticipation,
      mission:
        dao.profile?.description ||
        "To democratically govern and support innovative projects through a decentralized incubator ecosystem that bridges traditional and blockchain technologies.",
      vision:
        dao.profile?.longDescription ||
        "To become the leading DAO-governed incubator that empowers diverse teams to build the future of technology through collaborative governance and shared resources.",
    }
  }, [dao, proposals, tokens])

  const adminProposalsUrl = getDaoHausAdminProposalsUrl()
  const canCreateProposal = Boolean(primaryProfile?.capabilities.canCreateProposal)
  const createProposalReady = canCreateProposal && Boolean(adminProposalsUrl)

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
            <img
              src={CREATIVE_ORG_LOGO_SRC}
              alt={dao?.name || "Creative Organization DAO"}
              className="h-16 w-auto max-w-[5rem] object-contain flex-shrink-0"
            />
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
          {createProposalReady ? (
            <Button asChild>
              <Link
                href={adminProposalsUrl!}
                target="_blank"
                rel="noopener noreferrer"
                title="Open DAOhaus Admin to create a proposal"
              >
                Create Proposal
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              title={
                !canCreateProposal
                  ? "Requires voting shares or admin role"
                  : "Set NEXT_PUBLIC_TARGET_DAO_ADDRESS to your Moloch v3 contract"
              }
            >
              Create Proposal
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Moloch members</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active SubDAOs/Shamen</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeSubdaos}</p>
              <p className="text-xs text-muted-foreground">Registered shamans</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Treasury Value</p>
              <p className="text-2xl font-bold text-foreground">{stats.treasuryValue}</p>
              <p className="text-xs text-muted-foreground">{stats.treasuryNote}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Proposal pass rate</p>
              <p className="text-2xl font-bold text-foreground">{stats.proposalSuccessRate}%</p>
              <p className="text-xs text-muted-foreground">Processed proposals that passed</p>
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
                <span className="text-muted-foreground">Voter signal (proposals with votes)</span>
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
                <span className="text-muted-foreground">Quorum setting</span>
                <span className="text-foreground">{dao?.quorumPercent ?? "—"}%</span>
              </div>
              <Progress value={Math.min(100, Number(dao?.quorumPercent || 0))} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

