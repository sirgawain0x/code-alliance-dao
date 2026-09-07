"use client"

import { useActiveDao } from "@/contexts/ActiveDaoContext"
import { ActiveProposals } from "@/components/active-proposals"
import { AnnouncedBillGovernancePanel } from "@/components/announced-bill-governance-panel"
import { GovernanceOverview } from "@/components/governance-overview"
import { VotingHistory } from "@/components/voting-history"

export function GovernanceSurface() {
  const { activeDao } = useActiveDao()

  if (activeDao.kind === "nouns") {
    return <AnnouncedBillGovernancePanel />
  }

  return (
    <div className="space-y-6">
      <GovernanceOverview />
      <ActiveProposals />
      <VotingHistory />
    </div>
  )
}
