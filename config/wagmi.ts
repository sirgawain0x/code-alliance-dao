'use client'

import { cookieStorage, createStorage, http } from 'wagmi'
import { base, polygon, optimism } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'
import { createConfig, type Config } from 'wagmi'

// Get projectId from environment variables
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
    throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined')
}

// Create Wagmi config factory - only creates config on client side
let configInstance: Config | null = null

export function getConfig(): Config {
    // Only create config on client side to avoid indexedDB access during SSR
    if (typeof window === 'undefined') {
        // For SSR, return a minimal config without connectors
        // This prevents walletConnect from trying to access indexedDB
        return createConfig({
            chains: [base, polygon, optimism],
            connectors: [],
            storage: createStorage({
                storage: cookieStorage,
            }),
            ssr: true,
            transports: {
                [base.id]: http(),
                [polygon.id]: http(),
                [optimism.id]: http(),
            },
        }) as Config
    }

    // Create full config with connectors only on client side
    if (!configInstance) {
        // projectId is guaranteed to be defined due to check at module level
        if (!projectId) {
            throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined')
        }
        try {
            configInstance = createConfig({
                chains: [base, polygon, optimism],
                connectors: [
                    walletConnect({ projectId, showQrModal: false, metadata: { name: 'Creative Organization DAO', description: 'Creative Organization DAO', url: window.location.origin, icons: [] } }),
                    injected(),
                ],
                storage: createStorage({
                    storage: cookieStorage,
                }),
                ssr: true,
                transports: {
                    [base.id]: http(),
                    [polygon.id]: http(),
                    [optimism.id]: http(),
                },
            }) as Config
        } catch (error) {
            // Fallback to minimal config if connector initialization fails
            console.warn('Failed to initialize wallet connectors:', error)
            configInstance = createConfig({
                chains: [base, polygon, optimism],
                connectors: [],
                storage: createStorage({
                    storage: cookieStorage,
                }),
                ssr: true,
                transports: {
                    [base.id]: http(),
                    [polygon.id]: http(),
                    [optimism.id]: http(),
                },
            }) as Config
        }
    }

    return configInstance
}
