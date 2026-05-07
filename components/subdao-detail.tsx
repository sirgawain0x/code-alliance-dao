"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, FileText, Settings, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { formatEther } from "ethers"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"
import { getDaoHausAdminProposalsUrl } from "@/lib/dao-haus-links"
import { parseSubDaoRoute, chainidForHooks } from "@/utils/subdao-route"
import { useDao } from "@/hooks/useDao"
import { useDaoMembers } from "@/hooks/useDaoMembers"
import { useDaoProposals } from "@/hooks/useDaoProposals"
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances"
import { summarizeTreasuryTokens } from "@/utils/treasury-helpers"
import { isSupportedSubgraphChain } from "@/utils/endpoints"
import { ProposalItem } from "@/utils/daotypes"
import { useMemo } from "react"

interface SubDAODetailProps {
  subDAOId: string
}

function proposalStatus(p: ProposalItem): string {
  const now = Date.now() / 1000
  if (p.cancelled) return "cancelled"
  if (p.processed) return "processed"
  if (Number(p.votingEnds) > now) return "active"
  return p.passed ? "passed" : "failed"
}

export function SubDAODetail({ subDAOId }: SubDAODetailProps) {
  const parsed = parseSubDaoRoute(subDAOId)
  const chainid = parsed ? chainidForHooks(parsed.chainid) : ""
  const daoid = parsed?.daoid
  const supported =
    Boolean(parsed && chainid && daoid) &&
    isSupportedSubgraphChain({ chainid, subgraphKey: "DAOHAUS" })

  const graphChainid = supported ? chainid : undefined
  const graphDaoid = supported ? daoid : undefined

  const { dao, isLoading: daoLoading, isError: daoError } = useDao({
    chainid: graphChainid,
    daoid: graphDaoid,
  })

  const { members, isLoading: membersLoading } = useDaoMembers({
    chainid: graphChainid,
    daoid: graphDaoid,
  })

  const { proposals, isLoading: proposalsLoading } = useDaoProposals({
    chainid: graphChainid,
    daoid: graphDaoid,
    queryOptions: { first: 25, orderBy: "createdAt", orderDirection: "desc" },
  })

  const { tokens, isLoading: tokensLoading } = useDaoTokenBalances({
    chainid: graphChainid,
    safeAddress: dao?.safeAddress,
  })

  const treasurySummary = useMemo(() => summarizeTreasuryTokens(tokens), [tokens])

  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })
  const adminProposalsUrl = getDaoHausAdminProposalsUrl()
  const canCreateProposal = Boolean(primaryProfile?.capabilities.canCreateProposal)
  const createProposalReady = canCreateProposal && Boolean(adminProposalsUrl)

  if (!parsed) {
    return (
      <Card className="stat-card-gradient p-6">
        <p className="text-muted-foreground">
          Invalid SubDAO link. Use <span className="font-mono">0xchain_0xdao</span> (e.g.{" "}
          <span className="font-mono">0x2105_0x…</span>) or a plain Moloch address on Base.
        </p>
      </Card>
    )
  }

  if (!supported) {
    return (
      <Card className="stat-card-gradient p-6">
        <p className="text-muted-foreground">This chain is not configured for DAOhaus subgraphs in this app.</p>
      </Card>
    )
  }

  if (daoLoading) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg" />
  }

  if (daoError || !dao) {
    return (
      <Card className="stat-card-gradient p-6">
        <p className="text-muted-foreground">Could not load this DAO from the subgraph.</p>
      </Card>
    )
  }

  const memberCount = Number(dao.activeMemberCount) || 0
  const shamans = dao.shamen?.length ?? 0
  const passed = proposals?.filter((p) => p.passed).length || 0
  const totalP = proposals?.length || 0
  const passRate = totalP > 0 ? Math.round((passed / totalP) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
            {dao.name?.slice(0, 1)?.toUpperCase() || "D"}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold text-foreground">{dao.name}</h1>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Moloch v3</Badge>
            </div>
            <p className="text-muted-foreground mb-2 max-w-2xl">
              {dao.profile?.description || dao.profile?.longDescription || "DAO details from on-chain indexers."}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                Created {formatDistanceToNow(new Date(Number(dao.createdAt) * 1000), { addSuffix: true })}
              </span>
              <span>•</span>
              <span className="font-mono text-xs">{dao.id}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`https://admin.daohaus.club/#/molochv3/${`0x${parseInt(chainid, 10).toString(16)}`}/${dao.id}`} target="_blank" rel="noreferrer">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </Button>
          {createProposalReady ? (
            <Button asChild>
              <Link href={adminProposalsUrl!} target="_blank" rel="noopener noreferrer">
                Create Proposal
              </Link>
            </Button>
          ) : (
            <Button disabled title="Requires shares on parent DAO and admin URL">
              Create Proposal
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold text-foreground">{memberCount}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stables (est.)</p>
              <p className="text-2xl font-bold text-foreground">{treasurySummary.totalStableUsdFormatted}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Shamans</p>
              <p className="text-2xl font-bold text-foreground">{shamans}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pass rate</p>
              <p className="text-2xl font-bold text-foreground">{passRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals">
          <Card className="stat-card-gradient p-6 space-y-4">
            <h3 className="text-lg font-semibold">Recent proposals</h3>
            {proposalsLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : !proposals?.length ? (
              <p className="text-sm text-muted-foreground">No proposals indexed.</p>
            ) : (
              <div className="space-y-3">
                {proposals.slice(0, 12).map((p) => (
                  <div key={p.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium line-clamp-1">{p.title || "Untitled"}</span>
                      <Badge variant="outline">{proposalStatus(p)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(Number(p.createdAt) * 1000), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="stat-card-gradient p-6 space-y-4">
            <h3 className="text-lg font-semibold">Members</h3>
            {membersLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : !members?.length ? (
              <p className="text-sm text-muted-foreground">No members returned.</p>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-y-auto">
                {members.slice(0, 50).map((m) => (
                  <div key={m.id} className="flex justify-between text-sm border-b border-border/50 py-2">
                    <span className="font-mono text-xs">{m.memberAddress}</span>
                    <span className="text-muted-foreground">{Math.round(Number(formatEther(m.shares)))} shares</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="treasury">
          <Card className="stat-card-gradient p-6 space-y-4">
            <h3 className="text-lg font-semibold">Token balances</h3>
            <p className="text-sm text-muted-foreground">
              Safe: <span className="font-mono">{dao.safeAddress}</span>
            </p>
            {tokensLoading ? (
              <p className="text-sm text-muted-foreground">Loading balances…</p>
            ) : !tokens?.length ? (
              <p className="text-sm text-muted-foreground">No balances from the indexer (check Sequence key).</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {treasurySummary.tokenLines.map((t) => (
                  <li key={t.symbol} className="flex justify-between">
                    <span>{t.symbol}</span>
                    <span className="text-muted-foreground">{t.balanceFormatted}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
