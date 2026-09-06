import { Contract, JsonRpcProvider } from "ethers"
import { NextResponse } from "next/server"

import { METOKEN_DIAMOND_ABI } from "@/config/abis/metoken-diamond"
import {
  BASE_CHAIN_ID,
  BASE_USDC_ADDRESS,
} from "@/config/constants"
import {
  CRTVAI_DECIMALS,
  CRTVAI_DIAMOND_ADDRESS,
  CRTVAI_HUB_2_VAULT_ADDRESS,
  CRTVAI_METOKEN_ADDRESS,
  USDC_DECIMALS,
} from "@/config/metoken"
import { getRpcUrl } from "@/utils/endpoints"

export interface CrtvaiMintQuote {
  usdcAmount: string
  metokenAmount: string
  priceUsdcPerToken?: string
}

export interface CrtvaiSellQuote {
  metokenAmount: string
  usdcAmount: string
  priceUsdcPerToken?: string
}

export function getCrtvaiMintProvider() {
  const rpcKey =
    process.env.ALCHEMY_API_KEY ||
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ||
    undefined

  const rpcUrl = getRpcUrl({ chainid: String(BASE_CHAIN_ID), rpcKey })
  return new JsonRpcProvider(rpcUrl, BASE_CHAIN_ID)
}

export async function getCrtvaiMintQuote(usdcAmount: bigint): Promise<CrtvaiMintQuote> {
  if (usdcAmount <= 0n) throw new Error("USDC amount must be greater than zero")

  const provider = getCrtvaiMintProvider()
  const diamond = new Contract(CRTVAI_DIAMOND_ADDRESS, METOKEN_DIAMOND_ABI, provider)
  const metokenAmount = await diamond.calculateMeTokensMinted(
    CRTVAI_METOKEN_ADDRESS,
    usdcAmount,
  )

  let priceUsdcPerToken: string | undefined
  if (metokenAmount > 0n) {
    const price = (usdcAmount * 10n ** BigInt(CRTVAI_DECIMALS)) / metokenAmount
    priceUsdcPerToken = formatUnitsSafe(price, USDC_DECIMALS)
  }

  return {
    usdcAmount: usdcAmount.toString(),
    metokenAmount: metokenAmount.toString(),
    priceUsdcPerToken,
  }
}

export async function getCrtvaiCurrentPriceUsdc(): Promise<string> {
  const oneUsdc = 10n ** BigInt(USDC_DECIMALS)
  const quote = await getCrtvaiMintQuote(oneUsdc)
  return quote.priceUsdcPerToken || "0"
}

export async function getCrtvaiSellQuote(
  metokenAmount: bigint,
  sender: string,
): Promise<CrtvaiSellQuote> {
  if (metokenAmount <= 0n) throw new Error("CRTVAI amount must be greater than zero")

  if (!sender || !/^0x[a-fA-F0-9]{40}$/.test(sender)) {
    throw new Error("Valid sender address is required for sell quote")
  }

  const provider = getCrtvaiMintProvider()
  const diamond = new Contract(CRTVAI_DIAMOND_ADDRESS, METOKEN_DIAMOND_ABI, provider)
  const usdcAmount = await diamond.calculateAssetsReturned(
    CRTVAI_METOKEN_ADDRESS,
    metokenAmount,
    sender,
  )

  let priceUsdcPerToken: string | undefined
  if (metokenAmount > 0n) {
    const price = (usdcAmount * 10n ** BigInt(CRTVAI_DECIMALS)) / metokenAmount
    priceUsdcPerToken = formatUnitsSafe(price, USDC_DECIMALS)
  }

  return {
    metokenAmount: metokenAmount.toString(),
    usdcAmount: usdcAmount.toString(),
    priceUsdcPerToken,
  }
}

export function createCrtvaiMintErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to quote CRTVAI mint"
  const isInsufficientSell =
    /!valid/i.test(message) || /reason="!valid"/i.test(message)
  const isInfraFailure =
    !isInsufficientSell &&
    /401|403|429|500|502|503|504|network|timeout|fetch failed|ECONNREFUSED|Unauthorized/i.test(
      message,
    )
  const status = isInfraFailure ? 503 : 400
  const clientMessage = isInsufficientSell
    ? "Sell amount exceeds your CRTVAI balance or MeToken hub limits. Try a smaller amount."
    : isInfraFailure
      ? "Mint quote service is temporarily unavailable. Try again shortly."
      : message

  return NextResponse.json({ error: clientMessage, code: "QUOTE_FAILED" }, { status })
}

export const CRTVAI_MINT_APPROVAL_TARGET = CRTVAI_HUB_2_VAULT_ADDRESS
export const CRTVAI_MINT_USDC_ADDRESS = BASE_USDC_ADDRESS
export const CRTVAI_MINT_DIAMOND_ADDRESS = CRTVAI_DIAMOND_ADDRESS
export const CRTVAI_MINT_METOKEN_ADDRESS = CRTVAI_METOKEN_ADDRESS

function formatUnitsSafe(value: bigint, decimals: number) {
  const divisor = 10n ** BigInt(decimals)
  const whole = value / divisor
  const fraction = value % divisor
  const fractionStr = fraction.toString().padStart(decimals, "0").replace(/0+$/, "")
  if (!fractionStr) return whole.toString()
  return `${whole}.${fractionStr}`
}
