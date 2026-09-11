import { JsonRpcProvider } from "ethers"

import { getAlchemyRpcKey, getRpcUrls } from "@/utils/endpoints"

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { attempts?: number; baseDelayMs?: number }
): Promise<T> {
  const attempts = options?.attempts ?? 3
  const baseDelayMs = options?.baseDelayMs ?? 300
  let lastError: unknown

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < attempts - 1) await sleep(baseDelayMs * 2 ** attempt)
    }
  }

  throw lastError
}

export async function createTreasuryProvider(chainId: string): Promise<JsonRpcProvider> {
  const urls = getRpcUrls({ chainid: chainId, rpcKey: getAlchemyRpcKey() })
  const chainIdNum = Number(chainId)

  for (const url of urls) {
    try {
      const provider = new JsonRpcProvider(url, chainIdNum)
      await withRetry(() => provider.getBlockNumber(), { attempts: 2, baseDelayMs: 200 })
      return provider
    } catch (error) {
      console.warn(`Treasury RPC unavailable (${url}):`, error)
    }
  }

  return new JsonRpcProvider(urls[urls.length - 1], chainIdNum)
}

export async function fetchEthBalanceWithFallback(
  treasuryAddress: string,
  chainId: string
): Promise<{ balance: bigint; failed: boolean }> {
  const urls = getRpcUrls({ chainid: chainId, rpcKey: getAlchemyRpcKey() })
  const chainIdNum = Number(chainId)

  for (const url of urls) {
    try {
      const provider = new JsonRpcProvider(url, chainIdNum)
      const balance = await withRetry(() => provider.getBalance(treasuryAddress))
      return { balance, failed: false }
    } catch (error) {
      console.warn(`ETH balance fetch failed (${url}):`, error)
    }
  }

  return { balance: BigInt(0), failed: true }
}
