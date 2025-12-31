import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { ethers, formatEther } from "ethers";

import { FEATURED_DAOS_CONFIG } from "../utils/featured-daos";
import { FIND_DAO } from "../utils/queries";
import { getGraphUrl, getRpcUrl } from "../utils/endpoints";
import { DaoItem } from "../utils/daotypes";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

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

export function useSubDAOStats() {
    const hookContext = useContext(DaoHooksContext);

    return useQuery({
        queryKey: ["subdao-aggregate-stats"],
        queryFn: async () => {
            // Parallelize requests
            const promises = FEATURED_DAOS_CONFIG.map(async (daoConfig) => {
                let memberCount = 0;
                let treasuryEth = 0;

                // TYPE 1: Moloch Data
                let isMoloch = true;
                try {
                    const dhUrl = getGraphUrl({
                        chainid: daoConfig.chainId,
                        graphKey: hookContext?.config.graphKey || "",
                        subgraphKey: "DAOHAUS",
                    });

                    if (dhUrl) {
                        const graphQLClient = new GraphQLClient(dhUrl);
                        const daores = (await graphQLClient.request(FIND_DAO, {
                            daoid: daoConfig.address,
                        })) as { dao: DaoItem };

                        if (daores.dao) {
                            memberCount = parseInt(daores.dao.activeMemberCount || "0");

                            const safeAddress = daores.dao.safeAddress;
                            if (safeAddress) {
                                // Fetch NATIVE balance of safe
                                const rpcUrl = getRpcUrl({ chainid: daoConfig.chainId });
                                if (rpcUrl) {
                                    const provider = new ethers.JsonRpcProvider(rpcUrl);
                                    const balance = await provider.getBalance(safeAddress);
                                    treasuryEth = parseFloat(formatEther(balance));
                                }
                            }
                        } else {
                            isMoloch = false;
                        }
                    }
                } catch (e) {
                    // Silently fail or warn, proceed to check if it's another type
                    isMoloch = false;
                }

                // If Moloch failed or returned no data, TRY Nouns logic
                if (!isMoloch || memberCount === 0) {
                    try {
                        const rpcUrl = getRpcUrl({ chainid: daoConfig.chainId });
                        if (rpcUrl) {
                            const provider = new ethers.JsonRpcProvider(rpcUrl);
                            // Check if it's a contract
                            const code = await provider.getCode(daoConfig.address);
                            if (code !== "0x") {
                                const tokenContract = new ethers.Contract(daoConfig.address, TOKEN_ABI, provider);

                                // Try to get totalSupply (members)
                                try {
                                    const supply = await tokenContract.totalSupply();
                                    memberCount = parseInt(supply.toString());
                                } catch (e) { }

                                // Try to get owner balance (treasury)
                                try {
                                    const owner = await tokenContract.owner();
                                    const balance = await provider.getBalance(owner);
                                    treasuryEth = parseFloat(formatEther(balance));
                                } catch (e) { }
                            }
                        }
                    } catch (e) {
                        console.warn("Error fetching data for", daoConfig.label, e);
                    }
                }

                return {
                    members: memberCount,
                    treasury: treasuryEth
                };
            });

            const results = await Promise.all(promises);

            const totalMembers = results.reduce((acc, curr) => acc + curr.members, 0);
            const combinedTreasury = results.reduce((acc, curr) => acc + curr.treasury, 0);

            return {
                activeSubDAOs: FEATURED_DAOS_CONFIG.length,
                totalMembers,
                combinedTreasury
            };
        },
        enabled: !!hookContext,
    });
}
