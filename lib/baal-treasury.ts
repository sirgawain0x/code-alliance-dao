import { Contract, JsonRpcProvider, ZeroAddress } from "ethers"

import { BAAL_ABI, ERC20_ABI } from "@/config/abis/baal"
import {
  BASE_USDC_ADDRESS,
  BUY_TOKEN_ADDRESS,
  CREATIVE_ORG_BAAL_ADDRESS,
  CREATIVE_ORG_SAFE_ADDRESS,
  CRTV_TOKEN_ADDRESSES,
} from "@/config/constants"

export interface TreasuryErc20Target {
  address: string
  symbol?: string
  decimals?: number
}

export function getDefaultTreasuryErc20s(chainId: string): TreasuryErc20Target[] {
  const chainNum = Number(chainId)
  const crtvAddress =
    CRTV_TOKEN_ADDRESSES[chainNum as keyof typeof CRTV_TOKEN_ADDRESSES] ??
    CRTV_TOKEN_ADDRESSES[8453]

  return [
    { address: BASE_USDC_ADDRESS, symbol: "USDC", decimals: 6 },
    { address: crtvAddress, symbol: "CRTV", decimals: 18 },
    { address: BUY_TOKEN_ADDRESS, symbol: "CRTVAI", decimals: 18 },
  ]
}

export async function resolveBaalSafeAddress({
  provider,
  baalAddress,
  fallbackSafeAddress,
}: {
  provider: JsonRpcProvider
  baalAddress?: string
  fallbackSafeAddress?: string
}): Promise<string> {
  const fallback = fallbackSafeAddress || CREATIVE_ORG_SAFE_ADDRESS
  if (!baalAddress) return fallback

  try {
    const baal = new Contract(baalAddress, BAAL_ABI, provider)
    const avatar: string = await baal.avatar()
    if (avatar && avatar !== ZeroAddress) return avatar
  } catch (error) {
    console.warn("Baal avatar() failed, using fallback Safe:", error)
  }

  return fallback
}

export async function fetchGuildTokenAddresses({
  provider,
  baalAddress,
  chainId,
}: {
  provider: JsonRpcProvider
  baalAddress?: string
  chainId: string
}): Promise<{ tokens: TreasuryErc20Target[]; source: "guild" | "default" }> {
  const defaults = getDefaultTreasuryErc20s(chainId)
  if (!baalAddress) return { tokens: defaults, source: "default" }

  try {
    const baal = new Contract(baalAddress, BAAL_ABI, provider)
    const guildTokens: string[] = await baal.getGuildTokens()
    const unique = [...new Set(guildTokens.filter((address) => Boolean(address)))]
    if (unique.length === 0) return { tokens: defaults, source: "default" }

    return {
      tokens: unique.map((address) => ({ address })),
      source: "guild",
    }
  } catch (error) {
    console.warn("getGuildTokens() reverted on Baal, using default ERC20 list:", error)
    return { tokens: defaults, source: "default" }
  }
}

export function resolveBaalAddress({
  daoAddress,
  chainId,
}: {
  daoAddress?: string
  chainId: string
}): string | undefined {
  if (daoAddress) return daoAddress
  if (chainId === "8453") return CREATIVE_ORG_BAAL_ADDRESS
  return undefined
}

export async function enrichTokenMetadata({
  provider,
  token,
}: {
  provider: JsonRpcProvider
  token: TreasuryErc20Target
}): Promise<TreasuryErc20Target> {
  if (token.symbol && token.decimals !== undefined) return token

  try {
    const contract = new Contract(token.address, ERC20_ABI, provider)
    const [symbol, decimals] = await Promise.all([
      token.symbol ? Promise.resolve(token.symbol) : contract.symbol().catch(() => "UNKNOWN"),
      token.decimals !== undefined
        ? Promise.resolve(token.decimals)
        : contract.decimals().catch(() => 18),
    ])
    return { address: token.address, symbol, decimals: Number(decimals) }
  } catch {
    return {
      address: token.address,
      symbol: token.symbol || "UNKNOWN",
      decimals: token.decimals ?? 18,
    }
  }
}
