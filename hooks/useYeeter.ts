import { GraphQLClient } from "graphql-request";

import { useQuery } from "@tanstack/react-query";
import { FIND_YEETER } from "../utils/queries";
import { YeeterItem, YeeterMetadata } from "../utils/daotypes";
import {
  calcYeetIsActive,
  calcYeetIsComingSoon,
  calcYeetIsEnded,
  calcYeetIsFull,
} from "../utils/yeeter-data-helpers";
import { getGraphUrl } from "../utils/endpoints";
import { useContext } from "react";
import { DaoHooksContext } from "../contexts/DaoHooksContext";

export const useYeeter = ({
  chainid,
  yeeterid,
}: {
  chainid?: string;
  yeeterid?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useYeeter: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const yeeterUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "YEETER",
  });

  const graphQLClient = new GraphQLClient(yeeterUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`get-yeeter`, { chainid, yeeterid }],
    enabled: Boolean(chainid && yeeterid),
    queryFn: async (): Promise<{
      yeeter: YeeterItem;
      metadata: YeeterMetadata;
    }> => {
      const yeeterRes = (await graphQLClient.request(FIND_YEETER, {
        yeeterid,
      })) as {
        yeeter: YeeterItem;
      };

      const yeeter = {
        ...yeeterRes.yeeter,
        isActive: yeeterRes.yeeter && calcYeetIsActive(yeeterRes.yeeter),
        isEnded: yeeterRes.yeeter && calcYeetIsEnded(yeeterRes.yeeter),
        isComingSoon:
          yeeterRes.yeeter && calcYeetIsComingSoon(yeeterRes.yeeter),
        isFull: yeeterRes.yeeter && calcYeetIsFull(yeeterRes.yeeter),
      } as YeeterItem;

      const metadata = {
        daoId: yeeterRes.yeeter.dao.id,
        name: (yeeterRes.yeeter.dao as { name?: string }).name,
      } as YeeterMetadata;

      return {
        yeeter,
        metadata,
      };
    },
  });

  return {
    yeeter: data?.yeeter,
    metadata: data?.metadata,
    ...rest,
  };
};
