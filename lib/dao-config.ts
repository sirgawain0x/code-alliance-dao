import {
  CREATIVE_ORG_BAAL_ADDRESS,
  CREATIVE_ORG_LOOT_ADDRESS,
  CREATIVE_ORG_SAFE_ADDRESS,
  CREATIVE_ORG_SHARES_ADDRESS,
} from "@/config/constants"

export interface DaoContractConfig {
  chainId: string
  daoAddress: string
  name: string
  nftAddress?: string
  governorAddress?: string
  auctionHouseAddress?: string
  treasuryAddress?: string
  metadataAddress?: string
  ownerReadAddress?: string
  sharesAddress?: string
  lootAddress?: string
}

const DAO_CONFIGS: DaoContractConfig[] = [
  {
    chainId: "8453",
    daoAddress: CREATIVE_ORG_BAAL_ADDRESS,
    name: "Creative Org DAO",
    treasuryAddress: CREATIVE_ORG_SAFE_ADDRESS,
    sharesAddress: CREATIVE_ORG_SHARES_ADDRESS,
    lootAddress: CREATIVE_ORG_LOOT_ADDRESS,
    ownerReadAddress: CREATIVE_ORG_BAAL_ADDRESS,
  },
  {
    chainId: "10",
    daoAddress: "0x85a56a9572145260d40e8d8f55c8468c18773da0",
    name: "Announced Bill",
    nftAddress: "0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02",
    auctionHouseAddress: "0x122455e85e1484b299966795c748d0c5e4d1b7f1",
    governorAddress: "0xaa42c1e7e767cefcd41536aa73e03bdf16cf1c34",
    treasuryAddress: "0x85a56a9572145260d40e8d8f55c8468c18773da0",
    metadataAddress: "0x0498d07048e879069c0ab9acc8c4ac7f17c33a22",
    ownerReadAddress: "0xaa42c1e7e767cefcd41536aa73e03bdf16cf1c34",
  },
]

function normalizeAddress(address?: string): string {
  return address?.toLowerCase() || ""
}

export function getDaoContractConfig({
  chainId,
  daoAddress,
}: {
  chainId?: string
  daoAddress?: string
}): DaoContractConfig | undefined {
  const normalizedDaoAddress = normalizeAddress(daoAddress)
  if (!chainId || !normalizedDaoAddress) return undefined

  return DAO_CONFIGS.find(
    (config) =>
      config.chainId === chainId &&
      normalizeAddress(config.daoAddress) === normalizedDaoAddress
  )
}

export function getSupportedDaoConfigs(): DaoContractConfig[] {
  return DAO_CONFIGS
}
