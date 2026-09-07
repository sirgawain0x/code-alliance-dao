import {
  CRTVAI_METOKEN_ADDRESS,
} from "@/config/metoken"

/** @deprecated CCIP CRTV — bridge only; /buy uses CRTVAI MeToken on Base. */
export const CRTV_TOKEN_ADDRESSES = {
  8453: "0x4B62D9b3DE9FAB98659693c9ee488D2E4eE56c44", // Base CCIP CRTV
  10: "0x06b9f097407084b9c7d82ea82e8fc693d3394eb6", // Optimism CCIP CRTV
} as const;

/** Buyable DAO token on Base (CRTVAI MeToken). */
export const BUY_TOKEN_ADDRESS = CRTVAI_METOKEN_ADDRESS

export const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const BASE_WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
export const BASE_CHAIN_ID = 8453;

/** Creative Org Moloch v3 (Baal) on Base */
export const CREATIVE_ORG_BAAL_ADDRESS =
  "0x96e952b4bf7cde3632b1f3573e35d2afb11c3685"
export const CREATIVE_ORG_SHARES_ADDRESS =
  "0x835c08eE801A7a0eB1CF6a42E53C7177A88daB52" // vCRTV
export const CREATIVE_ORG_LOOT_ADDRESS =
  "0xEA5324A999bdbD19feAD46E8B8d2A2C5e079Af82" // nvCRTV
export const CREATIVE_ORG_SAFE_ADDRESS =
  "0x682C116d0c9256A342296bB8c26fC87a8Fd90855"

export const CRTV_POOL_ADDRESSES = {
  8453: "0xe9dad7c1d857f09547703be89be102ca232d9837", // Base
  10: "0x7A16780ABCa3CB7C1968c7C726C31A4916F4F828", // Optimism
} as const;

export const SUPPORTED_CHAINS = [8453, 10] as const;

export const CHAIN_SELECTORS = {
  8453: "15971525489660198786", // Base
  10: "2664363617261496610", // Optimism
} as const;

export const CCIP_ROUTER_ADDRESSES = {
  8453: "0x881e3A65B4d4a04dD529061dd0071cf975F58bCD", // Base
  10: "0x261c05167db67B2b619f9d312e0753f3721c4906", // Optimism
} as const;

export const TOKEN_DECIMALS = 18;
/** Symbol for the buyable Base token (CRTVAI MeToken). */
export const TOKEN_SYMBOL = "CRTVAI";

/** CRTVAI MeToken mint on /buy is live (G2 unlock). Always enabled in code. */
export const CRTV_PURCHASES_ENABLED = true;

/** Served from `public/Creative_logo-200.svg` */
export const CREATIVE_ORG_LOGO_SRC = "/Creative_logo-200.svg" as const;
