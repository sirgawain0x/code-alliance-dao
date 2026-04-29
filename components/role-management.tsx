 "use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"
import { Crown, Shield, Users, Wallet } from "lucide-react"

function formatWallet(address?: string): string {
  if (!address) return "Not connected"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function RoleManagement() {
  const { walletAddress, profiles, primaryProfile, isLoading, isConnected } =
    useOnchainMembershipProfile({
      chainId: "8453",
      daoAddress: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
    })

  if (!isConnected) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">On-chain Access</h3>
          <p className="text-sm text-muted-foreground">
            Connect a wallet to load DAO memberships, holdings, and permissions.
          </p>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-3">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">On-chain Role Summary</h3>
            <p className="text-xs text-muted-foreground">
              Wallet {formatWallet(walletAddress)} is in {profiles.length} DAO(s)
            </p>
          </div>

          <div className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.daoId} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono text-muted-foreground">{profile.daoAddress}</span>
                  <div className="flex gap-1">
                    <Badge
                      className={
                        profile.isAdmin
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }
                    >
                      {profile.isAdmin ? "Admin" : profile.isVotingMember ? "Voting" : "Member"}
                    </Badge>
                    {profile.isNonVotingMember && (
                      <Badge className="bg-gray-500/10 text-gray-300 border-gray-500/20">
                        Non-voting
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded border border-border p-2">
                    <p className="text-muted-foreground">Shares</p>
                    <p className="text-foreground font-semibold">{profile.holdings.shares}</p>
                  </div>
                  <div className="rounded border border-border p-2">
                    <p className="text-muted-foreground">Loot</p>
                    <p className="text-foreground font-semibold">{profile.holdings.loot}</p>
                  </div>
                  <div className="rounded border border-border p-2">
                    <p className="text-muted-foreground">NFTs</p>
                    <p className="text-foreground font-semibold">{profile.holdings.nftBalance}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Admin source: {profile.sources.adminSource}
                  {profile.sources.ownerAddress && (
                    <span className="font-mono"> ({formatWallet(profile.sources.ownerAddress)})</span>
                  )}
                </div>
              </div>
            ))}
            {!profiles.length && (
              <p className="text-sm text-muted-foreground">No DAO memberships found for this wallet.</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Current DAO Capability Scope</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between border border-border rounded p-2">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                View DAO data
              </span>
              <Badge variant="outline">{primaryProfile?.capabilities.canViewDao ? "Allowed" : "Blocked"}</Badge>
            </div>
            <div className="flex items-center justify-between border border-border rounded p-2">
              <span className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-400" />
                Vote and create proposals
              </span>
              <Badge variant="outline">
                {primaryProfile?.capabilities.canVote ? "Voting enabled" : "Needs voting shares"}
              </Badge>
            </div>
            <div className="flex items-center justify-between border border-border rounded p-2">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                Manage members
              </span>
              <Badge variant="outline">
                {primaryProfile?.capabilities.canManageMembers ? "Admin only enabled" : "Admin only blocked"}
              </Badge>
            </div>
            <div className="flex items-center justify-between border border-border rounded p-2">
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-400" />
                View treasury
              </span>
              <Badge variant="outline">
                {primaryProfile?.capabilities.canViewTreasury ? "Allowed" : "Blocked"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
