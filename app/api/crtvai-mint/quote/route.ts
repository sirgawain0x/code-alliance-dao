import { NextResponse } from "next/server"

import { createCrtvaiQuoteErrorResponse, getCrtvaiMintQuote } from "@/services/crtvai-mint"

export async function POST(request: Request) {
  let body: { usdcAmount?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

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

    return createCrtvaiQuoteErrorResponse(error, "mint")
  }
}
