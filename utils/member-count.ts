const MEMBER_COUNT_SCALE = 10n ** 18n
const MEMBER_COUNT_NORMALIZE_THRESHOLD = 10n ** 15n

export function normalizeTotalSupplyMemberCount(totalSupply: bigint): number {
  if (totalSupply === 0n) return 0

  // Nouns-style governance tokens store supply with 18 decimals.
  if (totalSupply >= MEMBER_COUNT_NORMALIZE_THRESHOLD) {
    return Number(totalSupply / MEMBER_COUNT_SCALE)
  }

  return Number(totalSupply)
}
