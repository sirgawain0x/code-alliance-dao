"use client"

import { Badge } from "@/components/ui/badge"
import { useDao } from "@/hooks/useDao"

export function DashboardHeader() {
  const { dao } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 pl-16 md:px-6 md:pl-6">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-sm text-muted-foreground">DAO</span>
            <Badge
              variant="secondary"
              className="max-w-[min(180px,50vw)] truncate text-xs"
              title={dao?.name}
            >
              {dao?.name || "Loading..."}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              All
            </Badge>
            <Badge variant="outline" className="text-xs">
              30d
            </Badge>
            <Badge variant="outline" className="text-xs">
              7d
            </Badge>
          </div>
        </div>
        <div className="hidden shrink-0 md:block">
          <appkit-button />
        </div>
      </div>
    </header>
  )
}
