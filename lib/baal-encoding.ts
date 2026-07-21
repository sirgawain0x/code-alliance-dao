import { getBytes, Interface, solidityPacked, ZeroAddress } from "ethers"

import { BAAL_ABI, ERC20_ABI, MULTISEND_ABI } from "@/config/abis/baal"

export interface MetaTransaction {
  to: string
  value: bigint
  data: string
  operation: number
}

const baalInterface = new Interface(BAAL_ABI)
const erc20Interface = new Interface(ERC20_ABI)
const multiSendInterface = new Interface(MULTISEND_ABI)

function encodeMetaTransaction(tx: MetaTransaction): string {
  const data = getBytes(tx.data || "0x")
  return solidityPacked(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [tx.operation, tx.to, tx.value, data.length, data]
  )
}

/** Pack Safe-style meta-txs and wrap as `multiSend(bytes)` calldata for Baal. */
export function encodeMultiSendProposalData(txs: MetaTransaction[]): string {
  if (txs.length === 0) return "0x"

  const packed =
    "0x" +
    txs
      .map((tx) => encodeMetaTransaction(tx).slice(2))
      .join("")

  return multiSendInterface.encodeFunctionData("multiSend", [packed])
}

export function encodeSignalProposalData(): string {
  return "0x"
}

export function encodeMintSharesProposalData({
  baalAddress,
  recipients,
  amounts,
}: {
  baalAddress: string
  recipients: string[]
  amounts: bigint[]
}): string {
  const data = baalInterface.encodeFunctionData("mintShares", [recipients, amounts])
  return encodeMultiSendProposalData([
    { to: baalAddress, value: BigInt(0), data, operation: 0 },
  ])
}

export function encodeMintLootProposalData({
  baalAddress,
  recipients,
  amounts,
}: {
  baalAddress: string
  recipients: string[]
  amounts: bigint[]
}): string {
  const data = baalInterface.encodeFunctionData("mintLoot", [recipients, amounts])
  return encodeMultiSendProposalData([
    { to: baalAddress, value: BigInt(0), data, operation: 0 },
  ])
}

export function encodeTreasuryTransferProposalData({
  tokenAddress,
  recipient,
  amount,
}: {
  tokenAddress?: string | null
  recipient: string
  amount: bigint
}): string {
  const isNative = !tokenAddress || tokenAddress === ZeroAddress

  if (isNative) {
    return encodeMultiSendProposalData([
      { to: recipient, value: amount, data: "0x", operation: 0 },
    ])
  }

  const data = erc20Interface.encodeFunctionData("transfer", [recipient, amount])
  return encodeMultiSendProposalData([
    { to: tokenAddress, value: BigInt(0), data, operation: 0 },
  ])
}

export function buildProposalDetails({
  title,
  description,
  proposalType,
}: {
  title: string
  description: string
  proposalType: string
}): string {
  return JSON.stringify({
    title,
    description,
    proposalType,
    contentURI: "",
    contentURIType: "",
  })
}
