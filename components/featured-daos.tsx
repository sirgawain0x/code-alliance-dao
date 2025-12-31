"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Users } from "lucide-react"
import { useDao } from "@/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

// Configuration for featured DAOs across multiple chains
const FEATURED_DAOS_CONFIG = [
  {
    chainId: "0x2105",
    address: "0x95c041ade16243665085323ad845051de57d78b1",
    label: "Base Yeeter",
    fallbackIcon: "🎯",
  },
  {
    chainId: "0x89",
    address: "0x9da29b87c2471feb00b931498919dc22340c8489",
    label: "Polygon DAO",
    fallbackIcon: "🟣",
  },
  {
    chainId: "0xa4b1",
    address: "0x880f006886af9eec4e219b7c9d0467bba0f16c06",
    label: "Arbitrum DAO",
    fallbackIcon: "🔵",
  },
  {
    chainId: "0xa",
    address: "0x61df03ea299790984c3619d734c81912a4710107",
    label: "Optimism DAO",
    fallbackIcon: "🔴",
  },
]

// Chain display names
const CHAIN_NAMES: Record<string, string> = {
  "0x2105": "Base",
  "0x89": "Polygon",
  "0xa4b1": "Arbitrum",
  "0xa": "Optimism",
}

function DaoCardSkeleton() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  )
}

function DaoCard({ chainId, address, label, fallbackIcon }: typeof FEATURED_DAOS_CONFIG[0]) {
  const { dao, isLoading, isError } = useDao({ chainid: chainId, daoid: address })

  if (isLoading) {
    return <DaoCardSkeleton />
  }

  if (isError || !dao) {
    return (
      <Card className="stat-card-gradient p-6 opacity-50">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                {fallbackIcon}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {CHAIN_NAMES[chainId]}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{label}</h3>
            <p className="text-sm text-muted-foreground">Unable to load DAO data</p>
          </div>
        </div>
      </Card>
    )
  }

  const hasProfile = dao.rawProfile && dao.rawProfile.length > 0
  const description = dao.profile?.description || dao.profile?.longDescription || `A DAO on ${CHAIN_NAMES[chainId]}`
  const avatarUrl = dao.profile?.avatarImg
  const memberCount = dao.activeMemberCount || "0"

  return (
    <Link href={`https://admin.daohaus.club/#/molochv3/${chainId}/${address}`} target="_blank">
      <Card className="stat-card-gradient p-6 dao-card-hover cursor-pointer h-full">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={dao.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                  {fallbackIcon}
                </div>
              )}
              {hasProfile && (
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                  ✓
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {CHAIN_NAMES[chainId]}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
              {dao.name || label}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{memberCount} members</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function FeaturedDAOs() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Featured DAOs</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="https://admin.daohaus.club" target="_blank">
            <Search className="h-4 w-4 mr-2" />
            Find another DAO
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_DAOS_CONFIG.map((config) => (
          <DaoCard key={`${config.chainId}-${config.address}`} {...config} />
        ))}
      </div>
    </div>
  )
}
