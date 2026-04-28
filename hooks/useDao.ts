import { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

import { FIND_DAO } from "../utils/queries";
import { DaoItem } from "../utils/daotypes";
// import { addParsedContent } from "@/utils/yeeter-data-helpers";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

const DAOHAUS_SUPPORTED_CHAINS = new Set([
  "0xaa36a7",
  "0x64",
  "0x89",
  "0xa",
  "0xa4b1",
  "0x2105",
]);

function toHexChainId(chainid: string): string {
  if (!chainid) return "";
  if (chainid.startsWith("0x")) return chainid.toLowerCase();

  const parsedChainId = parseInt(chainid, 10);
  if (Number.isNaN(parsedChainId)) return "";

  return `0x${parsedChainId.toString(16)}`;
}

export const useDao = ({
  chainid,
  daoid,
}: {
  chainid?: string;
  daoid?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext) throw new Error("useDao must be used within a DaoHooksProvider");

  let dhUrl = "";
  const normalizedChainId = chainid ? toHexChainId(chainid) : "";
  const isDaohausSupportedChain = normalizedChainId
    ? DAOHAUS_SUPPORTED_CHAINS.has(normalizedChainId)
    : false;

  if (hookContext.config.graphKey && normalizedChainId && isDaohausSupportedChain) {
    dhUrl = getGraphUrl({
      chainid: normalizedChainId,
      graphKey: hookContext.config.graphKey,
      subgraphKey: "DAOHAUS",
    });
  }

  const graphQLClient = new GraphQLClient(dhUrl || "http://localhost");

  const { data, ...rest } = useQuery({
    queryKey: [`get-dao`, { chainid, daoid }],
    enabled: Boolean(chainid && daoid && dhUrl),
    queryFn: async (): Promise<{
      dao: DaoItem;
    }> => {
      const daores = (await graphQLClient.request(FIND_DAO, {
        daoid,
      })) as {
        dao: DaoItem;
      };

      // const profile = addParsedContent<DaoProfile>(daores.dao.rawProfile[0]);

      return {
        dao: { ...daores.dao }, //, profile },
      };
    },
  });

  return {
    dao: data?.dao,
    ...rest,
  };
};
