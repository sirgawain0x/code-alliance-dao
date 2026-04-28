import { NextResponse } from "next/server"

import { getSubDaoAggregateStats } from "@/services/subdao-stats"

export const revalidate = 0

export async function GET() {
  try {
    const stats = await getSubDaoAggregateStats()

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Failed to fetch SubDAO aggregate stats", error)

    return NextResponse.json(
      { error: "Unable to fetch live SubDAO stats" },
      { status: 500 }
    )
  }
}
