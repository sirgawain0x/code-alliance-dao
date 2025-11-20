import { GraphQLClient } from "graphql-request";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { LIST_SINGLE_DAO } from "../utils/queries";
import {
  DaoItem,
  DaoProfile,
  SubgraphQueryOrderPaginationOptions,
} from "../utils/daotypes";
import { addParsedContent } from "../utils/yeeter-data-helpers";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

export const useDaos = ({
  chainid,
  queryOptions,
}: {
  chainid?: string;
  queryOptions?: SubgraphQueryOrderPaginationOptions;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useDaos: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const dhUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(dhUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`list-daos`, { chainid }],
    enabled: Boolean(chainid),
    queryFn: async (): Promise<{
      daos: DaoItem[];
    }> => {
      const daores = (await graphQLClient.request(LIST_SINGLE_DAO, {
        daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS || "",
      })) as {
        daos: DaoItem[];
      };

      const hydratedDaos = daores.daos.map((dao) => {
        return {
          ...dao,
          profile: undefined, // Profile data not available in Base chain subgraph
        };
      });

      return {
        daos: hydratedDaos,
      };
    },
  });

  return {
    daos: data?.daos,
    dao: data?.daos?.[0],
    ...rest,
  };
};
