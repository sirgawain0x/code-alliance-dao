"use client"

import { useQuery } from "@tanstack/react-query"
import { Contract, formatEther, ZeroAddress } from "ethers"

import { ERC20_ABI } from "@/config/abis/baal"
import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import {
  enrichTokenMetadata,
  fetchGuildTokenAddresses,
  resolveBaalAddress,
  resolveBaalSafeAddress,
  type TreasuryErc20Target,
} from "@/lib/baal-treasury"
import {
  fetchEthBalance,
  resolveTreasuryProvider,
  withRetry,
} from "@/lib/treasury-rpc"
import { getDaoContractConfig } from "@/lib/dao-config"

export interface TreasuryTokenBalance {
  address: string | null
  symbol: string
  name: string
  decimals: number
  balance: string
  formatted: string
}

export interface SafeTreasuryBalances {
  safeAddress: string
  ethBalance: string
  ethFormatted: string
  tokens: TreasuryTokenBalance[]
  ethFetchFailed: boolean
  skippedTokens: string[]
  tokenSource: "guild" | "default"
}

function hasMeaningfulTreasuryBalances(treasury: SafeTreasuryBalances): boolean {
  const erc20Tokens = treasury.tokens.filter((token) => token.address !== null)
  if (erc20Tokens.length > 0) return true
  return !treasury.ethFetchFailed && BigInt(treasury.ethBalance) > BigInt(0)
}

/** Hard RPC failure: whole query failed, or ETH failed with no other usable balances. */
export function hasTreasuryRpcDegradation(
  treasury: SafeTreasuryBalances | undefined,
  isError = false
): boolean {
  if (isError) return !treasury || !hasMeaningfulTreasuryBalances(treasury)
  if (!treasury) return false
  if (!treasury.ethFetchFailed) return false
  return !hasMeaningfulTreasuryBalances(treasury)
}

export function getTreasurySkippedTokenWarning(
  treasury: SafeTreasuryBalances | undefined
): string | null {
  if (!treasury?.skippedTokens.length) return null
  const names = treasury.skippedTokens.join(", ")
  return `${names} temporarily unavailable — open View Safe on BaseScan for full balances.`
}

export function getTreasuryEthWarning(
  treasury: SafeTreasuryBalances | undefined
): string | null {
  if (!treasury?.ethFetchFailed) return null
  if (hasMeaningfulTreasuryBalances(treasury)) {
    return "ETH balance temporarily unavailable — open View Safe on BaseScan."
  }
  return null
}

async function fetchErc20TokenBalance({
  provider,
  treasury,
  target,
}: {
  provider: Awaited<ReturnType<typeof resolveTreasuryProvider>>
  treasury: string
  target: TreasuryErc20Target
}): Promise<TreasuryTokenBalance | null> {
  const token = await enrichTokenMetadata({ provider, token: target })
  const contract = new Contract(token.address, ERC20_ABI, provider)
  const balance: bigint = await contract.balanceOf(treasury)
  if (balance <= BigInt(0)) return null

  const decimals = token.decimals ?? 18
  const symbol = token.symbol ?? "UNKNOWN"

  return {
    address: token.address === ZeroAddress ? null : token.address,
    symbol,
    name: symbol,
    decimals,
    balance: balance.toString(),
    formatted: (Number(balance) / 10 ** decimals).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    }),
  }
}

export function useSafeTreasuryBalances({
  chainId = "8453",
  daoAddress,
  safeAddress,
}: {
  chainId?: string
  daoAddress?: string
  safeAddress?: string
}) {
  const config = getDaoContractConfig({ chainId, daoAddress })
  const baalAddress = resolveBaalAddress({ daoAddress, chainId })
  const configuredSafe =
    safeAddress ||
    config?.treasuryAddress ||
    CREATIVE_ORG_SAFE_ADDRESS

  return useQuery({
    queryKey: ["safe-treasury-balances", chainId, configuredSafe, baalAddress],
    enabled: Boolean(configuredSafe && chainId),
    queryFn: async (): Promise<SafeTreasuryBalances> => {
      const provider = await resolveTreasuryProvider(chainId)
      const treasury = await resolveBaalSafeAddress({
        provider,
        baalAddress,
        fallbackSafeAddress: configuredSafe,
      })

      const { balance: ethBalance, failed: ethFetchFailed } = await fetchEthBalance(
        provider,
        treasury
      )

      const skippedTokens: string[] = []

      const tokens: TreasuryTokenBalance[] = []

      if (!ethFetchFailed) {
        tokens.push({
          address: null,
          symbol: "ETH",
          name: "Ether",
          decimals: 18,
          balance: ethBalance.toString(),
          formatted: formatEther(ethBalance),
        })
      }

      const { tokens: erc20Targets, source: tokenSource } = await fetchGuildTokenAddresses({
        provider,
        baalAddress,
        chainId,
      })

      for (const target of erc20Targets) {
        const label = target.symbol || target.address
        try {
          const tokenBalance = await withRetry(
            () => fetchErc20TokenBalance({ provider, treasury, target }),
            { attempts: 3, baseDelayMs: 250 }
          )
          if (tokenBalance) tokens.push(tokenBalance)
        } catch (error) {
          skippedTokens.push(label)
          console.warn(`Skipping treasury token ${label} after retries:`, error)
        }
      }

      return {
        safeAddress: treasury,
        ethBalance: ethBalance.toString(),
        ethFormatted: formatEther(ethBalance),
        tokens,
        ethFetchFailed,
        skippedTokens,
        tokenSource,
      }
    },
    retry: 2,
  })
}
