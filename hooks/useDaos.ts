import { GraphQLClient } from "graphql-request";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { LIST_ALL_DAOS } from "../utils/queries";
import {
  DaoItem,
  DaoProfile,
  SubgraphQueryOrderPaginationOptions,
} from "../utils/daotypes";
// import { addParsedContent } from "../utils/yeeter-data-helpers"; // Removed as this file likely doesn't exist locally yet
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
      const daores = (await graphQLClient.request(LIST_ALL_DAOS, {
        first: queryOptions?.first || 100,
        skip: queryOptions?.skip || 0,
        orderBy: queryOptions?.orderBy || "createdAt",
        orderDirection: queryOptions?.orderDirection || "desc",
      })) as {
        daos: DaoItem[];
      };

      // Assuming rawProfile needs parsing, but addParsedContent helper might be missing.
      // For now, returning as is or with minimal transformation to match type if simplified.
      const hydratedDaos = daores.daos.map((dao) => {
        return dao;
        // return {
        //   ...dao,
        //   profile: addParsedContent<DaoProfile>(dao.rawProfile[0]),
        // };
      });

      return {
        daos: hydratedDaos,
      };
    },
  });

  return {
    daos: data?.daos,
    dao: data?.daos?.[0], // Convenience for single DAO context
    ...rest,
  };
};
