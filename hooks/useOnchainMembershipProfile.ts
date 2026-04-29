"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAppKitAccount } from "@reown/appkit/react"
import { ethers } from "ethers"
import { useDaosForAddress } from "@/hooks/useDaosForAddress"
import { getDaoContractConfig } from "@/lib/dao-config"
import {
  getCapabilities,
  onchainOwnerSummonerResolver,
  type MembershipProfile,
} from "@/lib/permissions"
import { getRpcUrl } from "@/utils/endpoints"

const OWNER_ABI = [
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const

const NFT_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

function parseDaoChainAndAddress(daoId?: string): {
  chainId: string
  daoAddress: string
} {
  if (!daoId) return { chainId: "", daoAddress: "" }
  const [chainId, daoAddress] = daoId.split("-")
  return {
    chainId: chainId || "",
    daoAddress: daoAddress || "",
  }
}

export function useOnchainMembershipProfile({
  chainId,
}: {
  chainId: string
}) {
  const { address } = useAppKitAccount()
  const walletAddress = address?.toLowerCase()
  const { memberships, isLoading: isMembershipLoading, isUnsupportedChain } =
    useDaosForAddress({
      chainid: chainId,
      address: walletAddress,
      queryOptions: {
        first: 200,
        orderBy: "createdAt",
        orderDirection: "desc",
      },
    })

  const profilesQuery = useQuery({
    queryKey: ["onchain-membership-profile", chainId, walletAddress, memberships],
    enabled: Boolean(walletAddress && memberships?.length),
    queryFn: async (): Promise<MembershipProfile[]> => {
      if (!walletAddress || !memberships) return []

      const provider = new ethers.JsonRpcProvider(getRpcUrl({ chainid: chainId }))

      return Promise.all(
        memberships.map(async (membership) => {
          const { chainId: daoChainId, daoAddress } = parseDaoChainAndAddress(
            membership.dao?.id
          )
          const normalizedDaoAddress =
            daoAddress || membership.dao?.safeAddress?.toLowerCase() || ""
          const daoConfig = getDaoContractConfig({
            chainId: daoChainId || chainId,
            daoAddress: normalizedDaoAddress,
          })

          const shares = Number(membership.shares || 0)
          const loot = Number(membership.loot || 0)

          let nftBalance = 0
          if (daoConfig?.nftAddress) {
            const nftContract = new ethers.Contract(
              daoConfig.nftAddress,
              NFT_ABI,
              provider
            )
            const balance = await nftContract.balanceOf(walletAddress)
            nftBalance = Number(balance)
          }

          let ownerAddress: string | undefined
          if (daoConfig?.ownerReadAddress) {
            try {
              const ownerContract = new ethers.Contract(
                daoConfig.ownerReadAddress,
                OWNER_ABI,
                provider
              )
              ownerAddress = await ownerContract.owner()
            } catch {
              ownerAddress = undefined
            }
          }

          const adminSource = onchainOwnerSummonerResolver.resolveAdminStatus({
            memberAddress: walletAddress,
            ownerAddress,
            daoSummonerAddress: membership.dao?.createdBy,
          })

          const isVotingMember = shares > 0
          const isNonVotingMember = shares === 0 && (loot > 0 || nftBalance > 0)
          const isMember = isVotingMember || isNonVotingMember
          const isAdmin = adminSource.adminSource !== "none"

          return {
            daoId: membership.dao?.id || "",
            chainId: daoChainId || chainId,
            daoAddress: normalizedDaoAddress,
            isMember,
            isVotingMember,
            isNonVotingMember,
            isAdmin,
            holdings: {
              shares,
              loot,
              nftBalance,
            },
            capabilities: getCapabilities({
              isMember,
              isVotingMember,
              isAdmin,
            }),
            sources: adminSource,
          }
        })
      )
    },
  })

  const primaryProfile = useMemo(() => {
    if (!profilesQuery.data?.length) return undefined
    return profilesQuery.data[0]
  }, [profilesQuery.data])

  return {
    walletAddress,
    profiles: profilesQuery.data || [],
    primaryProfile,
    isLoading: isMembershipLoading || profilesQuery.isLoading,
    isUnsupportedChain,
    isConnected: Boolean(walletAddress),
  }
}
