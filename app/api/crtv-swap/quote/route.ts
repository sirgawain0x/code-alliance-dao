import { NextResponse } from "next/server"

import { BASE_USDC_ADDRESS } from "@/config/constants"
import { createSwapErrorResponse, getCrtvSwapQuote } from "@/services/crtv-swap"

export async function POST(request: Request) {
  const body = await request.json()
  const sellToken = body.sellToken || BASE_USDC_ADDRESS
  const sellAmount = body.sellAmount
  const taker = body.taker
  const slippageBps = Number(body.slippageBps || 50)

  if (!sellAmount || !taker) {
    return NextResponse.json(
      { error: "Missing sellAmount or taker" },
      { status: 400 }
    )
  }

  try {
    const quote = await getCrtvSwapQuote({
      sellToken,
      sellAmount,
      taker,
      slippageBps,
    })

    return NextResponse.json(quote, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Failed to fetch CRTV swap quote", error)

    return createSwapErrorResponse(error)
  }
}
