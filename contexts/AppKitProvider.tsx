'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, optimism, polygon, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CRTV_TOKEN_ADDRESSES } from '@/config/constants'
import type { ReactNode } from 'react'

// Set up queryClient
const queryClient = new QueryClient()

// Get metadata 
const metadata = {
    name: 'Creative Organization DAO',
    description: 'Creative Organization DAO Governance Platform',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://dao.creativeplatform.xyz',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create Ethers adapter
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'b56e18d47c72e2906fd4321949108048'

// Initialize AppKit
createAppKit({
    adapters: [new EthersAdapter()],
    networks: [base, polygon, optimism, mainnet],
    metadata,
    projectId,
    features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'github', 'discord', 'apple'],
        emailShowWallets: true,
        onramp: true,
        swaps: true
    },
    tokens: {
        'eip155:8453': {
            address: CRTV_TOKEN_ADDRESSES[8453],
            image: metadata.icons[0], // Use project icon
        },
        'eip155:137': {
            address: CRTV_TOKEN_ADDRESSES[137],
            image: metadata.icons[0],
        },
        'eip155:10': {
            address: CRTV_TOKEN_ADDRESSES[10],
            image: metadata.icons[0],
        }
    }
})

export function AppKitProvider({
    children,
    cookies
}: {
    children: ReactNode
    cookies: string | null
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
