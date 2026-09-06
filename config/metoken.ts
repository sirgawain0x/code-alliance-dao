/**
 * CRTVAI MeToken — USDC-backed meToken on Base (Hub 2 / Bancor Zero).
 *
 * Users mint/burn through the meTokens Diamond FoundryFacet, not the meToken ERC-20
 * directly. Approve USDC to the hub vault before calling `mint` on the Diamond.
 *
 * Reference: g2-1/edit-pixels `config/metoken.ts` (PR #40).
 */

/** CRTVAI meToken (ERC-20) on Base. */
export const CRTVAI_METOKEN_ADDRESS =
  "0xecb695544a3d2a64d579b3828f3f60f6932f4846" as const

/** meTokens Diamond (ERC-2535 proxy) on Base — FoundryFacet entry point. */
export const CRTVAI_DIAMOND_ADDRESS =
  "0xba5502db2aC2cBff189965e991C07109B14eB3f5" as const

/** Hub-2 vault — USDC approval target for minting. */
export const CRTVAI_HUB_2_VAULT_ADDRESS =
  "0xd4b3f4d2c44Feba751F30e19D7e1047A29eE085d" as const

/** Optional wrapped Super Token (CRTVAIx) — not used for /buy mint path. */
export const CRTVAIX_SUPER_TOKEN_ADDRESS =
  "0x5cc162BBf2F9d897e66fBbA5C50507E8C2621187" as const

/** MeToken factory on Base (reference). */
export const METOKEN_FACTORY_ADDRESS =
  "0xb31Ae2583d983faa7D8C8304e6A16E414e721A0B" as const

export const CRTVAI_HUB_ID = 2
export const CRTVAI_DECIMALS = 18
export const USDC_DECIMALS = 6
