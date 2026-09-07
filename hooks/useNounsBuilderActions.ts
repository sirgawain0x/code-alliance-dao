"use client"

import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { optimism } from "@reown/appkit/networks"

import {
  executeNounsProposal,
  queueNounsProposal,
  submitNounsProposal,
  submitNounsVote,
} from "@/services/nouns-builder-actions"
import { getAnnouncedBillContracts } from "@/lib/announced-bill-config"

export type NounsActionStatus = "idle" | "pending" | "success" | "error"

export interface NounsActionState {
  status: NounsActionStatus
  hash?: string
  error?: string
  lastAction?: string
}

export function useNounsBuilderActions() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const queryClient = useQueryClient()
  const [state, setState] = useState<NounsActionState>({ status: "idle" })
  const contracts = getAnnouncedBillContracts()

  const isOptimism = Number(chainId) === contracts.chainId

  const invalidateGovernance = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["nouns-proposals"] }),
      queryClient.invalidateQueries({ queryKey: ["nouns-proposal"] }),
      queryClient.invalidateQueries({ queryKey: ["nouns-membership"] }),
      queryClient.invalidateQueries({ queryKey: ["nouns-auction"] }),
      queryClient.invalidateQueries({ queryKey: ["nouns-treasury"] }),
    ])
  }, [queryClient])

  const ensureWallet = useCallback(async () => {
    if (!isConnected || !address) {
      open()
      throw new Error("Connect your wallet to continue")
    }
    if (!isOptimism) {
      try {
        await switchNetwork(optimism)
      } catch {
        throw new Error("Please switch to Optimism in your wallet")
      }
    }
  }, [address, isConnected, isOptimism, open, switchNetwork])

  const runAction = useCallback(
    async (
      actionName: string,
      fn: () => Promise<{ hash: string; response: { wait: () => Promise<unknown> } }>
    ) => {
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

  const castVote = useCallback(
    async ({
      proposalId,
      support,
      reason,
    }: {
      proposalId: string
      support: 0 | 1 | 2
      reason?: string
    }) =>
      runAction(support === 1 ? "vote-for" : support === 0 ? "vote-against" : "vote-abstain", () =>
        submitNounsVote({ proposalId, support, reason })
      ),
    [runAction]
  )

  const propose = useCallback(
    async ({ title, body }: { title: string; body: string }) =>
      runAction("propose", () => submitNounsProposal({ title, body })),
    [runAction]
  )

  const queue = useCallback(
    async ({ proposalId }: { proposalId: string }) =>
      runAction("queue", () => queueNounsProposal({ proposalId })),
    [runAction]
  )

  const execute = useCallback(
    async ({
      targets,
      values,
      calldatas,
      descriptionHash,
      proposer,
    }: {
      targets: string[]
      values: bigint[]
      calldatas: string[]
      descriptionHash: string
      proposer: string
    }) =>
      runAction("execute", () =>
        executeNounsProposal({ targets, values, calldatas, descriptionHash, proposer })
      ),
    [runAction]
  )

  const reset = useCallback(() => setState({ status: "idle" }), [])

  return {
    castVote,
    propose,
    queue,
    execute,
    isPending: state.status === "pending",
    state,
    reset,
    isOptimism,
    contracts,
  }
}
