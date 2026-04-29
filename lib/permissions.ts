export interface MembershipCapabilities {
  canViewDao: boolean
  canVote: boolean
  canCreateProposal: boolean
  canManageMembers: boolean
  canViewTreasury: boolean
}

export type CapabilityKey = keyof MembershipCapabilities

export interface MembershipHoldings {
  shares: number
  loot: number
  nftBalance: number
}

export interface MembershipRoleSource {
  adminSource: "owner" | "summoner" | "none"
  ownerAddress?: string
}

export interface MembershipProfile {
  daoId: string
  chainId: string
  daoAddress: string
  isMember: boolean
  isVotingMember: boolean
  isNonVotingMember: boolean
  isAdmin: boolean
  capabilities: MembershipCapabilities
  holdings: MembershipHoldings
  sources: MembershipRoleSource
}

export interface RoleSourceResolverInput {
  memberAddress: string
  ownerAddress?: string
  daoSummonerAddress?: string
}

export interface RoleSourceResolver {
  resolveAdminStatus: (input: RoleSourceResolverInput) => MembershipRoleSource
}

function normalizeAddress(address?: string): string {
  return address?.toLowerCase() || ""
}

export const onchainOwnerSummonerResolver: RoleSourceResolver = {
  resolveAdminStatus: ({ memberAddress, ownerAddress, daoSummonerAddress }) => {
    const normalizedMemberAddress = normalizeAddress(memberAddress)
    const normalizedOwnerAddress = normalizeAddress(ownerAddress)
    const normalizedSummonerAddress = normalizeAddress(daoSummonerAddress)

    if (
      normalizedOwnerAddress &&
      normalizedMemberAddress === normalizedOwnerAddress
    ) {
      return {
        adminSource: "owner",
        ownerAddress: ownerAddress,
      }
    }

    if (
      normalizedSummonerAddress &&
      normalizedMemberAddress === normalizedSummonerAddress
    ) {
      return {
        adminSource: "summoner",
        ownerAddress: daoSummonerAddress,
      }
    }

    return {
      adminSource: "none",
    }
  },
}

export function getCapabilities({
  isMember,
  isVotingMember,
  isAdmin,
}: {
  isMember: boolean
  isVotingMember: boolean
  isAdmin: boolean
}): MembershipCapabilities {
  return {
    canViewDao: true,
    canVote: isVotingMember,
    canCreateProposal: isVotingMember || isAdmin,
    canManageMembers: isAdmin,
    canViewTreasury: isMember || isAdmin,
  }
}

export function hasCapability({
  profile,
  capability,
}: {
  profile?: MembershipProfile
  capability: CapabilityKey
}): boolean {
  if (!profile) return false
  return Boolean(profile.capabilities[capability])
}
