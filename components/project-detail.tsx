"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Rocket, Users, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { formatUnits } from "ethers"
import { useYeeter } from "@/hooks/useYeeter"
import { useYeets } from "@/hooks/useYeets"
import { calcProgressPerc } from "@/utils/yeeter-data-helpers"
import { getOffchainEcosystemProduct } from "@/config/offchain-ecosystem"
import { Skeleton } from "@/components/ui/skeleton"
import { getBlockExplorerUrl } from "@/utils/endpoints"

interface ProjectDetailProps {
  projectId: string
}

const BASE = "8453"

function YeeterProjectView({ yeeterid }: { yeeterid: string }) {
  const { yeeter, isLoading, isError } = useYeeter({ chainid: BASE, yeeterid })
  const { yeets, isLoading: yeetsLoading } = useYeets({ chainid: BASE, yeeterid })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isError || !yeeter) {
    return (
      <Card className="stat-card-gradient p-6">
        <p className="text-muted-foreground">
          No yeeter campaign found for this id. Confirm the address and that the graph key is configured.
        </p>
      </Card>
    )
  }

  const progress = Math.min(100, Math.round(calcProgressPerc(yeeter.balance, yeeter.goal)))
  const raised = Number(formatUnits(yeeter.balance, 18))
  const goal = Number(formatUnits(yeeter.goal, 18))
  const minT = Number(formatUnits(yeeter.minTribute, 18))
  const maxT = Number(formatUnits(yeeter.maxTribute, 18))
  const explorer = getBlockExplorerUrl({ chainid: BASE, address: yeeterid })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Rocket className="h-3 w-3" />
              Yeeter
            </Badge>
            {yeeter.isActive ? (
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
            ) : null}
            {yeeter.isEnded ? <Badge variant="secondary">Ended</Badge> : null}
            {yeeter.isComingSoon ? <Badge variant="outline">Upcoming</Badge> : null}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{yeeter.dao?.name || "Fundraising campaign"}</h1>
          <p className="text-sm text-muted-foreground">
            Moloch DAO:{" "}
            <Link className="text-primary underline-offset-4 hover:underline" href={explorer} target="_blank">
              {yeeter.dao?.id}
            </Link>
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`https://admin.daohaus.club/#/molochv3/0x2105/${yeeter.dao?.id}`} target="_blank" rel="noreferrer">
            DAO admin
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-2xl font-bold">{progress}%</p>
        </Card>
        <Card className="stat-card-gradient p-6">
          <p className="text-sm text-muted-foreground">Raised</p>
          <p className="text-2xl font-bold">{raised.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
        </Card>
        <Card className="stat-card-gradient p-6">
          <p className="text-sm text-muted-foreground">Goal</p>
          <p className="text-2xl font-bold">{goal.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
        </Card>
        <Card className="stat-card-gradient p-6">
          <p className="text-sm text-muted-foreground">Members (DAO)</p>
          <p className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-muted-foreground" />
            {yeeter.dao.activeMemberCount ?? "—"}
          </p>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Campaign fill</span>
          <span>
            {raised.toLocaleString()} / {goal.toLocaleString()}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Min tribute {minT.toLocaleString()} · Max tribute {maxT.toLocaleString()}
        </p>
      </div>

      <Tabs defaultValue="window">
        <TabsList>
          <TabsTrigger value="window">Timeline</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
        </TabsList>
        <TabsContent value="window" className="space-y-3">
          <Card className="stat-card-gradient p-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start</span>
              <span>{formatDistanceToNow(new Date(Number(yeeter.startTime) * 1000), { addSuffix: true })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End</span>
              <span>{formatDistanceToNow(new Date(Number(yeeter.endTime) * 1000), { addSuffix: true })}</span>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="contributors">
          <Card className="stat-card-gradient p-6">
            {yeetsLoading ? (
              <p className="text-sm text-muted-foreground">Loading contributions…</p>
            ) : !yeets?.length ? (
              <p className="text-sm text-muted-foreground">No indexed contributions yet.</p>
            ) : (
              <ul className="space-y-3">
                {yeets.slice(0, 40).map((y) => (
                  <li key={y.id} className="flex justify-between gap-4 text-sm border-b border-border/60 pb-2">
                    <span className="font-mono text-muted-foreground">
                      {y.member?.memberAddress
                        ? `${y.member.memberAddress.slice(0, 6)}…${y.member.memberAddress.slice(-4)}`
                        : "—"}
                    </span>
                    <span className="text-foreground">
                      {Number(formatUnits(y.amount, 18)).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </span>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(Number(y.createdAt) * 1000), { addSuffix: true })}
                    </span>
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

function OffchainProjectView({ id }: { id: string }) {
  const product = getOffchainEcosystemProduct(id)
  if (!product) {
    return (
      <Card className="stat-card-gradient p-6">
        <p className="text-muted-foreground">Unknown project id.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{product.category}</Badge>
          <Badge variant="secondary">{product.status}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
        <p className="text-muted-foreground max-w-3xl">{product.description}</p>
      </div>
      <Button asChild>
        <Link href={product.url} target="_blank" rel="noopener noreferrer">
          Open product
          <ExternalLink className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const off = getOffchainEcosystemProduct(projectId)
  if (off) return <OffchainProjectView id={projectId} />

  const normalized = projectId?.toLowerCase() || ""
  if (/^0x[a-f0-9]{40}$/.test(normalized)) return <YeeterProjectView yeeterid={normalized} />

  return (
    <Card className="stat-card-gradient p-6">
      <p className="text-muted-foreground">
        Use a yeeter contract address (0x…) or pick an ecosystem product from the projects grid.
      </p>
    </Card>
  )
}
