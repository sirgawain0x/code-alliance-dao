import { createHmac, timingSafeEqual } from "crypto"

export interface AlchemyWebhookPayload {
  webhookId?: string
  id?: string
  createdAt?: string
  type?: string
  event?: {
    network?: string
    activity?: Array<{
      fromAddress?: string
      toAddress?: string
      contractAddress?: string
      hash?: string
      category?: string
    }>
  }
}

function getConfiguredSigningKeys(): string[] {
  return [
    process.env.ALCHEMY_KIDZ_AUCTION_WEBHOOK_SIGNING_KEY,
    process.env.ALCHEMY_KIDZ_AUCTION_WEBHOOK_SIGNING_KEY_OP,
    process.env.ALCHEMY_KIDZ_AUCTION_WEBHOOK_SIGNING_KEY_MAINNET,
  ].filter((value): value is string => Boolean(value))
}

export function verifyAlchemyWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string
  signature: string | null
}): boolean {
  if (!signature) return false

  const signingKeys = getConfiguredSigningKeys()
  if (signingKeys.length === 0) return false

  return signingKeys.some((signingKey) => {
    const digest = createHmac("sha256", signingKey)
      .update(rawBody, "utf8")
      .digest("hex")

    try {
      return timingSafeEqual(
        Buffer.from(signature, "utf8"),
        Buffer.from(digest, "utf8")
      )
    } catch {
      return false
    }
  })
}

export function parseAlchemyWebhookPayload(rawBody: string): AlchemyWebhookPayload {
  return JSON.parse(rawBody) as AlchemyWebhookPayload
}
