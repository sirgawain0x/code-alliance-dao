"use client"

import { useQuery } from "@tanstack/react-query"
import { Contract, formatEther, JsonRpcProvider, ZeroAddress } from "ethers"

import { ERC20_ABI } from "@/config/abis/baal"
import {
  BASE_USDC_ADDRESS,
  CREATIVE_ORG_SAFE_ADDRESS,
  BUY_TOKEN_ADDRESS,
} from "@/config/constants"
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

const DEFAULT_ERC20S = [
  { address: BASE_USDC_ADDRESS, symbol: "USDC", decimals: 6 },
  { address: BUY_TOKEN_ADDRESS, symbol: "CRTVAI", decimals: 18 },
]

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
  const treasury =
    safeAddress ||
    config?.treasuryAddress ||
    CREATIVE_ORG_SAFE_ADDRESS

  return useQuery({
    queryKey: ["safe-treasury-balances", chainId, treasury],
    enabled: Boolean(treasury && chainId),
    queryFn: async (): Promise<{
      safeAddress: string
      ethBalance: string
      ethFormatted: string
      tokens: TreasuryTokenBalance[]
    }> => {
      const provider = new JsonRpcProvider(getRpcUrl({ chainid: chainId }))
      const ethBalance = await provider.getBalance(treasury)
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

      for (const token of DEFAULT_ERC20S) {
        try {
          const contract = new Contract(token.address, ERC20_ABI, provider)
          const balance: bigint = await contract.balanceOf(treasury)
          if (balance <= BigInt(0)) continue
          const decimals: number = token.decimals
          const symbol: string = token.symbol
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
        } catch {
          // Skip tokens that fail to read
        }
      }

      return {
        safeAddress: treasury,
        ethBalance: ethBalance.toString(),
        ethFormatted: formatEther(ethBalance),
        tokens,
      }
    },
  })
}
