"use client"

import { useMemo, useState } from "react"
import { parseUnits } from "ethers"
import { Loader2, Plus } from "lucide-react"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BASE_USDC_ADDRESS } from "@/config/constants"
import { useBaalActions } from "@/hooks/useBaalActions"
import { useOnchainMembershipProfile } from "@/hooks/useOnchainMembershipProfile"
import type { ProposeKind } from "@/services/baal-actions"

const PROPOSAL_KINDS: { value: ProposeKind; label: string }[] = [
  { value: "signal", label: "Signal (no on-chain action)" },
  { value: "issueShares", label: "Issue voting shares (vCRTV)" },
  { value: "issueLoot", label: "Issue loot (nvCRTV)" },
  { value: "transfer", label: "Treasury transfer" },
]

interface CreateProposalFormProps {
  onClose?: () => void
}

export function CreateProposalForm({ onClose }: CreateProposalFormProps) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { primaryProfile } = useOnchainMembershipProfile({
    chainId: "8453",
    daoAddress: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })
  const { propose, isPending, state, reset } = useBaalActions({
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const [kind, setKind] = useState<ProposeKind>("signal")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [recipient, setRecipient] = useState(address || "")
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState<"eth" | "usdc">("eth")
  const [formError, setFormError] = useState<string | null>(null)

  const canCreate = Boolean(primaryProfile?.capabilities.canCreateProposal)

  const helper = useMemo(() => {
    if (kind === "signal") return "Records member intent without executing actions."
    if (kind === "issueShares") return "Mints voting shares to a recipient if the proposal passes."
    if (kind === "issueLoot") return "Mints non-voting loot to a recipient if the proposal passes."
    return "Sends ETH or USDC from the DAO Safe if the proposal passes."
  }, [kind])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim()) return

    setFormError(null)
    reset()

    try {
      const base = {
        kind,
        title: title.trim(),
        description: description.trim(),
      }

      if (kind === "signal") {
        await propose(base)
        return
      }

      if (kind === "issueShares" || kind === "issueLoot") {
        if (!recipient || !amount) throw new Error("Recipient and amount are required")
        await propose({
          ...base,
          recipient,
          amountWei: parseUnits(amount, 18),
        })
        return
      }

      if (!recipient || !amount) throw new Error("Recipient and amount are required")
      await propose({
        ...base,
        transferRecipient: recipient,
        transferAmountWei:
          token === "usdc" ? parseUnits(amount, 6) : parseUnits(amount, 18),
        tokenAddress: token === "usdc" ? BASE_USDC_ADDRESS : null,
      })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to submit proposal")
    }
  }

  return (
    <Card className="stat-card-gradient p-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">Create Proposal</h3>
          {onClose && (
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{helper}</p>

        {!isConnected ? (
          <Alert>
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>Connect a wallet to create proposals on-chain.</p>
              <Button type="button" size="sm" onClick={() => open()}>
                Connect Wallet
              </Button>
            </AlertDescription>
          </Alert>
        ) : !canCreate ? (
          <Alert>
            <AlertTitle>Voting shares required</AlertTitle>
            <AlertDescription>
              Your connected wallet needs vCRTV voting shares (or admin) to submit proposals.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={kind} onValueChange={(value) => setKind(value as ProposeKind)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPOSAL_KINDS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposal-title">Title</Label>
          <Input
            id="proposal-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Proposal title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposal-description">Description</Label>
          <Textarea
            id="proposal-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain the proposal"
            className="min-h-28"
          />
        </div>

        {kind !== "signal" && (
          <div className="space-y-2">
            <Label htmlFor="proposal-recipient">Recipient</Label>
            <Input
              id="proposal-recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="0x..."
              required
            />
          </div>
        )}

        {(kind === "issueShares" || kind === "issueLoot") && (
          <div className="space-y-2">
            <Label htmlFor="proposal-amount">Amount</Label>
            <Input
              id="proposal-amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="100"
              required
            />
          </div>
        )}

        {kind === "transfer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={token} onValueChange={(value) => setToken(value as "eth" | "usdc")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount</Label>
              <Input
                id="transfer-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder={token === "usdc" ? "100" : "0.1"}
                required
              />
            </div>
          </div>
        )}

        {(state.status === "error" || formError) && (
          <Alert variant="destructive">
            <AlertTitle>Transaction failed</AlertTitle>
            <AlertDescription>{formError || state.error}</AlertDescription>
          </Alert>
        )}

        {state.status === "success" && (
          <Alert>
            <AlertTitle>Proposal submitted</AlertTitle>
            <AlertDescription>
              Tx {state.hash?.slice(0, 10)}… — it may take a moment to appear in the list.
            </AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <Button type="button" className="gap-2" onClick={() => open()}>
            Connect Wallet
          </Button>
        ) : (
          <Button type="submit" disabled={!canCreate || isPending || !title.trim()} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isPending ? "Confirm in wallet…" : "Submit Proposal"}
          </Button>
        )}
      </form>
    </Card>
  )
}
