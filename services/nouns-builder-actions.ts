import {
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  TransactionResponse,
} from "ethers"
import { governorAbi } from "@buildeross/sdk/contract"

import { getAnnouncedBillContracts } from "@/lib/announced-bill-config"

const OPTIMISM_CHAIN_ID = 10

export interface NounsBuilderTxResult {
  hash: string
  response: TransactionResponse
}

interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "Transaction failed"
}

async function getSigner(): Promise<JsonRpcSigner> {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("No browser wallet provider found")

  const provider = new BrowserProvider(window.ethereum as unknown as Eip1193Provider)
  const network = await provider.getNetwork()
  if (Number(network.chainId) !== OPTIMISM_CHAIN_ID)
    throw new Error("Switch to Optimism to interact with Announced Bill")

  return provider.getSigner()
}

function getGovernor(signer: JsonRpcSigner) {
  const { governor } = getAnnouncedBillContracts()
  return new Contract(governor, governorAbi, signer)
}

export async function submitNounsVote({
  proposalId,
  support,
  reason,
}: {
  proposalId: string
  support: 0 | 1 | 2
  reason?: string
}): Promise<NounsBuilderTxResult> {
  try {
    const signer = await getSigner()
    const governor = getGovernor(signer)

    const response = reason
      ? await governor.castVoteWithReason(proposalId, support, reason)
      : await governor.castVote(proposalId, support)

    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function submitNounsProposal({
  title,
  body,
}: {
  title: string
  body: string
}): Promise<NounsBuilderTxResult> {
  try {
    const signer = await getSigner()
    const governor = getGovernor(signer)
    const description = `# ${title.trim()}\n\n${body.trim()}`

    const response = await governor.propose([], [], [], description)
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function queueNounsProposal({
  proposalId,
}: {
  proposalId: string
}): Promise<NounsBuilderTxResult> {
  try {
    const signer = await getSigner()
    const governor = getGovernor(signer)
    const response = await governor.queue(proposalId)
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function executeNounsProposal({
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
}): Promise<NounsBuilderTxResult> {
  try {
    const signer = await getSigner()
    const governor = getGovernor(signer)
    const response = await governor.execute(
      targets,
      values,
      calldatas,
      descriptionHash,
      proposer
    )
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
