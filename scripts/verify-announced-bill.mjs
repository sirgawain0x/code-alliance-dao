#!/usr/bin/env node
/**
 * Smoke verification for Announced Bill / Creative Kidz Nouns Builder (Optimism).
 * Run: node scripts/verify-announced-bill.mjs
 */
import { createPublicClient, formatEther, http } from "viem"
import { optimism } from "viem/chains"
import { auctionAbi, governorAbi, tokenAbi } from "@buildeross/sdk/contract"
import { getProposals, daoOGMetadataRequest } from "@buildeross/sdk/subgraph"
import { CHAIN_ID } from "@buildeross/types"

const NFT = process.env.NEXT_PUBLIC_ANNOUNCED_BILL_NFT_ADDRESS?.toLowerCase() ||
  "0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02"
const GOVERNOR = process.env.NEXT_PUBLIC_ANNOUNCED_BILL_GOVERNOR_ADDRESS?.toLowerCase() ||
  "0xaa42c1e7e767cefcd41536aa73e03bdf16cf1c34"
const AUCTION = process.env.NEXT_PUBLIC_ANNOUNCED_BILL_AUCTION_ADDRESS?.toLowerCase() ||
  "0x122455e85e1484b299966795c748d0c5e4d1b7f1"
const TREASURY = process.env.NEXT_PUBLIC_ANNOUNCED_BILL_TREASURY_ADDRESS?.toLowerCase() ||
  "0x85a56a9572145260d40e8d8f55c8468c18773da0"

const rpc = process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || "https://mainnet.optimism.io"
const client = createPublicClient({ chain: optimism, transport: http(rpc) })

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const [thresholdBps, quorumBps, votingDelay, votingPeriod, vetoer] = await Promise.all([
  client.readContract({ address: GOVERNOR, abi: governorAbi, functionName: "proposalThresholdBps" }),
  client.readContract({ address: GOVERNOR, abi: governorAbi, functionName: "quorumThresholdBps" }),
  client.readContract({ address: GOVERNOR, abi: governorAbi, functionName: "votingDelay" }),
  client.readContract({ address: GOVERNOR, abi: governorAbi, functionName: "votingPeriod" }),
  client.readContract({ address: GOVERNOR, abi: governorAbi, functionName: "vetoer" }),
])

assert(Number(thresholdBps) === 1000, `proposal threshold expected 1000 bps, got ${thresholdBps}`)
assert(Number(quorumBps) === 2000, `quorum expected 2000 bps, got ${quorumBps}`)
assert(Number(votingDelay) === 86400, `voting delay expected 86400, got ${votingDelay}`)
assert(Number(votingPeriod) === 345600, `voting period expected 345600, got ${votingPeriod}`)
assert(
  String(vetoer).toLowerCase() === "0x1fde40a4046eda0ca0539dd6c77abf8933b94260",
  `vetoer mismatch: ${vetoer}`
)

const supply = await client.readContract({ address: NFT, abi: tokenAbi, functionName: "totalSupply" })
assert(Number(supply) > 0, "NFT totalSupply should be > 0")

const treasuryBal = await client.getBalance({ address: TREASURY })
assert(Number(formatEther(treasuryBal)) >= 0, "treasury balance read failed")

const auction = await client.readContract({ address: AUCTION, abi: auctionAbi, functionName: "auction" })
assert(Number(auction[0]) >= 0, "auction tokenId read failed")

const reserve = await client.readContract({ address: AUCTION, abi: auctionAbi, functionName: "reservePrice" })
assert(Number(formatEther(reserve)) === 0.004, `reserve expected 0.004 ETH, got ${formatEther(reserve)}`)

const meta = await daoOGMetadataRequest(CHAIN_ID.OPTIMISM, NFT)
assert(meta?.governorAddress, "subgraph metadata missing governor")

const { proposals } = await getProposals(CHAIN_ID.OPTIMISM, NFT, 5, 0)
assert(Array.isArray(proposals), "subgraph proposals should be an array")

console.log("PASS: Announced Bill Optimism contracts + subgraph reads")
console.log(
  JSON.stringify(
    {
      supply: Number(supply),
      treasuryEth: formatEther(treasuryBal),
      auctionTokenId: Number(auction[0]),
      proposalCount: proposals.length,
      subgraphName: meta?.name,
    },
    null,
    2
  )
)
