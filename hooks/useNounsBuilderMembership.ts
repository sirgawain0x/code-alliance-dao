"use client"

import { useQuery } from "@tanstack/react-query"
import { createPublicClient, http } from "viem"
import { optimism } from "viem/chains"
import { tokenAbi, governorAbi } from "@buildeross/sdk/contract"
import { daoMembershipRequest } from "@buildeross/sdk/subgraph"
import { CHAIN_ID } from "@buildeross/types"
import { useAppKitAccount } from "@reown/appkit/react"

import { getAnnouncedBillContracts } from "@/lib/announced-bill-config"
import { getRpcUrl } from "@/utils/endpoints"

export interface NounsMembershipSnapshot {
  nounCount: number
  voteCount: number
  delegate: string
  canPropose: boolean
}

export function useNounsBuilderMembership() {
  const contracts = getAnnouncedBillContracts()
  const { address } = useAppKitAccount()

  const query = useQuery({
    queryKey: ["nouns-membership", contracts.nft, address],
    enabled: Boolean(address),
    queryFn: async () => {
      if (!address) return null

      const rpcUrl = process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || getRpcUrl({ chainid: "10" })
      const client = createPublicClient({
        chain: optimism,
        transport: http(rpcUrl),
      })

      const [membership, thresholdBps, totalSupply] = await Promise.all([
        daoMembershipRequest(CHAIN_ID.OPTIMISM, contracts.nft, address),
        client.readContract({
          address: contracts.governor as `0x${string}`,
          abi: governorAbi,
          functionName: "proposalThresholdBps",
        }),
        client.readContract({
          address: contracts.nft as `0x${string}`,
          abi: tokenAbi,
          functionName: "totalSupply",
        }),
      ])

      const nounCount = membership?.tokenCount ?? 0
      const voteCount = membership?.voteCount ?? 0
      const required = Math.ceil((Number(totalSupply) * Number(thresholdBps)) / 10_000)

      return {
        nounCount,
        voteCount,
        delegate: membership?.delegate ?? address,
        canPropose: voteCount >= required,
      } satisfies NounsMembershipSnapshot
    },
    staleTime: 30_000,
  })

  return {
    membership: query.data,
    isLoading: query.isLoading,
    isConnected: Boolean(address),
    refetch: query.refetch,
  }
}
