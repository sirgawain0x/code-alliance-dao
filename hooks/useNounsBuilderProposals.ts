"use client"

import { useQuery } from "@tanstack/react-query"
import { getProposals } from "@buildeross/sdk/subgraph"
import { CHAIN_ID } from "@buildeross/types"

import { getAnnouncedBillContracts } from "@/lib/announced-bill-config"
import {
  resolveNounsProposalBody,
  resolveNounsProposalTitle,
} from "@/lib/nouns-proposal-copy"

export interface NounsProposalListItem {
  proposalId: string
  proposalNumber: number
  title: string
  body: string
  state: number
  forVotes: number
  againstVotes: number
  abstainVotes: number
  quorumVotes: number
  proposer: string
  voteStart: number
  voteEnd: number
  timeCreated: number
  targets: string[]
  values: string[]
  calldatas: string[]
  description: string
  descriptionHash: string
}

export function useNounsBuilderProposals({ limit = 50 }: { limit?: number } = {}) {
  const contracts = getAnnouncedBillContracts()

  const query = useQuery({
    queryKey: ["nouns-proposals", contracts.nft, limit],
    queryFn: async () => {
      const response = await getProposals(CHAIN_ID.OPTIMISM, contracts.nft, limit, 0)
      return (response.proposals ?? []).map((proposal) => ({
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
      })) satisfies NounsProposalListItem[]
    },
    staleTime: 30_000,
  })

  return {
    proposals: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
