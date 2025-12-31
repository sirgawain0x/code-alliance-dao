export interface FeaturedDao {
    chainId: string
    address: string
    label: string
    fallbackIcon: string
    description?: string
    link?: string
    hideMembers?: boolean
}

export const FEATURED_DAOS_CONFIG: FeaturedDao[] = [
    {
        chainId: "0x2105",
        address: "0x95c041ade16243665085323ad845051de57d78b1",
        label: "Base Yeeter",
        fallbackIcon: "🎯",
    },
    {
        chainId: "0x89",
        address: "0x9da29b87c2471feb00b931498919dc22340c8489",
        label: "Polygon DAO",
        fallbackIcon: "🟣",
    },
    {
        chainId: "0xa4b1",
        address: "0x880f006886af9eec4e219b7c9d0467bba0f16c06",
        label: "Arbitrum DAO",
        fallbackIcon: "🔵",
    },
    {
        chainId: "0xa",
        address: "0x61df03ea299790984c3619d734c81912a4710107",
        label: "Optimism DAO",
        fallbackIcon: "🔴",
    },
    {
        chainId: "0xa",
        address: "0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02",
        label: "Creative Kidz",
        fallbackIcon: "🎨",
        description:
            "The future is here, and it's a beautiful sight. At Creative Organization DAO we want to help fuel this innovative process by providing underserved children with access to the tools they need for creative expression and art, such as tablets, digital pencils, and software.",
        link: "https://nouns.build/dao/optimism/0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02/22",
        hideMembers: true,
    },
    {
        chainId: "0x1",
        address: "0x5da6ae3d2cce42dd0b805b0bc3befeab0e0b9cca",
        label: "Creative Kidz",
        fallbackIcon: "🎨",
        description:
            "The future is here, and it's a beautiful sight. At Creative Organization DAO we want to help fuel this innovative process by providing underserved children with access to the tools they need for creative expression and art, such as tablets, digital pencils, and software.",
        link: "https://nouns.build/dao/ethereum/0x5da6ae3d2cce42dd0b805b0bc3befeab0e0b9cca/23",
        hideMembers: true,
    },
]

export const CHAIN_NAMES: Record<string, string> = {
    "0x2105": "Base",
    "0x89": "Polygon",
    "0xa4b1": "Arbitrum",
    "0xa": "Optimism",
    "0x1": "Mainnet",
}
