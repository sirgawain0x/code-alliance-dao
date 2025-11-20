'use client'

import { getConfig, projectId } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base } from '@reown/appkit/networks'
import React, { type ReactNode, useMemo, useEffect, useRef } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Filter out harmless Wagmi state restoration warnings
// This warning occurs when Wagmi restores state from storage and detects existing history
// It's safe to ignore and is a known behavior in Wagmi v3 during initialization
if (typeof window !== 'undefined') {
    const originalWarn = console.warn
    console.warn = (...args: unknown[]) => {
        // Check if this is the "Restore will override. history" warning
        const message = args[0]
        const isHistoryRestoreWarning = 
            (typeof message === 'string' && message.includes('Restore will override')) ||
            (typeof message === 'object' && message !== null && 
             'msg' in message && 
             typeof (message as { msg?: string }).msg === 'string' &&
             (message as { msg: string }).msg.includes('Restore will override')) ||
            (typeof message === 'object' && message !== null &&
             'context' in message &&
             (message as { context?: string }).context === 'core/history' &&
             'msg' in message &&
             typeof (message as { msg?: string }).msg === 'string' &&
             (message as { msg: string }).msg.includes('Restore will override'))
        
        // Suppress the harmless history restoration warning
        if (isHistoryRestoreWarning) {
            return // Don't log this warning
        }
        
        // Log all other warnings normally
        originalWarn.apply(console, args)
    }
}

// Get metadata - URL will be set dynamically based on current environment
function getMetadata() {
    if (typeof window === 'undefined') {
        // SSR fallback - will be updated on client
        return {
            name: 'Code Alliance DAO',
            description: 'Code Alliance DAO Governance Platform',
            url: 'https://code-alliance.com',
            icons: ['https://avatars.githubusercontent.com/u/179229932']
        }
    }
    
    return {
        name: 'Code Alliance DAO',
        description: 'Code Alliance DAO Governance Platform',
        url: window.location.origin, // Dynamically match current page URL
        icons: ['https://avatars.githubusercontent.com/u/179229932']
    }
}

// Singleton pattern for AppKit modal
let modal: ReturnType<typeof createAppKit> | null = null
let isInitializing = false

function getModal(): ReturnType<typeof createAppKit> | null {
    if (typeof window === 'undefined') return null
    
    // Return existing modal if already created
    if (modal) return modal
    
    // Prevent concurrent initialization attempts
    if (isInitializing) return null
    
    // Initialize AppKit when first accessed
    // Note: Reown AppKit automatically preloads its font (KHTeka-Medium.woff2) when initialized.
    // The font is only used when the modal opens, which may trigger a browser warning
    // about preloaded resources not being used immediately. This is expected behavior
    // and harmless - the font will be used when the user connects their wallet.
    if (projectId) {
        try {
            isInitializing = true
            modal = createAppKit({
                adapters: [],
                projectId,
                networks: [base],
                defaultNetwork: base,
                metadata: getMetadata(), // Use dynamic metadata with current URL
                features: {
                    analytics: true
                }
            })
            isInitializing = false
        } catch (error) {
            isInitializing = false
            console.warn('Failed to initialize AppKit modal:', error)
            return null
        }
    }
    
    return modal
}

export function AppKitProvider({
    children,
    cookies
}: {
    children: ReactNode
    cookies: string | null
}) {
    // Use ref to track if initialization has been attempted
    // This prevents double initialization in React Strict Mode
    const hasInitialized = useRef(false)

    // Get config on client side only
    const config = useMemo(() => getConfig(), [])
    const initialState = useMemo(() => {
        if (typeof window === 'undefined') return undefined
        return cookieToInitialState(config as Config, cookies)
    }, [config, cookies])

    // Initialize AppKit after mount - only once
    // Note: AppKit will preload its font (KHTeka-Medium.woff2) when initialized.
    // The font is only used when the modal opens, which may trigger a browser warning
    // about preloaded resources not being used immediately. This is expected behavior
    // and harmless - the font will be used when the user connects their wallet.
    useEffect(() => {
        // Prevent double initialization in React Strict Mode
        if (hasInitialized.current) return
        
        if (typeof window !== 'undefined' && projectId) {
            hasInitialized.current = true
            try {
                getModal()
            } catch (error) {
                console.warn('AppKit initialization error:', error)
                // Reset flag on error so it can be retried if needed
                hasInitialized.current = false
            }
        }
    }, [])

    return (
        <WagmiProvider config={config as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
