"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Shield, Crown } from "lucide-react"
import { useDaoMembers } from "@/hooks/useDaoMembers"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"

export function MemberGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { members, isLoading } = useDaoMembers({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const filteredMembers = useMemo(() => {
    if (!members) return []
    return members.filter((member) => {
      const matchesSearch = member.memberAddress.toLowerCase().includes(searchTerm.toLowerCase())
      // Role and Status filters are placeholders as subgraph data might not have these explicit fields yet
      // We can implement logic based on shares/loot later if needed
      return matchesSearch
    })
  }, [members, searchTerm])

  const getRoleColor = (shares: string) => {
    // Simple logic: > 0 shares means voting member
    return Number(shares) > 0
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  const getRoleLabel = (shares: string) => {
    return Number(shares) > 0 ? "Member" : "Observer"
  }

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
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
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">All Members</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">Invite Members</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-10 bg-muted border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32 bg-muted border-border">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="observer">Observer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-muted border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Member List */}
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div key={member.id} className="border border-border rounded-lg p-4 dao-card-hover cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {member.memberAddress.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">
                        {member.memberAddress.slice(0, 6)}...{member.memberAddress.slice(-4)}
                      </h4>
                      <Badge className={getRoleColor(member.shares)}>
                        <span className="ml-1">{getRoleLabel(member.shares)}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="font-mono">{member.memberAddress}</span>
                      <span>•</span>
                      <span>Joined {new Date(Number(member.createdAt) * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right text-sm">
                    <div className="text-foreground font-medium">Shares: {member.shares}</div>
                    <div className="text-muted-foreground">Loot: {member.loot}</div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="text-center p-6 text-muted-foreground">
              No members found.
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline">Load More Members</Button>
        </div>
      </div>
    </Card>
  )
}


