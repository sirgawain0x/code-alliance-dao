export function getProposalDisplayId(id: string): string {
  if (!id) return "—"

  const proposalIdMatch = id.match(/-proposal-(\d+)$/)
  if (proposalIdMatch) return `#${proposalIdMatch[1]}`

  const suffix = id.split("-").pop()
  if (suffix && /^\d+$/.test(suffix)) return `#${suffix}`

  if (id.length <= 18) return id

  return `${id.slice(0, 6)}...${id.slice(-4)}`
}
