export const CRTV_TOKEN_ADDRESSES = {
  8453: "0x4B62D9b3DE9FAB98659693c9ee488D2E4eE56c44", // Base
  10: "0x06b9f097407084b9c7d82ea82e8fc693d3394eb6", // Optimism
} as const;

export const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const BASE_WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
export const BASE_CHAIN_ID = 8453;

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
export const TOKEN_SYMBOL = "CRTV";

/**
 * Flip on (or set NEXT_PUBLIC_CRTV_PURCHASES_ENABLED=true) after a Base
 * CRTV/USDC DEX pool is funded and 0x can quote swaps.
 */
export const CRTV_PURCHASES_ENABLED =
  process.env.NEXT_PUBLIC_CRTV_PURCHASES_ENABLED === "true";

/** Served from `public/Creative_logo-200.svg` */
export const CREATIVE_ORG_LOGO_SRC = "/Creative_logo-200.svg" as const;
