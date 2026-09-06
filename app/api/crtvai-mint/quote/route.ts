import { NextResponse } from "next/server"

import { createCrtvaiMintErrorResponse, getCrtvaiMintQuote } from "@/services/crtvai-mint"

export async function POST(request: Request) {
  const body = await request.json()
  const usdcAmount = body.usdcAmount

  if (!usdcAmount || !/^\d+$/.test(usdcAmount)) {
    return NextResponse.json(
      { error: "Missing or invalid usdcAmount (wei, 6 decimals)" },
      { status: 400 },
    )
  }

  try {
    const quote = await getCrtvaiMintQuote(BigInt(usdcAmount))

    return NextResponse.json(quote, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Failed to fetch CRTVAI mint quote", error)

    return createCrtvaiMintErrorResponse(error)
  }
}
