import { GraphQLClient } from "graphql-request";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { LIST_ALL_DAO_PROPOSALS } from "../utils/queries";
import {
  ProposalItem,
  SubgraphQueryOrderPaginationOptions,
} from "../utils/daotypes";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

export const useDaoProposals = ({
  chainid,
  daoid,
  queryOptions,
}: {
  chainid?: string;
  daoid?: string;
  queryOptions?: SubgraphQueryOrderPaginationOptions;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext) throw new Error("useDaoProposals must be used within a DaoHooksProvider");

  let dhUrl = "";
  if (hookContext.config.graphKey && chainid) {
    dhUrl = getGraphUrl({
      chainid,
      graphKey: hookContext.config.graphKey,
      subgraphKey: "DAOHAUS",
    });
  }

  const graphQLClient = new GraphQLClient(dhUrl || "http://localhost");

  const { data, ...rest } = useQuery({
    queryKey: [`list-proposals`, { chainid, daoid }],
    enabled: Boolean(chainid && daoid && dhUrl),
    queryFn: async (): Promise<{
      proposals: ProposalItem[];
    }> => {
      const res = (await graphQLClient.request(LIST_ALL_DAO_PROPOSALS, {
        first: queryOptions?.first || 100,
        skip: queryOptions?.skip || 0,
        orderBy: queryOptions?.orderBy || "createdAt",
        orderDirection: queryOptions?.orderDirection || "desc",
        daoid: daoid?.toLowerCase(),
      })) as {
        proposals: ProposalItem[];
      };

      return {
        proposals: res.proposals,
      };
    },
  });

  return {
    proposals: data?.proposals,
    ...rest,
  };
};
