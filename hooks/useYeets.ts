import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

import { LIST_YEETS } from "../utils/queries";
import { YeetsItem } from "../utils/daotypes";
import { useContext } from "react";
import { DaoHooksContext } from "../contexts/DaoHooksContext";
import { getGraphUrl } from "../utils/endpoints";

export const useYeets = ({
  chainid,
  yeeterid,
}: {
  chainid?: string;
  yeeterid?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useYeets: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`list-yeets`, { chainid, yeeterid }],
    enabled: Boolean(chainid && yeeterid),
    queryFn: (): Promise<{
      yeets: YeetsItem[];
    }> =>
      graphQLClient.request(LIST_YEETS, {
        first: 80,
        skip: 0,
        orderBy: "createdAt",
        orderDirection: "desc",
        yeeterid: yeeterid!,
      }),
  });

  return {
    yeets: data?.yeets,
    ...rest,
  };
};
