/**
 * Utility to clear all WalletConnect and AppKit session data from local storage.
 * This is useful when users experience connection issues due to stale sessions.
 */
export function clearWalletSessions() {
    if (typeof window === 'undefined') return

    try {
        // Find all WalletConnect and AppKit related keys
        const wcKeys = Object.keys(localStorage).filter(key =>
            key.startsWith('wc@') ||
            key.startsWith('@w3m') ||
            key.startsWith('@appkit') ||
            key.startsWith('wagmi') ||
            key.includes('walletconnect')
        )

        // Remove all WalletConnect session data
        wcKeys.forEach(key => {
            try {
                localStorage.removeItem(key)
            } catch (e) {
                console.warn(`Failed to remove ${key}:`, e)
            }
        })

        console.log(`Cleared ${wcKeys.length} wallet session keys`)
        return wcKeys.length
    } catch (error) {
        console.error('Failed to clear wallet sessions:', error)
        return 0
    }
}

/**
 * Hook to provide wallet session utilities
 */
export function useWalletSessionUtils() {
    const clearSessions = () => {
        const cleared = clearWalletSessions()
        // Reload the page to reset wallet state
        if (typeof cleared === 'number' && cleared > 0) {
            window.location.reload()
        }
        return cleared
    }

    return {
        clearSessions,
    }
}
