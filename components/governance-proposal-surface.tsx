"use client"

import { useActiveDao } from "@/contexts/ActiveDaoContext"
import { ProposalDetail } from "@/components/proposal-detail"
import { NounsProposalDetail } from "@/components/nouns-proposal-detail"

interface GovernanceProposalSurfaceProps {
  proposalId: string
  initialMetadata?: {
    full_description?: string
  }
}

function isNounsProposalId(id: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(id)
}

export function GovernanceProposalSurface({
  proposalId,
  initialMetadata,
}: GovernanceProposalSurfaceProps) {
  const { activeDao } = useActiveDao()

  if (activeDao.kind === "nouns" || isNounsProposalId(proposalId)) {
    return <NounsProposalDetail proposalId={proposalId} />
  }

  return <ProposalDetail proposalId={proposalId} initialMetadata={initialMetadata} />
}
