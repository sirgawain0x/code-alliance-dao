"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ExternalLink, Filter, Search } from "lucide-react"
import { useDaoMembers } from "@/hooks/useDaoMembers"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"
import { Can } from "@/components/can"
import { getDaoHausAdminMembersUrl } from "@/lib/dao-haus-links"
import Link from "next/link"
import { useMemo, useState } from "react"
import { formatUnits } from "ethers"

export function MemberGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { members, isLoading, isError, error } = useDaoMembers({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })
  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })
  const adminMembersUrl = getDaoHausAdminMembersUrl()

  const filteredMembers = useMemo(() => {
    if (!members) return []
    return members.filter((member) => {
      const matchesSearch = member.memberAddress.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "member" && Number(formatUnits(member.shares || "0", 18)) > 0) ||
        (roleFilter === "observer" && Number(formatUnits(member.shares || "0", 18)) === 0)
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && Number(formatUnits(member.shares || "0", 18)) > 0) ||
        (statusFilter === "inactive" && Number(formatUnits(member.shares || "0", 18)) === 0)
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [members, searchTerm, roleFilter, statusFilter])

  const getRoleColor = (shares: string) => {
    return Number(formatUnits(shares || "0", 18)) > 0
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  const getRoleLabel = (shares: string) => {
    return Number(formatUnits(shares || "0", 18)) > 0 ? "Voting Member" : "Non-voting"
  }

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6 min-w-0 overflow-hidden">
        <div className="space-y-4 min-w-0">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="stat-card-gradient p-6 min-w-0 overflow-hidden">
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-foreground">All Members</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
            {adminMembersUrl && (
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href={adminMembersUrl} target="_blank" rel="noopener noreferrer">
                  Open in DAOhaus
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            )}
            <Can profile={primaryProfile} capability="canViewDao">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled>
                Export
              </Button>
            </Can>
            <Can
              profile={primaryProfile}
              capability="canManageMembers"
              fallback={
                <Button size="sm" className="w-full sm:w-auto" disabled>
                  Invite Members (Admin only)
                </Button>
              }
            >
              {adminMembersUrl ? (
                <Button size="sm" className="w-full sm:w-auto" asChild>
                  <Link href={adminMembersUrl} target="_blank" rel="noopener noreferrer">
                    Manage Members
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              ) : (
                <Button size="sm" className="w-full sm:w-auto">
                  Invite Members
                </Button>
              )}
            </Can>
          </div>
        </div>

        {isError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Unable to load members{error instanceof Error ? `: ${error.message}` : "."}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center min-w-0">
          <div className="relative flex-1 min-w-0 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-10 bg-muted border-border w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full min-w-[8rem] sm:w-32 bg-muted border-border">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="member">Voting</SelectItem>
                <SelectItem value="observer">Non-voting</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full min-w-[8rem] sm:w-32 bg-muted border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled>
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="border border-border rounded-lg p-4 dao-card-hover min-w-0 overflow-hidden"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback>
                      {member.memberAddress.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <h4 className="font-medium text-foreground font-mono truncate min-w-0">
                        {member.memberAddress.slice(0, 6)}...{member.memberAddress.slice(-4)}
                      </h4>
                      <Badge className={`${getRoleColor(member.shares)} shrink-0`}>
                        {getRoleLabel(member.shares)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground min-w-0">
                      <span className="font-mono truncate min-w-0" title={member.memberAddress}>
                        {member.memberAddress}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="shrink-0">
                        Joined {new Date(Number(member.createdAt) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 shrink-0 border-t border-border/50 pt-3 sm:border-t-0 sm:pt-0 sm:justify-end">
                  <div className="text-left sm:text-right text-sm">
                    <div className="text-foreground font-medium">
                      Shares: {formatTokenAmount(member.shares)}
                    </div>
                    <div className="text-muted-foreground">
                      Loot: {formatTokenAmount(member.loot)}
                    </div>
                  </div>

                  {adminMembersUrl && (
                    <Button variant="ghost" size="sm" className="shrink-0" asChild>
                      <Link href={adminMembersUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && !isError && (
            <div className="text-center p-6 text-muted-foreground">
              No members found.
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function formatTokenAmount(value: string) {
  try {
    return Number(formatUnits(value || "0", 18)).toLocaleString(undefined, {
      maximumFractionDigits: 4,
    })
  } catch {
    return value
  }
}
