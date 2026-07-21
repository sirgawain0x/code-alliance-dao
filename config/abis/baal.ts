/** Minimal Baal (Moloch v3) ABI for Creative Org governance reads/writes. */
export const BAAL_ABI = [
  "function submitProposal(bytes proposalData, uint32 expiration, uint256 baalGas, string details) payable returns (uint256)",
  "function sponsorProposal(uint32 id)",
  "function submitVote(uint32 id, bool approved)",
  "function processProposal(uint32 id, bytes proposalData)",
  "function ragequit(address to, uint256 sharesToBurn, uint256 lootToBurn, address[] tokens)",
  "function mintShares(address[] to, uint256[] amount)",
  "function mintLoot(address[] to, uint256[] amount)",
  "function proposalCount() view returns (uint32)",
  "function totalShares() view returns (uint256)",
  "function totalLoot() view returns (uint256)",
  "function sharesToken() view returns (address)",
  "function lootToken() view returns (address)",
  "function avatar() view returns (address)",
  "function proposalOffering() view returns (uint256)",
  "function state(uint32 id) view returns (uint8)",
  "function getProposalStatus(uint32 id) view returns (bool[4])",
] as const

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
] as const

export const MULTISEND_ABI = [
  "function multiSend(bytes transactions)",
] as const
