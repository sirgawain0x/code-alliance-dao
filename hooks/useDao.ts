import { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

import { FIND_DAO } from "../utils/queries";
import { DaoItem, DaoProfile } from "../utils/daotypes";
import { addParsedContent } from "../utils/yeeter-data-helpers";
import { getGraphUrl, isSupportedSubgraphChain } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

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
  const isDaohausSupportedChain = chainid
    ? isSupportedSubgraphChain({ chainid, subgraphKey: "DAOHAUS" })
    : false;

  if (hookContext.config.graphKey && chainid && isDaohausSupportedChain) {
    dhUrl = getGraphUrl({
      chainid,
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

      const profileRecord = daores.dao.rawProfile?.[0]
      const profile = addParsedContent<DaoProfile>(profileRecord)

      return {
        dao: { ...daores.dao, profile },
      };
    },
  });

  return {
    dao: data?.dao,
    ...rest,
  };
};
