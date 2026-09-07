"use client"

import { Badge } from "@/components/ui/badge"
import { DaoSwitcher } from "@/components/dao-switcher"
import { useActiveDao } from "@/contexts/ActiveDaoContext"
import { useDao } from "@/hooks/useDao"

export function DashboardHeader() {
  const { activeDao } = useActiveDao()
  const { dao } = useDao({
    chainid: activeDao.kind === "baal" ? String(activeDao.chainId) : undefined,
    daoid: activeDao.kind === "baal" ? activeDao.daoAddress : undefined,
  })

  const displayName =
    activeDao.kind === "nouns" ? activeDao.publicName : dao?.name || activeDao.publicName

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 md:px-6 pl-20 md:pl-6">
        <div className="flex items-center space-x-4">
          <DaoSwitcher />
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active</span>
            <Badge variant="secondary" className="text-xs">
              {displayName}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activeDao.chainLabel}
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
