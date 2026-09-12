import { Contract, isAddress } from "ethers"
import { GraphQLClient } from "graphql-request"

import { getGraphUrl, isSupportedSubgraphChain } from "@/utils/endpoints"

const BAAL_DETECTION_ABI = [
  "function sharesToken() view returns (address)",
  "function avatar() view returns (address)",
  "function totalShares() view returns (uint256)",
]

const DAO_ACTIVE_MEMBER_COUNT_QUERY = `
  query FindDaoActiveMemberCount($daoid: String!) {
    dao(id: $daoid) {
      activeMemberCount
    }
  }
`

export function getServerGraphKey(): string | undefined {
  return process.env.GRAPH_KEY || process.env.NEXT_PUBLIC_GRAPH_KEY || undefined
}

export async function isBaalContract(contract: Contract): Promise<boolean> {
  const detectionContract = new Contract(contract.target as string, BAAL_DETECTION_ABI, contract.runner)

  try {
    const sharesToken = await detectionContract.sharesToken()
    if (isAddress(sharesToken)) return true
  } catch {}

  try {
    await detectionContract.avatar()
    await detectionContract.totalShares()
    return true
  } catch {}

  return false
}

export async function fetchDaohausActiveMemberCount({
  chainId,
  address,
}: {
  chainId: string
  address: string
}): Promise<number | null> {
  const graphKey = getServerGraphKey()
  if (!graphKey) return null

  if (!isSupportedSubgraphChain({ chainid: chainId, subgraphKey: "DAOHAUS" })) {
    return null
  }

  try {
    const graphUrl = getGraphUrl({
      chainid: chainId,
      graphKey,
      subgraphKey: "DAOHAUS",
    })
    const client = new GraphQLClient(graphUrl)
    const response = (await client.request(DAO_ACTIVE_MEMBER_COUNT_QUERY, {
      daoid: address.toLowerCase(),
    })) as {
      dao?: { activeMemberCount?: string | number | null } | null
    }

    const activeMemberCount = response.dao?.activeMemberCount
    if (activeMemberCount === undefined || activeMemberCount === null) return null

    const members = Number(activeMemberCount)
    if (!Number.isFinite(members) || members < 0) return null

    return members
  } catch (error) {
    console.warn(
      `Unable to fetch DAOhaus activeMemberCount for ${address} on ${chainId}`,
      error
    )
    return null
  }
}
