import { formatUnits } from "ethers"

export function formatShareVotes(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  try {
    return Number(formatUnits(String(value), 18))
  } catch {
    return Number(value) || 0
  }
}

export function formatShareVotesDisplay(value: string | number | undefined): string {
  return formatShareVotes(value).toLocaleString()
}
