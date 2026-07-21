import {
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  TransactionResponse,
} from "ethers"

import { BAAL_ABI } from "@/config/abis/baal"
import { BASE_CHAIN_ID, CREATIVE_ORG_BAAL_ADDRESS } from "@/config/constants"
import {
  buildProposalDetails,
  encodeMintLootProposalData,
  encodeMintSharesProposalData,
  encodeSignalProposalData,
  encodeTreasuryTransferProposalData,
} from "@/lib/baal-encoding"

export interface BaalTxResult {
  hash: string
  response: TransactionResponse
}

export type ProposeKind = "signal" | "issueShares" | "issueLoot" | "transfer"

export interface SubmitProposalInput {
  kind: ProposeKind
  title: string
  description: string
  expiration?: number
  baalGas?: bigint
  recipient?: string
  amountWei?: bigint
  tokenAddress?: string | null
  transferRecipient?: string
  transferAmountWei?: bigint
  proposalOfferingWei?: bigint
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
  if (Number(network.chainId) !== BASE_CHAIN_ID)
    throw new Error("Switch to Base network to interact with this DAO")

  return provider.getSigner()
}

function getBaal(signer: JsonRpcSigner, baalAddress: string = CREATIVE_ORG_BAAL_ADDRESS) {
  return new Contract(baalAddress, BAAL_ABI, signer)
}

function encodeProposalData({
  kind,
  baalAddress,
  recipient,
  amountWei,
  tokenAddress,
  transferRecipient,
  transferAmountWei,
}: {
  kind: ProposeKind
  baalAddress: string
  recipient?: string
  amountWei?: bigint
  tokenAddress?: string | null
  transferRecipient?: string
  transferAmountWei?: bigint
}): string {
  if (kind === "signal") return encodeSignalProposalData()

  if (kind === "issueShares") {
    if (!recipient || amountWei === undefined)
      throw new Error("Recipient and amount are required to issue shares")
    return encodeMintSharesProposalData({
      baalAddress,
      recipients: [recipient],
      amounts: [amountWei],
    })
  }

  if (kind === "issueLoot") {
    if (!recipient || amountWei === undefined)
      throw new Error("Recipient and amount are required to issue loot")
    return encodeMintLootProposalData({
      baalAddress,
      recipients: [recipient],
      amounts: [amountWei],
    })
  }

  if (kind === "transfer") {
    if (!transferRecipient || transferAmountWei === undefined)
      throw new Error("Recipient and amount are required for treasury transfer")
    return encodeTreasuryTransferProposalData({
      tokenAddress,
      recipient: transferRecipient,
      amount: transferAmountWei,
    })
  }

  throw new Error("Unsupported proposal type")
}

export async function submitBaalProposal({
  input,
  baalAddress = CREATIVE_ORG_BAAL_ADDRESS,
}: {
  input: SubmitProposalInput
  baalAddress?: string
}): Promise<BaalTxResult> {
  try {
    const signer = await getSigner()
    const baal = getBaal(signer, baalAddress)

    const proposalTypeMap: Record<ProposeKind, string> = {
      signal: "SIGNAL",
      issueShares: "ISSUE_SHARES",
      issueLoot: "ISSUE_LOOT",
      transfer: "TRANSFER",
    }

    const proposalData = encodeProposalData({
      kind: input.kind,
      baalAddress,
      recipient: input.recipient,
      amountWei: input.amountWei,
      tokenAddress: input.tokenAddress,
      transferRecipient: input.transferRecipient,
      transferAmountWei: input.transferAmountWei,
    })

    const details = buildProposalDetails({
      title: input.title,
      description: input.description,
      proposalType: proposalTypeMap[input.kind],
    })

    const offering =
      input.proposalOfferingWei ??
      (await baal.proposalOffering().catch(() => BigInt(0)))

    const response = await baal.submitProposal(
      proposalData,
      input.expiration ?? 0,
      input.baalGas ?? BigInt(0),
      details,
      { value: offering }
    )

    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function sponsorBaalProposal({
  proposalId,
  baalAddress = CREATIVE_ORG_BAAL_ADDRESS,
}: {
  proposalId: number
  baalAddress?: string
}): Promise<BaalTxResult> {
  try {
    const signer = await getSigner()
    const baal = getBaal(signer, baalAddress)
    const response = await baal.sponsorProposal(proposalId)
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function submitBaalVote({
  proposalId,
  approved,
  baalAddress = CREATIVE_ORG_BAAL_ADDRESS,
}: {
  proposalId: number
  approved: boolean
  baalAddress?: string
}): Promise<BaalTxResult> {
  try {
    const signer = await getSigner()
    const baal = getBaal(signer, baalAddress)
    const response = await baal.submitVote(proposalId, approved)
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function processBaalProposal({
  proposalId,
  proposalData,
  baalAddress = CREATIVE_ORG_BAAL_ADDRESS,
}: {
  proposalId: number
  proposalData: string
  baalAddress?: string
}): Promise<BaalTxResult> {
  try {
    if (proposalData == null)
      throw new Error("Missing proposalData required to process")

    const signer = await getSigner()
    const baal = getBaal(signer, baalAddress)
    const response = await baal.processProposal(proposalId, proposalData || "0x")
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function ragequitBaal({
  to,
  sharesToBurn,
  lootToBurn,
  tokens,
  baalAddress = CREATIVE_ORG_BAAL_ADDRESS,
}: {
  to: string
  sharesToBurn: bigint
  lootToBurn: bigint
  tokens: string[]
  baalAddress?: string
}): Promise<BaalTxResult> {
  try {
    if (sharesToBurn <= BigInt(0) && lootToBurn <= BigInt(0))
      throw new Error("Enter shares or loot to burn")

    const signer = await getSigner()
    const baal = getBaal(signer, baalAddress)
    const response = await baal.ragequit(to, sharesToBurn, lootToBurn, tokens)
    return { hash: response.hash, response }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export function parseProposalNumericId(proposalId: string | number): number {
  if (typeof proposalId === "number") return proposalId
  const asNumber = Number(proposalId)
  if (!Number.isNaN(asNumber) && proposalId.trim() === String(asNumber))
    return asNumber

  const parts = proposalId.split("-")
  const last = parts[parts.length - 1]
  const parsed = Number(last)
  if (Number.isNaN(parsed)) throw new Error(`Invalid proposal id: ${proposalId}`)
  return parsed
}
