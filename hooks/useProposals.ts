import { GraphQLClient } from "graphql-request";
import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { LIST_ALL_DAO_PROPOSALS } from "../utils/queries";
import {
    ProposalItem,
    SubgraphQueryOrderPaginationOptions,
} from "../utils/daotypes";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

export const useProposals = ({
    chainid,
    queryOptions,
}: {
    chainid?: string;
    queryOptions?: SubgraphQueryOrderPaginationOptions;
}) => {
    const hookContext = useContext(DaoHooksContext);

    if (!hookContext || !hookContext.config.graphKey) {
        console.error(
            "useProposals: DaoHooksContext must be used within a DaoHooksProvider"
        );
    }

    const dhUrl = getGraphUrl({
        chainid: chainid || "",
        graphKey: hookContext?.config.graphKey || "",
        subgraphKey: "DAOHAUS",
    });

    const graphQLClient = new GraphQLClient(dhUrl);

    const { data, ...rest } = useQuery({
        queryKey: [`list-proposals`, { chainid, daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS }],
        enabled: Boolean(chainid && process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS),
        queryFn: async (): Promise<{
            proposals: ProposalItem[];
        }> => {
            const daoid = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS || "";
            if (!daoid) {
                console.error("NEXT_PUBLIC_TARGET_DAO_ADDRESS is not set");
                return { proposals: [] };
            }

            try {
                console.log("Fetching proposals for DAO:", daoid);
                const res = (await graphQLClient.request(LIST_ALL_DAO_PROPOSALS, {
                    daoid,
                    first: queryOptions?.first || 100,
                    skip: queryOptions?.skip || 0,
                    orderBy: queryOptions?.orderBy || "createdAt",
                    orderDirection: queryOptions?.orderDirection || "desc",
                })) as {
                    proposals: any[];
                };

                console.log("Proposals fetched:", res.proposals?.length || 0, "proposals");

                // Map the data to match ProposalItem type
                const mappedProposals: ProposalItem[] = (res.proposals || []).map((p) => {
                    // Extract proposalId from id (format: "0x...-proposal-123")
                    const proposalIdMatch = p.id.match(/-proposal-(\d+)$/);
                    const proposalId = proposalIdMatch ? proposalIdMatch[1] : p.id.split("-").pop() || p.id;

                    return {
                        ...p,
                        proposedBy: p.proposedBy || "",
                        proposalId: proposalId,
                        createdBy: p.createdBy || "",
                        cancelled: p.cancelled || false,
                        cancelledBy: p.cancelledBy || "",
                        cancelledTxHash: p.cancelledTxHash || "",
                        cancelledTxAt: p.cancelledTxAt || "",
                        sponsorTxHash: p.sponsorTxHash || "",
                        sponsor: p.sponsor || "",
                        sponsorTxAt: p.sponsorTxAt || "",
                        processTxHash: p.processTxHash || "",
                        processTxAt: p.processTxAt || "",
                        votingPeriod: p.votingPeriod || "",
                        gracePeriod: p.gracePeriod || "",
                        expirationQueryField: p.expirationQueryField || "",
                        actionFailed: p.actionFailed || "",
                        proposalOffering: p.proposalOffering || "",
                        tributeToken: p.tributeToken || "",
                        tributeOffered: p.tributeOffered || "",
                        tributeTokenSymbol: p.tributeTokenSymbol || "",
                        tributeTokenDecimals: p.tributeTokenDecimals || "",
                        tributeEscrowRecipient: p.tributeEscrowRecipient || "",
                        prevProposalId: p.prevProposalId || "",
                        proposalDataHash: p.proposalDataHash || "",
                        proposalData: p.proposalData || "",
                        actionGasEstimate: p.actionGasEstimate || "",
                        details: p.details || "",
                        proposalType: p.proposalType || "",
                        txHash: p.txHash || "",
                        dao: {
                            totalShares: p.dao?.totalShares || "0",
                            quorumPercent: p.dao?.quorumPercent || "0",
                            minRetentionPercent: p.dao?.minRetentionPercent || "0",
                        },
                        sponsorMembership: p.sponsorMembership || {
                            memberAddress: "",
                            shares: "0",
                            delegateShares: "0",
                        },
                        // Map votes structure - votes come as array with member nested
                        votes: Array.isArray(p.votes) ? p.votes.map((v: any) => ({
                            id: v.id,
                            txHash: v.txHash || "",
                            createdAt: v.createdAt,
                            daoAddress: "",
                            approved: v.approved,
                            balance: v.balance || "0",
                            member: {
                                id: v.member?.id || "",
                                memberAddress: v.member?.memberAddress || "",
                            },
                        })) : ({} as any),
                    };
                });

                return {
                    proposals: mappedProposals,
                };
            } catch (error) {
                console.error("Error fetching proposals:", error);
                return { proposals: [] };
            }
        },
    });

    const activeProposals = useMemo(() => {
        if (!data?.proposals) return [];
        const now = new Date().getTime() / 1000;
        return data.proposals.filter((p) => {
            // Basic active check: voting period is active and not processed/cancelled
            // This is a simplification. Real logic depends on grace period, etc.
            return !p.processed && !p.cancelled && Number(p.votingEnds) > now;
        });
    }, [data?.proposals]);

    return {
        proposals: data?.proposals,
        activeProposals,
        ...rest,
    };
};
