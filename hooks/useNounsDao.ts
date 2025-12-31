import { useQuery } from "@tanstack/react-query";
import { ethers, formatEther } from "ethers";
import { getRpcUrl } from "../utils/endpoints";

const TOKEN_ABI = [
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

export function useNounsDao({
    chainId,
    daoAddress,
}: {
    chainId?: string;
    daoAddress?: string;
}) {
    // Determine the chain ID number for RPC logic if needed, 
    // but getRpcUrl expects a string (either hex or decimal string).
    // The component usually passes hex "0xa".

    // We can use a simpler query key
    const queryKey = ["nouns-dao-data", chainId, daoAddress];

    const { data, isLoading } = useQuery({
        queryKey,
        enabled: !!chainId && !!daoAddress,
        queryFn: async () => {
            if (!chainId || !daoAddress) throw new Error("Missing chainId or daoAddress");

            // 1. Setup Provider
            // getRpcUrl handles the string conversion internally if needed, 
            // but we should pass it what it usually expects. 
            // Looking at endpoints.ts, it expects decimal string "10" or "1". 
            // So we convert hex to decimal string.
            const chainIdDecimal = parseInt(chainId, 16).toString();
            const rpcUrl = getRpcUrl({ chainid: chainIdDecimal });

            const provider = new ethers.JsonRpcProvider(rpcUrl);

            // 2. Setup Contract
            const tokenContract = new ethers.Contract(daoAddress, TOKEN_ABI, provider);

            // 3. Fetch Data in parallel
            const [totalSupply, ownerAddress] = await Promise.all([
                tokenContract.totalSupply(),
                tokenContract.owner(),
            ]);

            // 4. Fetch Treasury Balance (Owner's Balance) uses the provider
            const treasuryBalanceWei = await provider.getBalance(ownerAddress);

            return {
                memberCount: totalSupply.toString(),
                treasuryBalance: `${parseFloat(formatEther(treasuryBalanceWei)).toFixed(4)} ETH`, // Assuming native token for now
            };
        }
    });

    return {
        memberCount: data?.memberCount,
        treasuryBalance: data?.treasuryBalance,
        isLoading: isLoading,
        // If we have data, we are "success"
        hasData: !!data,
    };
}
