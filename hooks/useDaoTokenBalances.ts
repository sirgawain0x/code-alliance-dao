import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TokenBalance } from "../utils/daotypes";
import { getTokenIndexerUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

export const useDaoTokenBalances = ({
  chainid,
  safeAddress,
}: {
  chainid?: string;
  safeAddress?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.sequenceKey) {
    console.error(
      "useDaoTokenBalances: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const url = getTokenIndexerUrl({
    chainid: chainid || "",
  });

  const { data, ...rest } = useQuery({
    queryKey: [`list-dao-tokens`, { chainid, safeAddress }],
    enabled: Boolean(chainid && safeAddress && url && hookContext?.config.sequenceKey),
    queryFn: async (): Promise<{
      tokens: TokenBalance[];
    }> => {
      const key = hookContext?.config.sequenceKey || "";

      if (!key) {
        throw new Error("Sequence API key is required");
      }

      if (!safeAddress) {
        throw new Error("Safe address is required");
      }

      if (!chainid) {
        throw new Error("Chain ID is required");
      }

      // Use Sequence Indexer Gateway API
      // Convert chainid to number - Sequence API expects numeric chain IDs
      const chainIdNumber = parseInt(chainid, 10);

      const response = await fetch(
        "https://indexer.sequence.app/rpc/IndexerGateway/GetTokenBalances",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": key,
          },
          body: JSON.stringify({
            chainIds: [chainIdNumber],
            accountAddress: safeAddress,
            includeMetadata: true,
            metadataOptions: {
              verifiedOnly: false,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sequence API error:", errorText);
        throw new Error(`Failed to fetch token balances: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Sequence API response:", result);

      // Transform Sequence API response to match our TokenBalance type
      // The API may return data in result.page.balances or result.balances
      const balances = result.page?.balances || result.balances || [];
      console.log("Extracted balances:", balances);
      console.log("First balance (stringified):", JSON.stringify(balances[0], null, 2));

      const tokens: TokenBalance[] = balances
        .flatMap((chainBalance: any) => chainBalance.results || [])
        .filter((token: any) => token?.balance && token.balance !== "0")
        .map((token: any) => ({
          tokenAddress: token.contractAddress === "0x0000000000000000000000000000000000000000"
            ? null
            : token.contractAddress,
          balance: String(token.balance || "0"),
          token: {
            decimals: token.contractInfo?.decimals || 18,
            symbol: token.contractInfo?.symbol || "UNKNOWN",
            name: token.contractInfo?.name || "Unknown Token",
            logoUri: token.contractInfo?.logoURI || null,
          },
        }));

      console.log("Transformed tokens:", tokens);

      return { tokens };
    },
  });

  return {
    tokens: data?.tokens,
    ...rest,
  };
};
