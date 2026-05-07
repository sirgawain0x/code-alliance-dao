import { GraphQLClient } from "graphql-request";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { LIST_RECORDS, LIST_RECORDS_BY_TABLE } from "../utils/queries";
import {
  RecordItem,
  RecordItemParsed,
  SubgraphQueryOrderPaginationOptions,
} from "../utils/daotypes";
import { getGraphUrl } from "../utils/endpoints";
import { DaoHooksContext } from "../contexts/DaoHooksContext";
import { addParsedContent } from "../utils/yeeter-data-helpers";

export const useDaoListRecords = ({
  chainid,
  daoid,
  queryOptions,
  table = "",
}: {
  chainid?: string;
  daoid?: string;
  queryOptions?: SubgraphQueryOrderPaginationOptions;
  table?: string;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useDaoListRecords: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const dhUrl = getGraphUrl({
    chainid: chainid || "",
    graphKey: hookContext?.config.graphKey || "",
    subgraphKey: "DAOHAUS",
  });

  const graphQLClient = new GraphQLClient(dhUrl);

  const { data, ...rest } = useQuery({
    queryKey: [`list-records`, { chainid, daoid, table }],
    enabled: Boolean(chainid && daoid),
    queryFn: async (): Promise<{
      records: RecordItemParsed[];
    }> => {
      const baseVars = {
        first: queryOptions?.first || 100,
        skip: queryOptions?.skip || 0,
        orderBy: queryOptions?.orderBy || "createdAt",
        orderDirection: queryOptions?.orderDirection || "desc",
        daoid,
      }

      const useTableFilter = Boolean(table?.trim())

      const res = useTableFilter
        ? ((await graphQLClient.request(LIST_RECORDS_BY_TABLE, {
            ...baseVars,
            table: table!.trim(),
          })) as { records: RecordItem[] })
        : ((await graphQLClient.request(LIST_RECORDS, baseVars)) as { records: RecordItem[] })

      const parsedRecords = res.records.map((r) => ({
        ...r,
        parsedContent: addParsedContent<Record<string, string>>(r),
      }));

      return {
        records: parsedRecords,
      };
    },
  });

  return {
    records: data?.records,
    ...rest,
  };
};
