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
  price: string
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
  const apiKey = process.env.ZEROX_API_KEY || process.env.NEXT_PUBLIC_ZEROX_API_KEY
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
  const status = message === "Missing ZEROX_API_KEY" ? 503 : 400

  return NextResponse.json({ error: message }, { status })
}

function isSupportedSellToken(sellToken: string): boolean {
  const normalizedSellToken = sellToken.toLowerCase()

  return [
    BASE_USDC_ADDRESS.toLowerCase(),
    BASE_WETH_ADDRESS.toLowerCase(),
    NATIVE_ETH_ADDRESS,
  ].includes(normalizedSellToken)
}

function normalizeZeroXQuote(quote: any): CrtvSwapQuote {
  const transaction = quote.transaction || {}
  const allowanceTarget =
    quote.allowanceTarget ||
    quote.issues?.allowance?.spender ||
    transaction.to

  return {
    buyAmount: quote.buyAmount,
    sellAmount: quote.sellAmount,
    price: quote.price,
    guaranteedPrice: quote.guaranteedPrice,
    route: quote.route,
    transaction: {
      to: transaction.to || quote.to,
      data: transaction.data || quote.data,
      value: transaction.value || quote.value || "0",
      gas: transaction.gas || quote.gas,
      gasPrice: transaction.gasPrice || quote.gasPrice,
    },
    allowanceTarget,
    issues: quote.issues,
  }
}
