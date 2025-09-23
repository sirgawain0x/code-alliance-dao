import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Crown, Shield, Users, Settings } from "lucide-react"

const roles = [
  {
    name: "Administrator",
    description: "Full system access and management",
    members: 8,
    permissions: ["System Admin", "Treasury", "Governance", "User Management"],
    color: "text-red-400",
    icon: Crown,
    level: "system",
  },
  {
    name: "Council Member",
    description: "Strategic decision making and oversight",
    members: 15,
    permissions: ["Governance", "Treasury", "SubDAO Oversight"],
    color: "text-purple-400",
    icon: Crown,
    level: "governance",
  },
  {
    name: "Core Contributor",
    description: "Key contributors with elevated privileges",
    members: 45,
    permissions: ["Governance", "Project Management", "Treasury View"],
    color: "text-blue-400",
    icon: Shield,
    level: "contributor",
  },
  {
    name: "Project Lead",
    description: "Lead specific projects and initiatives",
    members: 89,
    permissions: ["Governance", "Project Management"],
    color: "text-green-400",
    icon: Shield,
    level: "contributor",
  },
  {
    name: "Contributor",
    description: "Active contributors to DAO initiatives",
    members: 234,
    permissions: ["Governance", "Limited Project Access"],
    color: "text-yellow-400",
    icon: Users,
    level: "member",
  },
  {
    name: "Community Member",
    description: "General community participation",
    members: 856,
    permissions: ["Governance"],
    color: "text-gray-400",
    icon: Users,
    level: "member",
  },
]

const permissions = [
  { name: "System Admin", description: "Full system administration", critical: true },
  { name: "Treasury", description: "Treasury management and oversight", critical: true },
  { name: "Governance", description: "Voting and proposal creation", critical: false },
  { name: "User Management", description: "Manage user roles and permissions", critical: true },
  { name: "SubDAO Oversight", description: "Manage and oversee SubDAOs", critical: false },
  { name: "Project Management", description: "Create and manage projects", critical: false },
  { name: "Treasury View", description: "View treasury information", critical: false },
]

export function RoleManagement() {
  const totalMembers = roles.reduce((sum, role) => sum + role.members, 0)

  return (
    <div className="space-y-6">
      {/* Role Overview */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Role Management</h3>
            <Button size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>

          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.name} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <role.icon className={`h-4 w-4 ${role.color}`} />
                    <span className="font-medium text-foreground text-sm">{role.name}</span>
                  </div>
                  <span className="text-sm text-foreground">{role.members}</span>
                </div>

                <p className="text-xs text-muted-foreground">{role.description}</p>

                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 2).map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                  {role.permissions.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <Progress value={(role.members / totalMembers) * 100} className="h-1" />
                  <div className="text-xs text-muted-foreground text-right">
                    {((role.members / totalMembers) * 100).toFixed(1)}% of members
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Permission Matrix */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Permissions</h3>

          <div className="space-y-2">
            {permissions.map((permission) => (
              <div key={permission.name} className="flex items-center justify-between p-2 border border-border rounded">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{permission.name}</span>
                    {permission.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>

          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              Create New Role
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              Bulk Role Assignment
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              Permission Audit
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              Role Templates
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
