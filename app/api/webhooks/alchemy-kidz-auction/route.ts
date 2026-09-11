import { NextResponse } from "next/server"

import {
  parseAlchemyWebhookPayload,
  verifyAlchemyWebhookSignature,
} from "@/lib/alchemy-webhook"
import { findKidzAuctionTargetsForNetwork } from "@/lib/kidz-auction-config"
import { refreshKidzAuctionsForNetwork } from "@/services/kidz-auction"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-alchemy-signature")

    if (!verifyAlchemyWebhookSignature({ rawBody, signature })) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const payload = parseAlchemyWebhookPayload(rawBody)
    const network = payload.event?.network
    const targets = findKidzAuctionTargetsForNetwork(network)

    if (targets.length === 0) {
      return NextResponse.json({ ok: true, refreshed: 0 })
    }

    const refreshedEntries = await refreshKidzAuctionsForNetwork(network)

    return NextResponse.json({
      ok: true,
      webhookType: payload.type,
      network,
      refreshed: refreshedEntries.length,
      updatedAt: refreshedEntries[0]?.updatedAt,
    })
  } catch (error) {
    console.error("Failed to process Alchemy Kidz auction webhook", error)

    return NextResponse.json(
      { error: "Unable to process Alchemy Kidz auction webhook" },
      { status: 500 }
    )
  }
}
