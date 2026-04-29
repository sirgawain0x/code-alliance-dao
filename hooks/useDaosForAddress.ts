import { GraphQLClient } from "graphql-request";

import { useQuery } from "@tanstack/react-query";
import { LIST_ALL_DAOS_FOR_ADDRESS } from "../utils/queries";
import { DaoItem, MemberItem } from "../utils/daotypes";
import { useContext } from "react";
import { DaoHooksContext } from "../contexts/DaoHooksContext";
import { getGraphUrl, isSupportedSubgraphChain } from "../utils/endpoints";
import { SubgraphQueryOrderPaginationOptions } from "../utils/daotypes";

export const useDaosForAddress = ({
  chainid,
  address,
  queryOptions,
}: {
  chainid?: string;
  address?: string;
  queryOptions?: SubgraphQueryOrderPaginationOptions;
}) => {
  const hookContext = useContext(DaoHooksContext);

  if (!hookContext || !hookContext.config.graphKey) {
    console.error(
      "useDaos: DaoHooksContext must be used within a DaoHooksProvider"
    );
  }

  const hasSupportedChain = chainid
    ? isSupportedSubgraphChain({ chainid, subgraphKey: "DAOHAUS" })
    : false
  const isEnabled = Boolean(
    chainid && address && hookContext?.config.graphKey && hasSupportedChain
  )
  const graphUrl = isEnabled
    ? getGraphUrl({
        chainid: chainid || "",
        graphKey: hookContext?.config.graphKey || "",
        subgraphKey: "DAOHAUS",
      })
    : ""
  const graphQLClient = new GraphQLClient(graphUrl)

  type DaoMembershipItem = MemberItem & {
    dao: DaoItem
  }

  interface DaoMembershipResponse {
    members: DaoMembershipItem[]
  }

  const { data, ...rest } = useQuery({
    queryKey: [`list-daos-address`, { chainid, address }],
    enabled: isEnabled,
    queryFn: async (): Promise<{
      daos: DaoItem[]
      members: DaoMembershipItem[]
    }> => {
      const response = await graphQLClient.request<DaoMembershipResponse>(
        LIST_ALL_DAOS_FOR_ADDRESS,
        {
          first: queryOptions?.first || 100,
          skip: queryOptions?.skip || 0,
          orderBy: queryOptions?.orderBy || "createdAt",
          orderDirection: queryOptions?.orderDirection || "desc",
          memberAddress: address?.toLowerCase(),
        }
      )

      const daos = response.members.reduce<DaoItem[]>((accumulator, member) => {
        if (!member.dao) return accumulator
        if (accumulator.find((dao) => dao.id === member.dao.id)) return accumulator
        accumulator.push(member.dao)
        return accumulator
      }, [])

      return {
        daos,
        members: response.members,
      }
    },
  });

  return {
    daos: data?.daos,
    memberships: data?.members,
    isUnsupportedChain: Boolean(chainid && !hasSupportedChain),
    ...rest,
  };
};
