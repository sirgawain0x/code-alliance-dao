import { NextResponse } from "next/server"

import { getKidzAuctionCacheVersion } from "@/lib/kidz-auction-cache"
import { findKidzAuctionTarget } from "@/lib/kidz-auction-config"
import { getKidzAuctionSnapshot } from "@/services/kidz-auction"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get("chainId")
    const auctionHouseAddress = searchParams.get("auctionHouseAddress")
    const versionOnly = searchParams.get("versionOnly") === "1"

    if (versionOnly) {
      return NextResponse.json(
        {
          version: getKidzAuctionCacheVersion(),
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      )
    }

    if (!chainId || !auctionHouseAddress) {
      return NextResponse.json(
        { error: "Missing chainId or auctionHouseAddress" },
        { status: 400 }
      )
    }

    const target = findKidzAuctionTarget({ chainId, auctionHouseAddress })
    if (!target) {
      return NextResponse.json(
        { error: "Unsupported Kidz auction target" },
        { status: 404 }
      )
    }

    const entry = await getKidzAuctionSnapshot({
      chainId: target.chainId,
      auctionHouseAddress: target.auctionHouseAddress,
    })

    if (!entry) {
      return NextResponse.json(
        { error: "Unable to load Kidz auction snapshot" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        version: getKidzAuctionCacheVersion(),
        chainId: entry.chainIdHex,
        auctionHouseAddress: entry.auctionHouseAddress,
        updatedAt: entry.updatedAt,
        auction: entry.snapshot,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch Kidz auction snapshot", error)

    return NextResponse.json(
      { error: "Unable to fetch Kidz auction snapshot" },
      { status: 500 }
    )
  }
}
