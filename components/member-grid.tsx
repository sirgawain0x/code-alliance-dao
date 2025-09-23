import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Shield, Crown } from "lucide-react"

const members = [
  {
    id: "member-001",
    name: "Dr. Alice Chen",
    address: "0x1234...5678",
    role: "Core Contributor",
    subDAOs: ["Innovation Labs DAO", "AI Research Collective"],
    reputation: 95,
    votingPower: 1247,
    contributions: 234,
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    status: "active",
    permissions: ["governance", "treasury", "admin"],
  },
  {
    id: "member-002",
    name: "Bob Martinez",
    address: "0x2345...6789",
    role: "Project Lead",
    subDAOs: ["Innovation Labs DAO", "DeFi Protocols DAO"],
    reputation: 88,
    votingPower: 892,
    contributions: 189,
    joinDate: "2024-01-20",
    lastActive: "1 day ago",
    status: "active",
    permissions: ["governance", "projects"],
  },
  {
    id: "member-003",
    name: "Carol Kim",
    address: "0x3456...7890",
    role: "Contributor",
    subDAOs: ["Community Fund DAO"],
    reputation: 76,
    votingPower: 456,
    contributions: 156,
    joinDate: "2024-02-01",
    lastActive: "3 hours ago",
    status: "active",
    permissions: ["governance"],
  },
  {
    id: "member-004",
    name: "David Wilson",
    address: "0x4567...8901",
    role: "Community Member",
    subDAOs: ["Startup Support Lab", "Community Fund DAO"],
    reputation: 62,
    votingPower: 234,
    contributions: 98,
    joinDate: "2024-02-15",
    lastActive: "1 week ago",
    status: "inactive",
    permissions: ["governance"],
  },
  {
    id: "member-005",
    name: "Eva Rodriguez",
    address: "0x5678...9012",
    role: "Council Member",
    subDAOs: ["Parent DAO", "Community Fund DAO"],
    reputation: 92,
    votingPower: 1567,
    contributions: 312,
    joinDate: "2024-01-10",
    lastActive: "30 minutes ago",
    status: "active",
    permissions: ["governance", "treasury", "admin", "council"],
  },
  {
    id: "member-006",
    name: "Frank Thompson",
    address: "0x6789...0123",
    role: "Administrator",
    subDAOs: ["Parent DAO"],
    reputation: 98,
    votingPower: 2134,
    contributions: 445,
    joinDate: "2024-01-01",
    lastActive: "1 hour ago",
    status: "active",
    permissions: ["governance", "treasury", "admin", "council", "system"],
  },
]

export function MemberGrid() {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Council Member":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Core Contributor":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Project Lead":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Contributor":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  const getRoleIcon = (role: string) => {
    if (role === "Administrator" || role === "Council Member") {
      return <Crown className="h-3 w-3" />
    }
    if (role === "Core Contributor" || role === "Project Lead") {
      return <Shield className="h-3 w-3" />
    }
    return null
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
            <Input placeholder="Search members..." className="pl-10 bg-muted border-border" />
          </div>

          <Select>
            <SelectTrigger className="w-32 bg-muted border-border">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="council">Council Member</SelectItem>
              <SelectItem value="core">Core Contributor</SelectItem>
              <SelectItem value="lead">Project Lead</SelectItem>
              <SelectItem value="contributor">Contributor</SelectItem>
              <SelectItem value="member">Community Member</SelectItem>
            </SelectContent>
          </Select>

          <Select>
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
          {members.map((member) => (
            <div key={member.id} className="border border-border rounded-lg p-4 dao-card-hover cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{member.name}</h4>
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1">{member.role}</span>
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="font-mono">{member.address}</span>
                      <span>•</span>
                      <span>Joined {member.joinDate}</span>
                      <span>•</span>
                      <span>Last active {member.lastActive}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.subDAOs.slice(0, 2).map((subdao) => (
                        <Badge key={subdao} variant="outline" className="text-xs">
                          {subdao}
                        </Badge>
                      ))}
                      {member.subDAOs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.subDAOs.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right text-sm">
                    <div className="text-foreground font-medium">Rep: {member.reputation}</div>
                    <div className="text-muted-foreground">{member.votingPower} voting power</div>
                    <div className="text-muted-foreground">{member.contributions} contributions</div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline">Load More Members</Button>
        </div>
      </div>
    </Card>
  )
}
