"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DaoHooksProvider } from "@/contexts/DaoHooksContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  const daoHooksConfig = {
    graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
    sequenceKey: process.env.NEXT_PUBLIC_SEQUENCE_KEY || "",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DaoHooksProvider keyConfig={daoHooksConfig}>
        {children}
      </DaoHooksProvider>
    </QueryClientProvider>
  );
}
