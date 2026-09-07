"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { useActiveDao } from "@/contexts/ActiveDaoContext"
import { SIBLING_DAOS } from "@/lib/sibling-daos"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DaoSwitcher() {
  const { activeDao, setActiveDaoId, isSwitchingNetwork } = useActiveDao()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 min-w-[220px] justify-between"
          disabled={isSwitchingNetwork}
        >
          <span className="flex items-center gap-2 truncate">
            <span className="font-medium truncate">{activeDao.publicName}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {activeDao.chainLabel}
            </Badge>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Sibling DAOs</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SIBLING_DAOS.map((dao) => {
          const isActive = dao.id === activeDao.id
          return (
            <DropdownMenuItem
              key={dao.id}
              className="flex items-start gap-2 py-2"
              onClick={() => setActiveDaoId(dao.id)}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dao.publicName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {dao.chainLabel}
                  </Badge>
                  {isActive ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {dao.kind === "nouns"
                    ? `${dao.tokenCollectionName} · Nouns Builder`
                    : "Moloch governance"}
                </p>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
