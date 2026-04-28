import { useQuery } from "@tanstack/react-query";

import type { SubDaoAggregateStats } from "@/services/subdao-stats";

export function useSubDAOStats() {
    return useQuery({
        queryKey: ["subdao-aggregate-stats"],
        queryFn: async () => {
            const response = await fetch("/api/subdao-stats", {
                cache: "no-store",
            });

            if (!response.ok) throw new Error("Unable to load live SubDAO stats");

            return response.json() as Promise<SubDaoAggregateStats>;
        },
        refetchInterval: 30000,
        staleTime: 15000,
    });
}
