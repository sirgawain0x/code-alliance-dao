"use client"

import { useMemo, useState } from "react"
import { formatUnits, parseUnits, ZeroAddress } from "ethers"
import { Loader2, LogOut } from "lucide-react"
import { useAppKitAccount } from "@reown/appkit/react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BASE_USDC_ADDRESS,
  CREATIVE_ORG_SAFE_ADDRESS,
  CRTV_TOKEN_ADDRESSES,
} from "@/config/constants"
import { useBaalActions } from "@/hooks/useBaalActions"
import { useMember } from "@/hooks/useMember"
import { useSafeTreasuryBalances } from "@/hooks/useSafeTreasuryBalances"

export function RagequitPanel() {
  const { address, isConnected } = useAppKitAccount()
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  const { member } = useMember({
    chainid: "8453",
    daoid: daoAddress,
    memberaddress: address?.toLowerCase(),
  })
  const { data: treasury } = useSafeTreasuryBalances({
    chainId: "8453",
    daoAddress,
    safeAddress: CREATIVE_ORG_SAFE_ADDRESS,
  })
  const { ragequit, isPending, state, reset } = useBaalActions({ daoid: daoAddress })

  const sharesBalance = member?.shares ? formatUnits(member.shares, 18) : "0"
  const lootBalance = member?.loot ? formatUnits(member.loot, 18) : "0"

  const [sharesToBurn, setSharesToBurn] = useState("")
  const [lootToBurn, setLootToBurn] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const tokenList = useMemo(() => {
    const fromTreasury =
      treasury?.tokens
        .map((token) => token.address)
        .filter((value): value is string => Boolean(value)) || []

    const tokens = Array.from(
      new Set([...fromTreasury, BASE_USDC_ADDRESS, CRTV_TOKEN_ADDRESSES[8453]])
    )

    // Include native ETH (address zero) when Safe holds ETH
    if (treasury && Number(treasury.ethFormatted) > 0) tokens.push(ZeroAddress)

    return tokens
  }, [treasury])

  const canRagequit =
    isConnected &&
    address &&
    (Number(sharesBalance) > 0 || Number(lootBalance) > 0)

  async function handleRagequit(event: React.FormEvent) {
    event.preventDefault()
    if (!address) return

    setFormError(null)
    reset()

    try {
      const sharesWei = sharesToBurn ? parseUnits(sharesToBurn, 18) : BigInt(0)
      const lootWei = lootToBurn ? parseUnits(lootToBurn, 18) : BigInt(0)
      await ragequit({
        to: address,
        sharesToBurn: sharesWei,
        lootToBurn: lootWei,
        tokens: tokenList,
      })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Ragequit failed")
    }
  }

  return (
    <Card className="stat-card-gradient p-6">
      <form className="space-y-4" onSubmit={handleRagequit}>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ragequit</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Burn shares and/or loot to claim a proportional share of Safe tokens.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-border/50 p-3">
            <p className="text-muted-foreground">Your shares</p>
            <p className="font-mono text-foreground">{Number(sharesBalance).toLocaleString()}</p>
          </div>
          <div className="rounded-md border border-border/50 p-3">
            <p className="text-muted-foreground">Your loot</p>
            <p className="font-mono text-foreground">{Number(lootBalance).toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="burn-shares">Shares to burn</Label>
          <Input
            id="burn-shares"
            type="number"
            min="0"
            step="any"
            value={sharesToBurn}
            onChange={(event) => setSharesToBurn(event.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="burn-loot">Loot to burn</Label>
          <Input
            id="burn-loot"
            type="number"
            min="0"
            step="any"
            value={lootToBurn}
            onChange={(event) => setLootToBurn(event.target.value)}
            placeholder="0"
          />
        </div>

        {(state.status === "error" || formError) && (
          <Alert variant="destructive">
            <AlertTitle>Ragequit failed</AlertTitle>
            <AlertDescription>{formError || state.error}</AlertDescription>
          </Alert>
        )}

        {state.status === "success" && (
          <Alert>
            <AlertTitle>Ragequit submitted</AlertTitle>
            <AlertDescription>Tx {state.hash?.slice(0, 10)}…</AlertDescription>
          </Alert>
        )}

        <Button type="submit" variant="destructive" disabled={!canRagequit || isPending} className="gap-2 w-full">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {isPending ? "Confirm in wallet…" : "Ragequit"}
        </Button>
      </form>
    </Card>
  )
}
