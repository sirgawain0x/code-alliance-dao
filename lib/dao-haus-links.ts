/** DAOhaus Admin uses hex chain id in URLs (Base mainnet). */
export const DAOHAUS_BASE_CHAIN_HEX = "0x2105" as const

const ADMIN_ORIGIN = "https://admin.daohaus.club"

function normalizeDaoAddress(daoAddress?: string): string | undefined {
  const trimmed = daoAddress?.trim().toLowerCase()
  return trimmed || undefined
}

/**
 * Proposals list in DAOhaus Admin; users start "New Proposal" from there.
 * @param daoAddress - Moloch v3 / Baal contract (defaults to NEXT_PUBLIC_TARGET_DAO_ADDRESS)
 */
export function getDaoHausAdminProposalsUrl(
  daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
): string | undefined {
  const trimmed = normalizeDaoAddress(daoAddress)
  if (!trimmed) return undefined
  return `${ADMIN_ORIGIN}/molochv3/${DAOHAUS_BASE_CHAIN_HEX}/${trimmed}/proposals`
}

export function getDaoHausAdminProposalUrl(
  proposalId: string,
  daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
): string | undefined {
  const trimmed = normalizeDaoAddress(daoAddress)
  if (!trimmed || !proposalId) return undefined
  return `${ADMIN_ORIGIN}/molochv3/${DAOHAUS_BASE_CHAIN_HEX}/${trimmed}/proposal/${proposalId}`
}

export function getDaoHausAdminMembersUrl(
  daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
): string | undefined {
  const trimmed = normalizeDaoAddress(daoAddress)
  if (!trimmed) return undefined
  return `${ADMIN_ORIGIN}/molochv3/${DAOHAUS_BASE_CHAIN_HEX}/${trimmed}/members`
}
