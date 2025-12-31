import { useQuery } from "@tanstack/react-query";
import { ethers, formatUnits } from "ethers";
import { useAppKitNetwork } from "@reown/appkit/react";
import { CRTV_POOL_ADDRESSES, SUPPORTED_CHAINS, CRTV_TOKEN_ADDRESSES, CHAIN_SELECTORS } from "@/config/constants";
import { CRTV_POOL_ABI } from "@/config/abis/crtv-pool";
import { getRpcUrl } from "@/utils/endpoints";



export type ChainId = keyof typeof CRTV_POOL_ADDRESSES;

export interface PoolStats {
    chainId: number;
    chainSelector: string;
    liquidity: string; // Formatted capacity match
    rawLiquidity: bigint;
    rateLimit: {
        capacity: string;
        rate: string;
        isEnabled: boolean;
    };
    isSupported: boolean;
}

export function useCrtvPool() {
    const { chainId } = useAppKitNetwork();

    // Helper to get contract instance
    const getPoolContract = (chainId: number) => {
        const address = CRTV_POOL_ADDRESSES[chainId as ChainId];
        const rpcUrl = getRpcUrl({ chainid: chainId.toString() });
        if (!address || !rpcUrl) return null;

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        return new ethers.Contract(address, CRTV_POOL_ABI, provider);
    };

    return useQuery({
        queryKey: ["crtv-pool-stats", chainId],
        queryFn: async () => {
            const stats: PoolStats[] = [];

            // Iterate through all supported chains to get their "Local" stats relative to other chains
            // Or more simply: just get stats for the designated "supported" chains

            for (const checkChainId of SUPPORTED_CHAINS) {
                const poolContract = getPoolContract(checkChainId);
                if (!poolContract) continue;

                // For this pool, check its connections to OTHER supported chains
                // But wait, "Liquidity" in a TokenPool is usually just the local balance of the token
                // UNLESS it's a Lock/Burn pool. 
                // If Lock/Burn (LockOrBurnV1) -> Liquidity = Balance of Token in Pool
                // If Mint/Burn -> Liquidity = Unlimited (effectively) or limited by Rate Limits

                // Let's check the token balance of the pool to see "Available Liquidity" for WITHDRAWALS
                const tokenAddress = CRTV_TOKEN_ADDRESSES[checkChainId as ChainId];
                if (!tokenAddress) continue;

                let liquidity = BigInt(0);
                const rpcUrl = getRpcUrl({ chainid: checkChainId.toString() });
                if (rpcUrl) {
                    const provider = new ethers.JsonRpcProvider(rpcUrl);
                    const tokenContract = new ethers.Contract(tokenAddress, ["function balanceOf(address) view returns (uint256)"], provider);
                    try {
                        const poolAddress = CRTV_POOL_ADDRESSES[checkChainId as ChainId];
                        liquidity = await tokenContract.balanceOf(poolAddress);
                    } catch (e) {
                        console.warn(`Failed to fetch balance for chain ${checkChainId}`, e);
                    }
                }

                // Get Rate Limits for outbound/inbound? 
                // Usually we care about "Can I bridge TO this chain?" 
                // That depends on the DESTINATION chain's Inbound Rate Limit.

                // Let's struct the stats by "Destination" capabilities.

                stats.push({
                    chainId: checkChainId,
                    chainSelector: CHAIN_SELECTORS[checkChainId as keyof typeof CHAIN_SELECTORS] || "0",
                    liquidity: formatUnits(liquidity, 18),
                    rawLiquidity: liquidity,
                    rateLimit: {
                        capacity: "0", // TODO: Fetch from getCurrentInboundRateLimiterState if needed
                        rate: "0",
                        isEnabled: false
                    },
                    isSupported: true
                });
            }

            return stats;
        },
        enabled: true, // Always fetch if possible
        staleTime: 30000,
    });
}
