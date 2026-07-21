import { NextResponse } from "next/server"

import { BASE_CHAIN_ID, BASE_USDC_ADDRESS, BASE_WETH_ADDRESS, CRTV_TOKEN_ADDRESSES } from "@/config/constants"

const ZERO_X_BASE_URL = "https://api.0x.org/swap/allowance-holder/quote"
const NATIVE_ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

export interface CrtvSwapQuoteRequest {
  sellToken: string
  sellAmount: string
  taker: string
  slippageBps?: number
}

export interface CrtvSwapQuote {
  buyAmount: string
  sellAmount: string
  price?: string
  guaranteedPrice?: string
  route?: unknown
  transaction: {
    to: string
    data: string
    value: string
    gas?: string
    gasPrice?: string
  }
  allowanceTarget?: string
  issues?: {
    allowance?: {
      spender: string
      actual: string
    }
    balance?: {
      token: string
      actual: string
      expected: string
    }
  }
}

export async function getCrtvSwapQuote({
  sellToken,
  sellAmount,
  taker,
  slippageBps = 50,
}: CrtvSwapQuoteRequest): Promise<CrtvSwapQuote> {
  const apiKey =
    process.env.ZERO_EX_API_KEY ||
    process.env.ZEROEX_API_KEY ||
    process.env.ZEROX_API_KEY ||
    process.env.NEXT_PUBLIC_ZEROX_API_KEY
  if (!apiKey) throw new Error("Missing ZEROX_API_KEY")

  if (!isSupportedSellToken(sellToken)) throw new Error("Unsupported sell token")

  const params = new URLSearchParams({
    chainId: BASE_CHAIN_ID.toString(),
    sellToken,
    buyToken: CRTV_TOKEN_ADDRESSES[8453],
    sellAmount,
    taker,
    slippageBps: slippageBps.toString(),
  })

  const response = await fetch(`${ZERO_X_BASE_URL}?${params.toString()}`, {
    headers: {
      "0x-api-key": apiKey,
      "0x-version": "v2",
    },
    cache: "no-store",
  })

  const body = await response.json()
  if (!response.ok) throw new Error(body?.message || "Unable to quote CRTV swap")

  return normalizeZeroXQuote(body)
}

export function createSwapErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to quote CRTV swap"
  const isMissingKey = message === "Missing ZEROX_API_KEY"
  const isNoLiquidity = /liquidity/i.test(message)
  const status = isMissingKey || isNoLiquidity ? 503 : 400
  const code = isMissingKey
    ? "MISSING_API_KEY"
    : isNoLiquidity
      ? "NO_LIQUIDITY"
      : "QUOTE_FAILED"

  return NextResponse.json({ error: message, code }, { status })
}

function isSupportedSellToken(sellToken: string): boolean {
  const normalizedSellToken = sellToken.toLowerCase()

  return [
    BASE_USDC_ADDRESS.toLowerCase(),
    BASE_WETH_ADDRESS.toLowerCase(),
    NATIVE_ETH_ADDRESS,
  ].includes(normalizedSellToken)
}

function normalizeZeroXQuote(quote: unknown): CrtvSwapQuote {
  if (!isRecord(quote)) throw new Error("Swap quote was incomplete")
  if (quote.liquidityAvailable === false) throw new Error("No CRTV swap liquidity is available for this amount")

  const transaction = quote.transaction || {}
  if (!isRecord(transaction)) throw new Error("Swap quote was incomplete")

  const allowanceTarget =
    getString(quote.allowanceTarget) ||
    getString(getRecord(quote.issues)?.allowance, "spender") ||
    getString(transaction.to)

  const buyAmount = getRequiredDecimalString(quote.buyAmount)
  const sellAmount = getRequiredDecimalString(quote.sellAmount)
  const price = getString(quote.price)
  const to = getString(transaction.to) || getString(quote.to)
  const data = getString(transaction.data) || getString(quote.data)
  const value = getDecimalString(transaction.value) || getDecimalString(quote.value) || "0"

  if (!to || !data) throw new Error("Swap quote was incomplete")

  return {
    buyAmount,
    sellAmount,
    price,
    guaranteedPrice: getString(quote.guaranteedPrice),
    route: quote.route,
    transaction: {
      to,
      data,
      value,
      gas: getDecimalString(transaction.gas) || getDecimalString(quote.gas),
      gasPrice: getDecimalString(transaction.gasPrice) || getDecimalString(quote.gasPrice),
    },
    allowanceTarget,
    issues: getQuoteIssues(quote.issues),
  }
}

function getRequiredDecimalString(value: unknown) {
  const decimalString = getDecimalString(value)
  if (!decimalString) throw new Error("Swap quote was incomplete")

  return decimalString
}

function getDecimalString(value: unknown) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return undefined

  return value
}

function getString(value: unknown): string | undefined
function getString(source: unknown, key: string): string | undefined
function getString(source: unknown, key?: string) {
  const value = key ? getRecord(source)?.[key] : source
  if (typeof value !== "string" || !value) return undefined

  return value
}

function getRecord(value: unknown) {
  if (!isRecord(value)) return undefined

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function getQuoteIssues(value: unknown): CrtvSwapQuote["issues"] | undefined {
  if (!isRecord(value)) return undefined

  return value as CrtvSwapQuote["issues"]
}
