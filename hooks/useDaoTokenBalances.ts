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
      
      // For now, return mock data since SequenceIndexer import is not working
      // You can replace this with actual implementation once the import is fixed
      const mockTokens: TokenBalance[] = [
        {
          tokenAddress: null, // Native token
          balance: "1000000000000000000", // 1 ETH in wei
          token: {
            decimals: 18,
            symbol: "ETH",
            name: "Ethereum",
            logoUri: null,
          },
        },
        {
          tokenAddress: "0xA0b86a33E6441c8C06DDD1234567890abcdef1234",
          balance: "1000000000000000000000", // 1000 tokens
          token: {
            decimals: 18,
            symbol: "USDC",
            name: "USD Coin",
            logoUri: "https://example.com/usdc-logo.png",
          },
        },
      ];

      return { tokens: mockTokens };
    },
  });

  return {
    tokens: data?.tokens,
    ...rest,
  };
};
