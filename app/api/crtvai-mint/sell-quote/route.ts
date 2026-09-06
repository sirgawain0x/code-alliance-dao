import { NextResponse } from "next/server"

import { createCrtvaiMintErrorResponse, getCrtvaiSellQuote } from "@/services/crtvai-mint"

export async function POST(request: Request) {
  let body: { metokenAmount?: string; sender?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const metokenAmount = body.metokenAmount
  const sender = body.sender

  if (!metokenAmount || !/^\d+$/.test(metokenAmount)) {
    return NextResponse.json(
      { error: "Missing or invalid metokenAmount (wei, 18 decimals)" },
      { status: 400 },
    )
  }

  if (!sender || !/^0x[a-fA-F0-9]{40}$/.test(sender)) {
    return NextResponse.json(
      { error: "Missing or invalid sender address" },
      { status: 400 },
    )
  }

  try {
    const quote = await getCrtvaiSellQuote(BigInt(metokenAmount), sender)

    return NextResponse.json(quote, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Failed to fetch CRTVAI sell quote", error)

    return createCrtvaiMintErrorResponse(error, "sell")
  }
}
