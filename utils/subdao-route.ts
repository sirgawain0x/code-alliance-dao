/** Parse `/subdaos/[id]` param into chain + Moloch DAO id for subgraph hooks. */
export interface ParsedSubDaoRoute {
  chainid: string
  daoid: string
}

function isLikelyDaoAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim())
}

/** Accepts `0x2105_0xabc...`, `8453-0xabc...`, or plain `0x...` (defaults to Base 8453). */
export function parseSubDaoRoute(subDAOId: string): ParsedSubDaoRoute | null {
  const raw = decodeURIComponent(subDAOId || "").trim()
  if (!raw) return null

  const underscore = raw.indexOf("_")
  if (underscore > 0) {
    const chainPart = raw.slice(0, underscore)
    const addr = raw.slice(underscore + 1)
    if (!isLikelyDaoAddress(addr)) return null
    return { chainid: chainPart, daoid: addr.toLowerCase() }
  }

  const dash = raw.indexOf("-")
  if (dash > 0) {
    const chainPart = raw.slice(0, dash)
    const addr = raw.slice(dash + 1)
    if (!isLikelyDaoAddress(addr)) return null
    return { chainid: chainPart, daoid: addr.toLowerCase() }
  }

  if (isLikelyDaoAddress(raw)) return { chainid: "8453", daoid: raw.toLowerCase() }

  return null
}

export function formatSubDaoPath(chainid: string, daoid: string): string {
  const hex = chainid.toLowerCase().startsWith("0x")
    ? chainid.toLowerCase()
    : `0x${parseInt(chainid, 10).toString(16)}`
  return `${hex}_${daoid.toLowerCase()}`
}

/** Decimal chain id for hooks that expect `"8453"` (e.g. Sequence indexer). */
export function chainidForHooks(chainPart: string): string {
  if (!chainPart) return "8453"
  if (chainPart.toLowerCase().startsWith("0x")) return String(parseInt(chainPart, 16))
  return chainPart
}
