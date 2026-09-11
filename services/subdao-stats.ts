import { Contract, JsonRpcProvider, formatEther, isAddress } from "ethers"

import { FEATURED_DAOS_CONFIG, CHAIN_NAMES } from "@/utils/featured-daos"

const SUBDAO_STATS_ABI = [
  "function activeMemberCount() view returns (uint256)",
  "function memberCount() view returns (uint256)",
  "function membersCount() view returns (uint256)",
  "function totalMembers() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function safeAddress() view returns (address)",
  "function safe() view returns (address)",
  "function avatar() view returns (address)",
  "function treasury() view returns (address)",
  "function owner() view returns (address)",
]

const MEMBER_COUNT_FUNCTIONS = [
  "activeMemberCount",
  "memberCount",
  "membersCount",
  "totalMembers",
]

const TREASURY_ADDRESS_FUNCTIONS = [
  "safeAddress",
  "safe",
  "avatar",
  "treasury",
  "owner",
]

const RPC_URLS: Record<string, string> = {
  "0x2105": process.env.BASE_RPC_URL || "https://mainnet.base.org",
  "0xa4b1": process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
  "0xa": process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
  "0x1": process.env.MAINNET_RPC_URL || "https://ethereum.publicnode.com",
  "0x64": process.env.GNOSIS_RPC_URL || "https://rpc.gnosischain.com",
}

export interface SubDaoContractStat {
  address: string
  chainId: string
  chainName: string
  label: string
  members: number
  treasuryAddress: string
  treasuryBalance: string
  treasuryBalanceEth: number
  status: "live" | "partial" | "unavailable"
}

export interface SubDaoAggregateStats {
  activeSubDAOs: number
  totalMembers: number
  combinedTreasury: number
  combinedTreasuryEth: string
  networkCount: number
  updatedAt: string
  contracts: SubDaoContractStat[]
}

export async function getSubDaoAggregateStats(): Promise<SubDaoAggregateStats> {
  const contracts = await Promise.all(
    FEATURED_DAOS_CONFIG.map((daoConfig) => fetchSubDaoContractStat({
      address: daoConfig.address,
      chainId: daoConfig.chainId,
      label: daoConfig.label,
    }))
  )

  const totalMembers = contracts.reduce((sum, contract) => sum + contract.members, 0)
  const combinedTreasuryWei = contracts.reduce(
    (sum, contract) => sum + BigInt(contract.treasuryBalance),
    BigInt(0)
  )

  return {
    activeSubDAOs: contracts.length,
    totalMembers,
    combinedTreasury: Number(formatEther(combinedTreasuryWei)),
    combinedTreasuryEth: formatEther(combinedTreasuryWei),
    networkCount: new Set(contracts.map((contract) => contract.chainId)).size,
    updatedAt: new Date().toISOString(),
    contracts,
  }
}

async function fetchSubDaoContractStat({
  address,
  chainId,
  label,
}: {
  address: string
  chainId: string
  label: string
}): Promise<SubDaoContractStat> {
  const chainName = CHAIN_NAMES[chainId] || chainId
  const fallbackStat = {
    address,
    chainId,
    chainName,
    label,
    members: 0,
    treasuryAddress: address,
    treasuryBalance: "0",
    treasuryBalanceEth: 0,
    status: "unavailable" as const,
  }

  if (!isAddress(address)) return fallbackStat

  try {
    const provider = new JsonRpcProvider(getRpcUrl(chainId))
    const contract = new Contract(address, SUBDAO_STATS_ABI, provider)
    const [members, treasuryAddress] = await Promise.all([
      readMemberCount(contract),
      readTreasuryAddress(contract, address),
    ])

    const treasuryBalance = await provider.getBalance(treasuryAddress)
    const hasLiveMembers = members > 0
    const status = hasLiveMembers ? "live" : "partial"

    return {
      ...fallbackStat,
      members,
      treasuryAddress,
      treasuryBalance: treasuryBalance.toString(),
      treasuryBalanceEth: Number(formatEther(treasuryBalance)),
      status,
    }
  } catch (error) {
    console.warn(`Unable to fetch live SubDAO stats for ${label} on ${chainName}`, error)
    return fallbackStat
  }
}

async function readMemberCount(contract: Contract): Promise<number> {
  for (const functionName of MEMBER_COUNT_FUNCTIONS) {
    try {
      const value = await contract[functionName]()
      return Number(value)
    } catch {}
  }

  return 0
}

async function readTreasuryAddress(contract: Contract, fallbackAddress: string): Promise<string> {
  for (const functionName of TREASURY_ADDRESS_FUNCTIONS) {
    try {
      const value = await contract[functionName]()
      if (isAddress(value)) return value
    } catch {}
  }

  return fallbackAddress
}

function getRpcUrl(chainId: string): string {
  const rpcUrl = RPC_URLS[chainId]
  if (!rpcUrl) throw new Error(`Unsupported SubDAO chain ID: ${chainId}`)

  return rpcUrl
}
