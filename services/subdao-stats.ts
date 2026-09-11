import { Contract, JsonRpcProvider, formatEther, formatUnits, isAddress } from "ethers"

import { FEATURED_DAOS_CONFIG, CHAIN_NAMES } from "@/utils/featured-daos"
import { getRpcUrl } from "@/utils/endpoints"

const SUBDAO_STATS_ABI = [
  "function activeMemberCount() view returns (uint256)",
  "function memberCount() view returns (uint256)",
  "function membersCount() view returns (uint256)",
  "function totalMembers() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function owner() view returns (address)",
  "function avatar() view returns (address)",
  "function safeAddress() view returns (address)",
  "function safe() view returns (address)",
  "function treasury() view returns (address)",
]

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]

const MEMBER_COUNT_FUNCTIONS = [
  "activeMemberCount",
  "memberCount",
  "membersCount",
  "totalMembers",
]

// Nouns Builder DAOs expose member count via totalSupply().
const TREASURY_ADDRESS_FUNCTIONS = [
  "owner",
  "avatar",
  "safeAddress",
  "safe",
  "treasury",
]

const NATIVE_SYMBOLS: Record<string, string> = {
  "0x2105": "ETH",
  "0xa4b1": "ETH",
  "0xa": "ETH",
  "0x1": "ETH",
  "0x64": "ETH",
}

export interface SubDaoTokenBalance {
  symbol: string
  balance: string
  balanceFormatted: number
  isNative: boolean
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
  tokenBalances: SubDaoTokenBalance[]
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
  const contracts: SubDaoContractStat[] = []

  for (const daoConfig of FEATURED_DAOS_CONFIG) {
    const stat = await fetchSubDaoContractStat({
      address: daoConfig.address,
      chainId: daoConfig.chainId,
      label: daoConfig.label,
    })
    contracts.push(stat)
  }

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
  const fallbackStat: SubDaoContractStat = {
    address,
    chainId,
    chainName,
    label,
    members: 0,
    treasuryAddress: address,
    treasuryBalance: "0",
    treasuryBalanceEth: 0,
    tokenBalances: [],
    status: "unavailable",
  }

  if (!isAddress(address)) return fallbackStat

  try {
    const provider = new JsonRpcProvider(getRpcUrlForChain(chainId))
    const contract = new Contract(address, SUBDAO_STATS_ABI, provider)

    const members = await readMemberCount(contract)
    const treasuryAddress = await readTreasuryAddress(contract, address)
    const nativeBalance = await withRetry(() => provider.getBalance(treasuryAddress))

    const tokenBalances: SubDaoTokenBalance[] = [
      {
        symbol: NATIVE_SYMBOLS[chainId] || "ETH",
        balance: nativeBalance.toString(),
        balanceFormatted: Number(formatEther(nativeBalance)),
        isNative: true,
      },
    ]

    const erc20Balances = await fetchTreasuryErc20Balances({
      provider,
      treasuryAddress,
      chainId,
    })
    tokenBalances.push(...erc20Balances)

    const treasuryBalance = tokenBalances
      .filter((token) => token.isNative)
      .reduce((sum, token) => sum + BigInt(token.balance), BigInt(0))

    const hasLiveMembers = members > 0
    const hasTreasuryBalance = tokenBalances.some((token) => BigInt(token.balance) > BigInt(0))
    const status = hasLiveMembers || hasTreasuryBalance ? "live" : "partial"

    return {
      ...fallbackStat,
      members,
      treasuryAddress,
      treasuryBalance: treasuryBalance.toString(),
      treasuryBalanceEth: Number(formatEther(treasuryBalance)),
      tokenBalances,
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
      const value = await withRetry(() => contract[functionName]())
      const members = Number(value)
      if (members > 0) return members
    } catch {}
  }

  try {
    const totalSupply = await withRetry(() => contract.totalSupply())
    return normalizeTotalSupplyMemberCount(totalSupply)
  } catch {}

  return 0
}

function normalizeTotalSupplyMemberCount(totalSupply: bigint): number {
  const raw = Number(totalSupply)
  if (raw === 0) return 0

  // Nouns-style governance tokens store supply with 18 decimals.
  if (raw >= 1e15) return Math.round(raw / 1e18)

  return raw
}

async function readTreasuryAddress(contract: Contract, fallbackAddress: string): Promise<string> {
  for (const functionName of TREASURY_ADDRESS_FUNCTIONS) {
    try {
      const value = await withRetry(() => contract[functionName]())
      if (!isAddress(value)) continue
      if (value.toLowerCase() === fallbackAddress.toLowerCase()) continue

      return value
    } catch {}
  }

  for (const functionName of ["owner", "avatar"] as const) {
    try {
      const value = await withRetry(() => contract[functionName]())
      if (isAddress(value)) return value
    } catch {}
  }

  return fallbackAddress
}

async function fetchTreasuryErc20Balances({
  provider,
  treasuryAddress,
  chainId,
}: {
  provider: JsonRpcProvider
  treasuryAddress: string
  chainId: string
}): Promise<SubDaoTokenBalance[]> {
  const sequenceBalances = await fetchSequenceTokenBalances({
    chainId,
    treasuryAddress,
  })
  if (sequenceBalances.length > 0) return sequenceBalances

  return []
}

async function fetchSequenceTokenBalances({
  chainId,
  treasuryAddress,
}: {
  chainId: string
  treasuryAddress: string
}): Promise<SubDaoTokenBalance[]> {
  const sequenceKey = process.env.NEXT_PUBLIC_SEQUENCE_KEY
  if (!sequenceKey) return []

  const chainIdDecimal = parseInt(chainId, 16)
  if (Number.isNaN(chainIdDecimal)) return []

  try {
    const response = await fetch(
      "https://indexer.sequence.app/rpc/IndexerGateway/GetTokenBalances",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Key": sequenceKey,
        },
        body: JSON.stringify({
          chainIds: [chainIdDecimal],
          accountAddress: treasuryAddress,
          includeMetadata: true,
          metadataOptions: { verifiedOnly: false },
        }),
      }
    )

    if (!response.ok) return []

    const result = await response.json()
    const balances =
      result.page?.balances?.flatMap((entry: { results?: unknown[] }) => entry.results || []) ||
      result.balances?.flatMap((entry: { results?: unknown[] }) => entry.results || []) ||
      []

    return balances
      .filter((token: { balance?: string }) => token.balance && token.balance !== "0")
      .map((token: {
        balance: string
        contractInfo?: { symbol?: string; decimals?: number }
      }) => {
        const decimals = token.contractInfo?.decimals ?? 18
        const symbol = token.contractInfo?.symbol || "UNKNOWN"
        const balanceFormatted = Number(formatUnits(token.balance, decimals))

        return {
          symbol,
          balance: token.balance,
          balanceFormatted,
          isNative: false,
        }
      })
  } catch (error) {
    console.warn(`Sequence indexer unavailable for ${treasuryAddress}`, error)
    return []
  }
}

function getRpcUrlForChain(chainId: string): string {
  const chainIdDecimal = parseInt(chainId, 16).toString()
  const rpcKey =
    process.env.ALCHEMY_API_KEY ||
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ||
    undefined

  return getRpcUrl({ chainid: chainIdDecimal, rpcKey })
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
      }
    }
  }

  throw lastError
}
