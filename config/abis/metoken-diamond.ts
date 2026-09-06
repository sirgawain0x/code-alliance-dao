/** FoundryFacet on the meTokens Diamond — mint/burn and quote views. */
export const METOKEN_DIAMOND_ABI = [
  "function mint(address meToken, uint256 assetsDeposited, address recipient) returns (uint256 meTokensMinted)",
  "function burn(address meToken, uint256 meTokensBurned, address recipient) returns (uint256 assetsReturned)",
  "function calculateMeTokensMinted(address meToken, uint256 assetsDeposited) view returns (uint256 meTokensMinted)",
  "function calculateAssetsReturned(address meToken, uint256 meTokensBurned, address sender) view returns (uint256 assetsReturned)",
] as const
