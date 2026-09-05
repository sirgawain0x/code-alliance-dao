"use client"

import { useMemo } from "react"
import { Clock, TrendingUp, Vote } from "lucide-react"

import { Card } from "./ui/card"
import { useDaoProposals } from "../hooks/useDaoProposals"
import { useDao } from "../hooks/useDao"
import { ProposalItem } from "../utils/daotypes"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"

export function GovernanceOverview() {
  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const { proposals, isLoading: proposalsLoading } = useDaoProposals({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const activeProposals = useMemo(() => {
    if (!proposals) return []
    const now = new Date().getTime() / 1000
    return proposals.filter((p: ProposalItem) => {
      return !p.processed && !p.cancelled && Number(p.votingEnds) > now
    })
  }, [proposals])

  if (proposalsLoading || daoLoading || !dao) {
    return <div className="animate-pulse h-48 bg-muted rounded-lg" />
  }

  const passedProposals = proposals?.filter((p: ProposalItem) => p.passed).length || 0
  const totalProposals = proposals?.length || 0
  const passedRate =
    totalProposals > 0 ? Math.round((passedProposals / totalProposals) * 100) : 0

  const governanceStats = [
    {
      label: "Your Voting Power",
      value: String(primaryProfile?.holdings.shares || 0),
      subtitle: "vCRTV voting shares",
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
      label: "Proposals Passed",
      value: `${passedRate}%`,
      subtitle: `${passedProposals} of ${totalProposals} passed`,
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  )
}
