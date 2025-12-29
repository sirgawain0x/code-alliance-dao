export const CRTV_TOKEN_ADDRESSES = {
  8453: "0x4B62D9b3DE9FAB98659693c9ee488D2E4eE56c44", // Base
  137: "0xeb531c4470e8588520a7deb8b5ea2289f9a9ad0f", // Polygon
  10: "0x06b9f097407084b9c7d82ea82e8fc693d3394eb6", // Optimism
} as const;

export const CRTV_POOL_ADDRESSES = {
  8453: "0xe9dad7c1d857f09547703be89be102ca232d9837", // Base
  137: "0x07d31ab079bf606baddb806cced99d23284e62f2", // Polygon
  10: "0x7A16780ABCa3CB7C1968c7C726C31A4916F4F828", // Optimism
} as const;

export const SUPPORTED_CHAINS = [8453, 137, 10] as const;

export const TOKEN_DECIMALS = 18;
export const TOKEN_SYMBOL = "CRTV";
