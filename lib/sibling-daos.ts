import { CREATIVE_ORG_BAAL_ADDRESS, CREATIVE_ORG_SAFE_ADDRESS } from "@/config/constants"
import {
  ANNOUNCED_BILL_MISSION,
  ANNOUNCED_BILL_PUBLIC_SITE,
  getAnnouncedBillContracts,
} from "@/lib/announced-bill-config"
import { resolveTargetDaoAddress } from "@/lib/dao-ids"

export type SiblingDaoKind = "baal" | "nouns"

export interface SiblingDao {
  id: string
  publicName: string
  tokenCollectionName?: string
  chainId: number
  chainLabel: string
  kind: SiblingDaoKind
  daoAddress: string
  publicSiteUrl?: string
  mission: string
  governorAddress?: string
  nftAddress?: string
  auctionAddress?: string
  treasuryAddress?: string
  metadataAddress?: string
  safeAddress?: string
}

const announcedBill = getAnnouncedBillContracts()

export const SIBLING_DAOS: SiblingDao[] = [
  {
    id: "creative-org",
    publicName: "Creative Org",
    chainId: 8453,
    chainLabel: "Base",
    kind: "baal",
    daoAddress: resolveTargetDaoAddress() || CREATIVE_ORG_BAAL_ADDRESS,
    mission:
      "Professional infrastructure and B2B rails that help artists and creators build sustainable enterprises.",
    safeAddress: CREATIVE_ORG_SAFE_ADDRESS,
  },
  {
    id: "announced-bill",
    publicName: "Announced Bill",
    tokenCollectionName: "Creative Kidz",
    chainId: announcedBill.chainId,
    chainLabel: "Optimism",
    kind: "nouns",
    daoAddress: announcedBill.treasury,
    publicSiteUrl: ANNOUNCED_BILL_PUBLIC_SITE,
    mission: ANNOUNCED_BILL_MISSION,
    governorAddress: announcedBill.governor,
    nftAddress: announcedBill.nft,
    auctionAddress: announcedBill.auction,
    treasuryAddress: announcedBill.treasury,
    metadataAddress: announcedBill.metadata,
  },
]

export const DEFAULT_SIBLING_DAO_ID = "creative-org"

export function getSiblingDaoById(id: string): SiblingDao | undefined {
  return SIBLING_DAOS.find((dao) => dao.id === id)
}

export function getDefaultSiblingDao(): SiblingDao {
  return getSiblingDaoById(DEFAULT_SIBLING_DAO_ID) ?? SIBLING_DAOS[0]
}
