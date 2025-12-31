"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Search, Users } from "lucide-react"
import { useDao, useNounsDao } from "../hooks"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"

import { FEATURED_DAOS_CONFIG, CHAIN_NAMES, type FeaturedDao } from "../utils/featured-daos"

export function DaoCardSkeleton() {
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

export function DaoCard({
  chainId,
  address,
  label,
  fallbackIcon,
  description: customDescription,
  link,
  hideMembers,
  showManageButton,
}: FeaturedDao & {
  showManageButton?: boolean
}) {
  const { dao, isLoading, isError } = useDao({ chainid: chainId, daoid: address })

  // Use Nouns hook for secondary data source (specifically for Creative Kids / Nouns Builder DAOs)
  const {
    memberCount: nounsMemberCount,
    treasuryBalance: nounsTreasury,
    isLoading: isNounsLoading,
  } = useNounsDao({
    // Only fetch if we have a valid chainId and address
    chainId: chainId,
    daoAddress: address,
  })

  // Combine loading states - use whichever one gives us data first, or wait if we have neither
  // But for the skeleton, we generally want to wait if the main hook is loading
  if (isLoading && isNounsLoading) {
    return <DaoCardSkeleton />
  }

  // If a custom link is provided, we might not care as much about the DAO loading error
  // provided we have the custom data we need (which we do in CONFIG)
  // However, we still try to load DAO data for member counts etc if possible.
  // If it errors but we have a custom link, we should probably still show the card.

  if ((isError || !dao) && !link && !nounsMemberCount) {
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

  // Use optional chaining carefully here as dao might be undefined if we're in the "link provided, dao fetch failed" case
  const hasProfile = dao?.rawProfile && dao.rawProfile.length > 0
  const description =
    customDescription ||
    dao?.profile?.description ||
    dao?.profile?.longDescription ||
    `A DAO on ${CHAIN_NAMES[chainId]}`

  const avatarUrl = dao?.profile?.avatarImg
  // Prefer Moloch V3 member count, fallback to Nouns/Contracts member count
  const memberCount = dao?.activeMemberCount || nounsMemberCount || "0"

  // Choose the link target
  const targetLink = link || `https://admin.daohaus.club/#/molochv3/${chainId}/${address}`

  return (
    <Link href={targetLink} target="_blank">
      <Card className="stat-card-gradient p-6 dao-card-hover cursor-pointer h-full">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={dao?.name || label}
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
              {dao?.name || label}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          {!hideMembers && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{memberCount} members</span>
              </div>
              {nounsTreasury && (
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span>{nounsTreasury}</span>
                </div>
              )}
            </div>
          )}

          {showManageButton && (
            <div className="pt-2">
              <Button size="sm" className="w-full">
                Manage
              </Button>
            </div>
          )}
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
