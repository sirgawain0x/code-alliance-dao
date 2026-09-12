export interface KidzAuctionTarget {
  chainId: string
  chainIdHex: string
  auctionHouseAddress: string
  nftAddress: string
  alchemyNetwork: "OPT_MAINNET" | "ETH_MAINNET"
}

export const KIDZ_AUCTION_TARGETS: KidzAuctionTarget[] = [
  {
    chainId: "10",
    chainIdHex: "0xa",
    auctionHouseAddress: "0x122455e85e1484b299966795c748d0c5e4d1b7f1",
    nftAddress: "0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02",
    alchemyNetwork: "OPT_MAINNET",
  },
  {
    chainId: "1",
    chainIdHex: "0x1",
    auctionHouseAddress: "0xe5a84e4dee728ce28455cd1874743161a6f84167",
    nftAddress: "0x5da6ae3d2cce42dd0b805b0bc3befeab0e0b9cca",
    alchemyNetwork: "ETH_MAINNET",
  },
]

export const KIDZ_AUCTION_EVENT_TOPICS = {
  AuctionBid: "0x1159164c56f277e6fc99c11731bd380e0347deb969b75523398734c252706ea3",
  AuctionCreated: "0xa9c8dfcda5664a5a124c713e386da27de87432d5b668e79458501eb296389ba7",
  AuctionSettled: "0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99",
  AuctionExtended: "0x6e912a3a9105bdd2af817ba5adc14e6c127c1035b5b648faa29ca0d58ab8ff4e",
} as const

export function getKidzAuctionCacheKey({
  chainId,
  auctionHouseAddress,
}: {
  chainId: string
  auctionHouseAddress: string
}): string {
  const normalizedChainId = chainId.startsWith("0x")
    ? parseInt(chainId, 16).toString()
    : chainId
  return `${normalizedChainId}:${auctionHouseAddress.toLowerCase()}`
}

export function findKidzAuctionTarget({
  chainId,
  auctionHouseAddress,
}: {
  chainId?: string
  auctionHouseAddress?: string
}): KidzAuctionTarget | undefined {
  if (!chainId || !auctionHouseAddress) return undefined

  const cacheKey = getKidzAuctionCacheKey({ chainId, auctionHouseAddress })
  return KIDZ_AUCTION_TARGETS.find(
    (target) =>
      getKidzAuctionCacheKey({
        chainId: target.chainId,
        auctionHouseAddress: target.auctionHouseAddress,
      }) === cacheKey
  )
}

export function findKidzAuctionTargetsForNetwork(
  network?: string
): KidzAuctionTarget[] {
  if (!network) return KIDZ_AUCTION_TARGETS

  return KIDZ_AUCTION_TARGETS.filter((target) => target.alchemyNetwork === network)
}
