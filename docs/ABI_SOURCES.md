# ABI sources — Announced Bill / Creative Kidz Nouns Builder

This UI uses **Nouns Builder** contract ABIs (not Baal/Moloch and not mainnet Nouns.wtf ABIs).

## Primary source

| Package | Version | Usage |
|---------|---------|--------|
| [`@buildeross/sdk`](https://www.npmjs.com/package/@buildeross/sdk) | `0.3.2` | `governorAbi`, `auctionAbi`, `tokenAbi` from `@buildeross/sdk/contract` |
| [`@buildeross/types`](https://www.npmjs.com/package/@buildeross/types) | `0.3.2` | `CHAIN_ID`, `ProposalState` enums |
| [`@buildeross/sdk/subgraph`](https://www.npmjs.com/package/@buildeross/sdk) | `0.3.2` | `getProposals`, `getProposal`, `daoMembershipRequest`, `daoOGMetadataRequest` |

Upstream repository: [BuilderOSS/nouns-builder](https://github.com/BuilderOSS/nouns-builder)

## On-chain references (Optimism, chain id 10)

| Role | Address |
|------|---------|
| NFT (Creative Kidz) | `0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02` |
| Auction | `0x122455e85e1484b299966795c748d0c5e4d1b7f1` |
| Governor | `0xaa42c1e7e767cefcd41536aa73e03bdf16cf1c34` |
| Treasury | `0x85a56a9572145260d40e8d8f55c8468c18773da0` |
| Metadata | `0x0498d07048e879069c0ab9acc8c4ac7f17c33a22` |

Override via `NEXT_PUBLIC_ANNOUNCED_BILL_*` env vars (see `lib/announced-bill-config.ts`).

## Governance functions used

From `governorAbi` (Nouns Builder Governor proxy):

- `propose(address[],uint256[],bytes[],string)`
- `castVote(bytes32,uint256)` / `castVoteWithReason(bytes32,uint256,string)`
- `queue(bytes32)`
- `execute(address[],uint256[],bytes[],bytes32,address)`
- `getVotes(address,uint256)`, `proposalThresholdBps`, `settings`

From `auctionAbi`:

- `auction()`, `settings()` (reserve price)

From `tokenAbi`:

- `totalSupply()`

## Baal (Creative Org on Base)

Creative Org governance continues to use `config/abis/baal.ts` (Moloch v3) via DAOhaus subgraph — unchanged by this integration.
