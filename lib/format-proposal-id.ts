export function getProposalDisplayId(id: string): string {
  const suffix = id.split("-").pop()
  if (suffix && /^\d+$/.test(suffix)) return `#${suffix}`

  if (id.length <= 18) return id

  return `${id.slice(0, 6)}…${id.slice(-4)}`
}
