"use client"

import { useState } from "react"
import { Loader2, X } from "lucide-react"
import { useAppKitAccount } from "@reown/appkit/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useNounsBuilderActions } from "@/hooks/useNounsBuilderActions"
import { useNounsBuilderMembership } from "@/hooks/useNounsBuilderMembership"

interface NounsCreateProposalFormProps {
  onClose: () => void
}

export function NounsCreateProposalForm({ onClose }: NounsCreateProposalFormProps) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const { isConnected } = useAppKitAccount()
  const { membership, isLoading: membershipLoading } = useNounsBuilderMembership()
  const { propose, isPending, state } = useNounsBuilderActions()

  const canPropose = Boolean(membership?.canPropose)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    await propose({ title: title.trim(), body: body.trim() })
    onClose()
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Create Announced Bill Proposal</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!isConnected ? (
        <p className="text-sm text-muted-foreground">Connect a wallet on Optimism to propose.</p>
      ) : membershipLoading ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking voting power…
        </p>
      ) : !canPropose ? (
        <p className="text-sm text-muted-foreground">
          You need enough Creative Kidz voting power to meet the proposal threshold.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nouns-proposal-title">Title</Label>
            <Input
              id="nouns-proposal-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Proposal title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nouns-proposal-body">Description</Label>
            <Textarea
              id="nouns-proposal-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Describe the proposal in markdown"
              rows={8}
              required
            />
          </div>
          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Submit Proposal
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
