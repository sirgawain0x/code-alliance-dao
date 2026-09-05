import { NextResponse } from "next/server"

import { CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import { getSafeTransactions } from "@/services/safe-transactions"

export const revalidate = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainId = searchParams.get("chainId") || "8453"
  const safeAddress = searchParams.get("safeAddress") || CREATIVE_ORG_SAFE_ADDRESS
  const limit = Number(searchParams.get("limit") || "20")

  try {
    const transactions = await getSafeTransactions({
      chainId,
      safeAddress,
      limit: Number.isFinite(limit) ? limit : 20,
    })

    return NextResponse.json(
      { transactions },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    )
  } catch (error) {
    console.error("Failed to fetch Safe transactions", error)

    return NextResponse.json(
      { transactions: [], error: "Unable to fetch Safe transactions" },
      { status: 500 }
    )
  }
}
