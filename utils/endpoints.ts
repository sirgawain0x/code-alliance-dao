// Graph URL builder for DAO Haus subgraphs
export const getGraphUrl = ({
  chainid,
  graphKey,
  subgraphKey,
}: {
  chainid: string;
  graphKey: string;
  subgraphKey: string;
}): string => {
  if (!chainid || !graphKey || !subgraphKey) {
    throw new Error("Missing required parameters for Graph URL");
  }

  // Base URL for DAO Haus subgraphs
  const baseUrl = "https://gateway-arbitrum.network.thegraph.com/api";
  
  return `${baseUrl}/${graphKey}/subgraphs/id/${subgraphKey}`;
};

// Token indexer URL builder for Sequence
export const getTokenIndexerUrl = ({
  chainid,
}: {
  chainid: string;
}): string => {
  if (!chainid) {
    throw new Error("Missing chainid for token indexer URL");
  }

  // Sequence indexer URLs by chain
  const indexerUrls: Record<string, string> = {
    "1": "https://ethereum-indexer.sequence.app",
    "137": "https://polygon-indexer.sequence.app",
    "42161": "https://arbitrum-indexer.sequence.app",
    "10": "https://optimism-indexer.sequence.app",
    "8453": "https://base-indexer.sequence.app",
    "56": "https://bsc-indexer.sequence.app",
    "43114": "https://avalanche-indexer.sequence.app",
    "250": "https://fantom-indexer.sequence.app",
    "25": "https://cronos-indexer.sequence.app",
    "100": "https://gnosis-indexer.sequence.app",
    "1284": "https://moonbeam-indexer.sequence.app",
    "1285": "https://moonriver-indexer.sequence.app",
    "592": "https://astar-indexer.sequence.app",
    "1088": "https://metis-indexer.sequence.app",
    "288": "https://boba-indexer.sequence.app",
    "1666600000": "https://harmony-indexer.sequence.app",
    "128": "https://heco-indexer.sequence.app",
    "66": "https://okc-indexer.sequence.app",
    "8217": "https://klaytn-indexer.sequence.app",
    "106": "https://velas-indexer.sequence.app",
    "40": "https://telos-indexer.sequence.app",
    "1287": "https://moonbase-indexer.sequence.app",
    "80001": "https://mumbai-indexer.sequence.app",
    "5": "https://goerli-indexer.sequence.app",
    "11155111": "https://sepolia-indexer.sequence.app",
    "97": "https://bsc-testnet-indexer.sequence.app",
    "43113": "https://fuji-indexer.sequence.app",
    "4002": "https://fantom-testnet-indexer.sequence.app",
    "338": "https://cronos-testnet-indexer.sequence.app",
    "10200": "https://gnosis-testnet-indexer.sequence.app",
    "1287": "https://moonbase-indexer.sequence.app",
    "592": "https://astar-testnet-indexer.sequence.app",
    "599": "https://metis-testnet-indexer.sequence.app",
    "28882": "https://boba-testnet-indexer.sequence.app",
    "1666700000": "https://harmony-testnet-indexer.sequence.app",
    "256": "https://heco-testnet-indexer.sequence.app",
    "65": "https://okc-testnet-indexer.sequence.app",
    "8217": "https://klaytn-testnet-indexer.sequence.app",
    "106": "https://velas-testnet-indexer.sequence.app",
    "40": "https://telos-testnet-indexer.sequence.app",
  };

  const indexerUrl = indexerUrls[chainid];
  
  if (!indexerUrl) {
    throw new Error(`Unsupported chain ID: ${chainid}`);
  }

  return indexerUrl;
};

