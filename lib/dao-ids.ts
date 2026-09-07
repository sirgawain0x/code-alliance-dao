/** Base mainnet chain id in subgraph hex form. */
export const BASE_SUBGRAPH_CHAIN_HEX = "0x2105"

export function normalizeChainIdToDecimal(chainIdFragment?: string): string {
  if (!chainIdFragment) return ""
  const trimmed = chainIdFragment.trim()
  if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) {
    const parsed = parseInt(trimmed, 16)
    return Number.isNaN(parsed) ? "" : String(parsed)
  }
  return trimmed
}

function isEvmAddress(value?: string): boolean {
  return Boolean(value && /^0x[a-fA-F0-9]{40}$/.test(value))
}

/**
 * Parse a DAOhaus subgraph dao id.
 * Supports `0x2105-0xbaal...` and plain `0xbaal...` (Base Creative Org uses the latter).
 */
export function parseDaoSubgraphId(
  daoId?: string,
  fallbackChainId = "8453"
): { chainId: string; daoAddress: string } {
  if (!daoId) return { chainId: fallbackChainId, daoAddress: "" }

  const trimmed = daoId.trim()
  const hyphenIndex = trimmed.indexOf("-")

  if (hyphenIndex > 0) {
    const chainPart = trimmed.slice(0, hyphenIndex)
    const addressPart = trimmed.slice(hyphenIndex + 1)

    if (isEvmAddress(addressPart)) {
      return {
        chainId: normalizeChainIdToDecimal(chainPart) || fallbackChainId,
        daoAddress: addressPart.toLowerCase(),
      }
    }
  }

  if (isEvmAddress(trimmed)) {
    return { chainId: fallbackChainId, daoAddress: trimmed.toLowerCase() }
  }

  return { chainId: fallbackChainId, daoAddress: trimmed.toLowerCase() }
}

export function buildMemberSubgraphId({
  daoId,
  memberAddress,
  fallbackChainId = "8453",
}: {
  daoId?: string
  memberAddress?: string
  fallbackChainId?: string
}): string {
  if (!memberAddress) return ""

  const normalizedMember = memberAddress.toLowerCase()
  const trimmedDaoId = daoId?.trim().toLowerCase()

  if (trimmedDaoId?.includes("-member-")) return trimmedDaoId

  if (trimmedDaoId) {
    return `${trimmedDaoId}-member-${normalizedMember}`
  }

  return ""
}

export function resolveTargetDaoAddress(
  envAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
): string | undefined {
  const trimmed = envAddress?.trim().toLowerCase()
  return trimmed || undefined
}

export function profileMatchesTargetDao({
  profileDaoAddress,
  profileDaoId,
  targetDaoAddress,
  safeAddress,
}: {
  profileDaoAddress?: string
  profileDaoId?: string
  targetDaoAddress?: string
  safeAddress?: string
}): boolean {
  if (!targetDaoAddress) return true

  const target = targetDaoAddress.toLowerCase()
  const candidates = new Set<string>()

  if (profileDaoAddress) candidates.add(profileDaoAddress.toLowerCase())
  if (profileDaoId) {
    candidates.add(profileDaoId.toLowerCase())
    candidates.add(parseDaoSubgraphId(profileDaoId).daoAddress)
  }
  if (safeAddress) candidates.add(safeAddress.toLowerCase())

  return candidates.has(target)
}
