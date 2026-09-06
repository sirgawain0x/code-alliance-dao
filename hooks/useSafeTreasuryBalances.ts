"use client"

import { useQuery } from "@tanstack/react-query"
import { Contract, formatEther, JsonRpcProvider, ZeroAddress } from "ethers"

import { ERC20_ABI } from "@/config/abis/baal"
import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import {
  enrichTokenMetadata,
  fetchGuildTokenAddresses,
  resolveBaalAddress,
  resolveBaalSafeAddress,
} from "@/lib/baal-treasury"
import { getDaoContractConfig } from "@/lib/dao-config"
import { getRpcUrl } from "@/utils/endpoints"

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

export function hasTreasuryRpcDegradation(
  treasury: SafeTreasuryBalances | undefined,
  isError = false
): boolean {
  if (isError) return true
  if (!treasury) return false
  return treasury.ethFetchFailed || treasury.skippedTokens.length > 0
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
      const provider = new JsonRpcProvider(getRpcUrl({ chainid: chainId }))
      const treasury = await resolveBaalSafeAddress({
        provider,
        baalAddress,
        fallbackSafeAddress: configuredSafe,
      })

      let ethBalance = BigInt(0)
      let ethFetchFailed = false
      try {
        ethBalance = await provider.getBalance(treasury)
      } catch (error) {
        ethFetchFailed = true
        console.error("Failed to fetch Safe ETH balance:", error)
      }

      const skippedTokens: string[] = []

      const tokens: TreasuryTokenBalance[] = [
        {
          address: null,
          symbol: "ETH",
          name: "Ether",
          decimals: 18,
          balance: ethBalance.toString(),
          formatted: formatEther(ethBalance),
        },
      ]

      const { tokens: erc20Targets, source: tokenSource } = await fetchGuildTokenAddresses({
        provider,
        baalAddress,
        chainId,
      })

      for (const target of erc20Targets) {
        try {
          const token = await enrichTokenMetadata({ provider, token: target })
          const contract = new Contract(token.address, ERC20_ABI, provider)
          const balance: bigint = await contract.balanceOf(treasury)
          if (balance <= BigInt(0)) continue

          const decimals = token.decimals ?? 18
          const symbol = token.symbol ?? "UNKNOWN"
          tokens.push({
            address: token.address === ZeroAddress ? null : token.address,
            symbol,
            name: symbol,
            decimals,
            balance: balance.toString(),
            formatted: (Number(balance) / 10 ** decimals).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            }),
          })
        } catch (error) {
          const label = target.symbol || target.address
          skippedTokens.push(label)
          console.warn(`Skipping treasury token ${label}:`, error)
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
    retry: 1,
  })
}