// RPC URL builder for different chains
export const getRpcUrl = ({
  chainid,
  rpcKey,
}: {
  chainid: string;
  rpcKey?: string;
}): string => {
  if (!chainid) {
    throw new Error("Missing chainid for RPC URL");
  }

  // Common RPC URLs by chain
  const rpcUrls: Record<string, string> = {
    "1": `https://eth-mainnet.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "137": `https://polygon-mainnet.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "42161": `https://arb-mainnet.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "10": `https://opt-mainnet.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "8453": `https://base-mainnet.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "56": "https://bsc-dataseed.binance.org/",
    "43114": "https://api.avax.network/ext/bc/C/rpc",
    "250": "https://rpc.ftm.tools/",
    "25": "https://evm-cronos.crypto.org",
    "100": "https://rpc.gnosischain.com",
    "1284": "https://rpc.api.moonbeam.network",
    "1285": "https://rpc.api.moonriver.moonbeam.network",
    "592": "https://evm.astar.network",
    "1088": "https://andromeda.metis.io/?owner=1088",
    "288": "https://mainnet.boba.network",
    "1666600000": "https://api.harmony.one",
    "128": "https://http-mainnet.hecochain.com",
    "66": "https://exchainrpc.okex.org",
    "8217": "https://public-node-api.klaytnapi.com/v1/cypress",
    "106": "https://evmexplorer.velas.com/rpc",
    "40": "https://mainnet.telos.net/evm",
    "1287": "https://rpc.api.moonbase.moonbeam.network",
    "80001": `https://polygon-mumbai.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "5": `https://eth-goerli.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "11155111": `https://eth-sepolia.g.alchemy.com/v2/${rpcKey || "demo"}`,
    "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
    "43113": "https://api.avax-test.network/ext/bc/C/rpc",
    "4002": "https://rpc.testnet.fantom.network/",
    "338": "https://cronos-testnet-3.crypto.org:8545",
    "10200": "https://rpc.chiadochain.net",
    "28882": "https://testnet.boba.network",
    "1666700000": "https://api.s0.b.hmny.io",
    "256": "https://http-testnet.hecochain.com",
    "65": "https://exchaintestrpc.okex.org",
    "8217": "https://api.baobab.klaytn.net:8651",
    "106": "https://evmexplorer.testnet.velas.com/rpc",
    "40": "https://testnet.telos.net/evm",
  };

  const rpcUrl = rpcUrls[chainid];
  
  if (!rpcUrl) {
    throw new Error(`Unsupported chain ID: ${chainid}`);
  }

  return rpcUrl;
};

// Block explorer URL builder
export const getBlockExplorerUrl = ({
  chainid,
  address,
  txHash,
}: {
  chainid: string;
  address?: string;
  txHash?: string;
}): string => {
  if (!chainid) {
    throw new Error("Missing chainid for block explorer URL");
  }

  const explorerUrls: Record<string, string> = {
    "1": "https://etherscan.io",
    "137": "https://polygonscan.com",
    "42161": "https://arbiscan.io",
    "10": "https://optimistic.etherscan.io",
    "8453": "https://basescan.org",
    "56": "https://bscscan.com",
    "43114": "https://snowtrace.io",
    "250": "https://ftmscan.com",
    "25": "https://cronoscan.com",
    "100": "https://gnosisscan.io",
    "1284": "https://moonscan.io",
    "1285": "https://moonriver.moonscan.io",
    "592": "https://astar.subscan.io",
    "1088": "https://andromeda-explorer.metis.io",
    "288": "https://bobascan.com",
    "1666600000": "https://explorer.harmony.one",
    "128": "https://hecoinfo.com",
    "66": "https://www.oklink.com/en/okc",
    "8217": "https://scope.klaytn.com",
    "106": "https://evmexplorer.velas.com",
    "40": "https://teloscan.io",
    "1287": "https://moonbase.moonscan.io",
    "80001": "https://mumbai.polygonscan.com",
    "5": "https://goerli.etherscan.io",
    "11155111": "https://sepolia.etherscan.io",
    "97": "https://testnet.bscscan.com",
    "43113": "https://testnet.snowtrace.io",
    "4002": "https://testnet.ftmscan.com",
    "338": "https://testnet.cronoscan.com",
    "10200": "https://gnosis-chiado.blockscout.com",
    "28882": "https://testnet.bobascan.com",
    "1666700000": "https://explorer.pops.one",
    "256": "https://testnet.hecoinfo.com",
    "65": "https://www.oklink.com/en/okc-test",
    "8217": "https://baobab.scope.klaytn.com",
    "106": "https://evmexplorer.testnet.velas.com",
    "40": "https://testnet.teloscan.io",
  };

  const baseUrl = explorerUrls[chainid];
  
  if (!baseUrl) {
    throw new Error(`Unsupported chain ID: ${chainid}`);
  }

  if (txHash) {
    return `${baseUrl}/tx/${txHash}`;
  }
  
  if (address) {
    return `${baseUrl}/address/${address}`;
  }
  
  return baseUrl;
};