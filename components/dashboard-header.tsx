"use client"

import { Badge } from "@/components/ui/badge"
import { useDao } from "@/hooks/useDao"

export function DashboardHeader() {
  const { dao } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  });

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 md:px-6 pl-20 md:pl-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">DAO</span>
            <Badge variant="secondary" className="text-xs">
              {dao?.name || "Loading..."}
            </Badge>
          </div>
          <div className="flex space-x-2">
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
        <div className="hidden md:block">
          <appkit-button />
        </div>
      </div>
    </header>
  )
}
