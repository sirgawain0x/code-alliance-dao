"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Users, Building2, Wallet, FileText } from "lucide-react"
import { useDao } from "../hooks/useDao"
import { useOnchainMembershipProfile } from "../hooks/useOnchainMembershipProfile"
import { useSafeTreasuryBalances } from "../hooks/useSafeTreasuryBalances"
import { getDaoHausAdminProposalsUrl } from "@/lib/dao-haus-links"
import Link from "next/link"
import { CREATIVE_ORG_LOGO_SRC, CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import { useMemo } from "react"
import { formatEther } from "ethers"

export function ParentDAOOverview() {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS

  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress,
  })
  const { dao, isLoading } = useDao({
    chainid: "8453",
    daoid: daoAddress,
  })
  const { data: treasury, isLoading: treasuryLoading } = useSafeTreasuryBalances({
    chainId: "8453",
    daoAddress,
    safeAddress: dao?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS,
  })

  const stats = useMemo(() => {
    if (!dao) return null

    const ethBalance = Number(treasury?.ethFormatted || "0")
    const treasuryLabel =
      ethBalance > 0
        ? `${ethBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`
        : "0 ETH"

    return {
      totalMembers: Number(dao.activeMemberCount) || 0,
      activeSubdaos: dao.shamen?.length || 0,
      treasuryLabel,
      proposalCount: Number(dao.proposalCount) || 0,
      quorumPercent: dao.quorumPercent,
      mission:
        dao.profile?.description ||
        "To democratically govern and support innovative projects through a decentralized incubator ecosystem that bridges traditional and blockchain technologies.",
      vision:
        dao.profile?.longDescription ||
        "To become the leading DAO-governed incubator that empowers diverse teams to build the future of technology through collaborative governance and shared resources.",
    }
  }, [dao, treasury?.ethFormatted])

  const adminProposalsUrl = getDaoHausAdminProposalsUrl()
  const canCreateProposal = Boolean(primaryProfile?.capabilities.canCreateProposal)
  const createProposalReady = canCreateProposal && Boolean(adminProposalsUrl)

  if (isLoading || treasuryLoading || !stats) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-muted rounded-lg w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const totalShares = Math.round(Number(formatEther(dao?.totalShares || "0")))

  return (
    <div className="space-y-6">
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
            <Badge variant="outline">
              Established {new Date(Number(dao?.createdAt) * 1000).getFullYear()}
            </Badge>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Voting Members</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">on-chain share holders</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Shamen</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeSubdaos}</p>
              <p className="text-xs text-muted-foreground">on-chain roles</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Safe Treasury</p>
              <p className="text-2xl font-bold text-foreground">{stats.treasuryLabel}</p>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                {treasury?.safeAddress || CREATIVE_ORG_SAFE_ADDRESS}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Proposals</p>
              <p className="text-2xl font-bold text-foreground">{stats.proposalCount}</p>
              <p className="text-xs text-muted-foreground">
                {stats.quorumPercent ? `${stats.quorumPercent}% quorum` : "on-chain total"}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Mission & Vision</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Our Mission</h4>
              <p className="text-sm text-muted-foreground">{stats.mission}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Our Vision</h4>
              <p className="text-sm text-muted-foreground">{stats.vision}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">On-Chain Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Total Shares</p>
              <p className="text-foreground font-medium">{totalShares.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Voting Period</p>
              <p className="text-foreground font-medium">
                {dao?.votingPeriod ? `${Number(dao.votingPeriod) / 3600}h` : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Moloch Contract</p>
              <p className="text-foreground font-mono text-xs truncate">{daoAddress || "—"}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
