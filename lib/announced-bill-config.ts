/** Optimism (chain id 10) — Announced Bill / Creative Kidz Nouns Builder contracts. */

export interface AnnouncedBillContracts {
  chainId: number
  nft: string
  auction: string
  governor: string
  treasury: string
  metadata: string
}

const DEFAULT_CONTRACTS: AnnouncedBillContracts = {
  chainId: 10,
  nft: "0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02",
  auction: "0x122455e85e1484b299966795c748d0c5e4d1b7f1",
  governor: "0xaa42c1e7e767cefcd41536aa73e03bdf16cf1c34",
  treasury: "0x85a56a9572145260d40e8d8f55c8468c18773da0",
  metadata: "0x0498d07048e879069c0ab9acc8c4ac7f17c33a22",
}

function readAddress(envValue: string | undefined, fallback: string): string {
  const trimmed = envValue?.trim()
  if (!trimmed) return fallback
  return trimmed.toLowerCase()
}

export function getAnnouncedBillContracts(): AnnouncedBillContracts {
  return {
    chainId: Number(process.env.NEXT_PUBLIC_ANNOUNCED_BILL_CHAIN_ID || DEFAULT_CONTRACTS.chainId),
    nft: readAddress(process.env.NEXT_PUBLIC_ANNOUNCED_BILL_NFT_ADDRESS, DEFAULT_CONTRACTS.nft),
    auction: readAddress(
      process.env.NEXT_PUBLIC_ANNOUNCED_BILL_AUCTION_ADDRESS,
      DEFAULT_CONTRACTS.auction
    ),
    governor: readAddress(
      process.env.NEXT_PUBLIC_ANNOUNCED_BILL_GOVERNOR_ADDRESS,
      DEFAULT_CONTRACTS.governor
    ),
    treasury: readAddress(
      process.env.NEXT_PUBLIC_ANNOUNCED_BILL_TREASURY_ADDRESS,
      DEFAULT_CONTRACTS.treasury
    ),
    metadata: readAddress(
      process.env.NEXT_PUBLIC_ANNOUNCED_BILL_METADATA_ADDRESS,
      DEFAULT_CONTRACTS.metadata
    ),
  }
}

export const ANNOUNCED_BILL_MISSION =
  "Announced Bill supports underserved children with digital art tools funded by Creative Kidz Nouns auctions and partnerships including T-Mobile. Explore projects at kidz.creativeplatform.xyz."

export const ANNOUNCED_BILL_PUBLIC_SITE = "https://kidz.creativeplatform.xyz"

export const CREATIVE_KIDZ_RENDERER_URL =
  "https://api.zora.co/renderer/stack-images"

export const ANNOUNCED_BILL_VETOER = "0x1fde40a4046eda0ca0539dd6c77abf8933b94260"
