"use client"

import { useQuery } from "@tanstack/react-query"
import { getProposal } from "@buildeross/sdk/subgraph"
import { CHAIN_ID } from "@buildeross/types"

import {
  resolveNounsProposalBody,
  resolveNounsProposalTitle,
} from "@/lib/nouns-proposal-copy"
import type { NounsProposalListItem } from "@/hooks/useNounsBuilderProposals"

export function useNounsBuilderProposal({ proposalId }: { proposalId?: string }) {
  const query = useQuery({
    queryKey: ["nouns-proposal", proposalId],
    enabled: Boolean(proposalId),
    queryFn: async () => {
      if (!proposalId) throw new Error("Missing proposal id")

      const proposal = await getProposal(CHAIN_ID.OPTIMISM, proposalId)
      if (!proposal) return null

      return {
        proposalId: String(proposal.proposalId),
        proposalNumber: Number(proposal.proposalNumber),
        title: resolveNounsProposalTitle({
          title: proposal.title,
          description: proposal.description,
          proposalNumber: proposal.proposalNumber,
        }),
        body: resolveNounsProposalBody({
          description: proposal.description,
          metadata: proposal.metadata,
        }),
        state: Number(proposal.state),
        forVotes: Number(proposal.forVotes ?? 0),
        againstVotes: Number(proposal.againstVotes ?? 0),
        abstainVotes: Number(proposal.abstainVotes ?? 0),
        quorumVotes: Number(proposal.quorumVotes ?? 0),
        proposer: String(proposal.proposer),
        voteStart: Number(proposal.voteStart),
        voteEnd: Number(proposal.voteEnd),
        timeCreated: Number(proposal.timeCreated),
        targets: (proposal.targets ?? []).map(String),
        values: (proposal.values ?? []).map(String),
        calldatas: (proposal.calldatas ?? []).map(String),
        description: String(proposal.description ?? ""),
        descriptionHash: String(proposal.descriptionHash ?? ""),
      } satisfies NounsProposalListItem
    },
    staleTime: 30_000,
  })

  return {
    proposal: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
