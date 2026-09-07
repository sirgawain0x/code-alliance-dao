const CREATIVE_PLATFORM_TYPO = /creativeplatfom\.xyz/gi
const CREATIVE_PLATFORM_CORRECT = "creativeplatform.xyz"

export interface ParsedProposalCopy {
  title: string
  body: string
}

export function sanitizePublicCopy(text: string): string {
  return text.replace(CREATIVE_PLATFORM_TYPO, CREATIVE_PLATFORM_CORRECT)
}

export function parseNounsProposalDescription(description?: string | null): ParsedProposalCopy {
  if (!description?.trim()) {
    return { title: "Untitled proposal", body: "" }
  }

  const sanitized = sanitizePublicCopy(description.trim())
  const lines = sanitized.split("\n")
  const firstLine = lines[0]?.trim() ?? ""

  const markdownTitle = firstLine.match(/^#\s+(.+)/)?.[1]?.trim()
  if (markdownTitle) {
    return {
      title: markdownTitle,
      body: sanitizePublicCopy(lines.slice(1).join("\n").trim()),
    }
  }

  const firstSentence = sanitized.split(/\n\n/)[0]?.trim() ?? sanitized
  const title = firstSentence.length > 120 ? `${firstSentence.slice(0, 117)}...` : firstSentence

  return {
    title,
    body: sanitized,
  }
}

export function resolveNounsProposalTitle({
  title,
  description,
  proposalNumber,
}: {
  title?: string | null
  description?: string | null
  proposalNumber?: number | string
}): string {
  const trimmedTitle = title?.trim()
  if (trimmedTitle) return sanitizePublicCopy(trimmedTitle)

  const parsed = parseNounsProposalDescription(description)
  if (parsed.title !== "Untitled proposal") return parsed.title

  if (proposalNumber !== undefined) return `Proposal ${proposalNumber}`
  return "Untitled proposal"
}

export function resolveNounsProposalBody({
  description,
  metadata,
}: {
  description?: string | null
  metadata?: string | null
}): string {
  const source = description?.trim() || metadata?.trim() || ""
  return sanitizePublicCopy(source)
}
