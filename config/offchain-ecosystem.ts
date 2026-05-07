export interface OffchainEcosystemProduct {
  id: string
  name: string
  description: string
  url: string
  category: string
  status: string
}

export const OFFCHAIN_ECOSYSTEM_PRODUCTS: OffchainEcosystemProduct[] = [
  {
    id: "creative-tv",
    name: "Creative TV",
    description:
      "The premier video streaming platform for the creative economy. Watch, create, and earn rewards while engaging with decentralized content.",
    url: "https://tv.creativeplatform.xyz",
    category: "Entertainment",
    status: "Live",
  },
  {
    id: "dear-creative",
    name: "Dear Creative",
    description:
      "Your source for the latest news, stories, and insights from the creative world. Stay updated with the pulse of the creator economy.",
    url: "https://news.creativeplatform.xyz",
    category: "Media & News",
    status: "Live",
  },
  {
    id: "creative-bank",
    name: "Creative Bank",
    description:
      "Comprehensive financial tools and banking services tailored for creators. Manage your assets, payments, and investments in one place.",
    url: "https://bank.creativeplatform.xyz",
    category: "DeFi & Finance",
    status: "Live",
  },
  {
    id: "bitrewards",
    name: "BitRewards",
    description:
      "A decentralized loyalty program rewarding engagement and creativity. Earn tokens for your contributions and redeem them for exclusive perks.",
    url: "https://rewards.creativeplatform.xyz",
    category: "Loyalty & Rewards",
    status: "Beta",
  },
  {
    id: "create",
    name: "Create",
    description:
      "Powerful tools for digital creation. Access a suite of resources to bring your artistic visions to life on the blockchain.",
    url: "https://create.creativeplatform.xyz",
    category: "Creator Tools",
    status: "Beta",
  },
  {
    id: "beat-me",
    name: "Beat Me",
    description:
      "Test your music knowledge and compete to win weekly USDC prize pots in this addictive music trivia miniapp.",
    url: "https://beatme.creativeplatform.xyz",
    category: "Gaming",
    status: "Live",
  },
]

export function getOffchainEcosystemProduct(id: string): OffchainEcosystemProduct | undefined {
  return OFFCHAIN_ECOSYSTEM_PRODUCTS.find((p) => p.id === id)
}
