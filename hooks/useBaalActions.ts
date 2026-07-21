"use client"

import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { base } from "@reown/appkit/networks"

import { CREATIVE_ORG_BAAL_ADDRESS } from "@/config/constants"
import {
  parseProposalNumericId,
  processBaalProposal,
  ragequitBaal,
  sponsorBaalProposal,
  submitBaalProposal,
  submitBaalVote,
  type SubmitProposalInput,
} from "@/services/baal-actions"

export type BaalActionStatus = "idle" | "pending" | "success" | "error"

export interface BaalActionState {
  status: BaalActionStatus
  hash?: string
  error?: string
  lastAction?: string
}

export function useBaalActions({
  chainid = "8453",
  daoid = CREATIVE_ORG_BAAL_ADDRESS,
}: {
  chainid?: string
  daoid?: string
} = {}) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const queryClient = useQueryClient()
  const [state, setState] = useState<BaalActionState>({ status: "idle" })

  const baalAddress = daoid || CREATIVE_ORG_BAAL_ADDRESS
  const isBase = Number(chainId) === 8453

  const invalidateGovernance = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [`list-proposals`, { chainid, daoid: baalAddress }] }),
      queryClient.invalidateQueries({ queryKey: [`get-dao`, { chainid, daoid: baalAddress }] }),
      queryClient.invalidateQueries({ queryKey: [`list-members`, { chainid, daoid: baalAddress }] }),
      queryClient.invalidateQueries({ queryKey: ["get-proposal"] }),
    ])
  }, [baalAddress, chainid, queryClient])

  const ensureWallet = useCallback(async () => {
    if (!isConnected || !address) {
      open()
      throw new Error("Connect your wallet to continue")
    }
    if (!isBase) {
      try {
        await switchNetwork(base)
      } catch {
        throw new Error("Please switch to Base network in your wallet")
      }
    }
  }, [address, isBase, isConnected, open, switchNetwork])

  const runAction = useCallback(
    async (actionName: string, fn: () => Promise<{ hash: string; response: { wait: () => Promise<unknown> } }>) => {
      setState({ status: "pending", lastAction: actionName })
      try {
        await ensureWallet()
        const { hash, response } = await fn()
        setState({ status: "pending", hash, lastAction: actionName })
        await response.wait()
        await invalidateGovernance()
        setState({ status: "success", hash, lastAction: actionName })
        return hash
      } catch (error) {
        const message = error instanceof Error ? error.message : "Transaction failed"
        setState({ status: "error", error: message, lastAction: actionName })
        throw error
      }
    },
    [ensureWallet, invalidateGovernance]
  )

  const vote = useCallback(
    async ({ proposalId, approved }: { proposalId: string | number; approved: boolean }) => {
      const id = parseProposalNumericId(proposalId)
      return runAction(approved ? "vote-for" : "vote-against", () =>
        submitBaalVote({ proposalId: id, approved, baalAddress })
      )
    },
    [baalAddress, runAction]
  )

  const sponsor = useCallback(
    async ({ proposalId }: { proposalId: string | number }) => {
      const id = parseProposalNumericId(proposalId)
      return runAction("sponsor", () => sponsorBaalProposal({ proposalId: id, baalAddress }))
    },
    [baalAddress, runAction]
  )

  const processProposal = useCallback(
    async ({
      proposalId,
      proposalData,
    }: {
      proposalId: string | number
      proposalData: string
    }) => {
      const id = parseProposalNumericId(proposalId)
      return runAction("process", () =>
        processBaalProposal({ proposalId: id, proposalData, baalAddress })
      )
    },
    [baalAddress, runAction]
  )

  const propose = useCallback(
    async (input: SubmitProposalInput) => {
      return runAction("propose", () => submitBaalProposal({ input, baalAddress }))
    },
    [baalAddress, runAction]
  )

  const ragequit = useCallback(
    async ({
      to,
      sharesToBurn,
      lootToBurn,
      tokens,
    }: {
      to: string
      sharesToBurn: bigint
      lootToBurn: bigint
      tokens: string[]
    }) => {
      return runAction("ragequit", () =>
        ragequitBaal({ to, sharesToBurn, lootToBurn, tokens, baalAddress })
      )
    },
    [baalAddress, runAction]
  )

  const reset = useCallback(() => setState({ status: "idle" }), [])

  return {
    state,
    isPending: state.status === "pending",
    isConnected,
    address,
    isBase,
    vote,
    sponsor,
    processProposal,
    propose,
    ragequit,
    reset,
  }
}
