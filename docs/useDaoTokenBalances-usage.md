# How to Use `useDaoTokenBalances`

The `useDaoTokenBalances` hook fetches token balances for a DAO's treasury (Safe address) using the Sequence Indexer Gateway API.

## Prerequisites

1. **Environment Variable**: Ensure you have `NEXT_PUBLIC_SEQUENCE_KEY` set in your `.env` file:
   ```env
   NEXT_PUBLIC_SEQUENCE_KEY=your_sequence_api_key_here
   ```

2. **Provider Setup**: Your application must be wrapped with `DaoHooksProvider` (already configured in `components/providers.tsx`).

## Basic Usage

```tsx
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";

export const TreasuryBalances = () => {
  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS;
  
  const { tokens, isLoading, error } = useDaoTokenBalances({
    chainid: "8453", // Base Mainnet
    safeAddress: daoAddress,
  });

  if (isLoading) {
    return <div>Loading treasury balances...</div>;
  }

  if (error) {
    return <div>Error loading balances: {error.message}</div>;
  }

  if (!tokens || tokens.length === 0) {
    return <div>No tokens found in treasury</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Treasury Balances</h2>
      <div className="grid gap-4">
        {tokens.map((token) => (
          <TokenBalanceCard key={token.tokenAddress || 'native'} token={token} />
        ))}
      </div>
    </div>
  );
};

const TokenBalanceCard = ({ token }: { token: TokenBalance }) => {
  const balance = formatBalance(token.balance, token.token.decimals);
  
  return (
    <div className="border rounded-lg p-4 flex items-center gap-4">
      {token.token.logoUri && (
        <img 
          src={token.token.logoUri} 
          alt={token.token.symbol}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div>
        <div className="font-semibold">{token.token.name}</div>
        <div className="text-sm text-muted-foreground">
          {balance} {token.token.symbol}
        </div>
      </div>
    </div>
  );
};

// Helper function to format balance
function formatBalance(balance: string, decimals: number): string {
  const num = BigInt(balance) / BigInt(10 ** decimals);
  return num.toLocaleString();
}
```

## Advanced Usage: Multiple Chains

If you want to fetch balances across multiple chains, you can call the hook multiple times:

```tsx
const SUPPORTED_CHAINS = [
  { id: "1", name: "Ethereum" },
  { id: "8453", name: "Base" },
  { id: "42161", name: "Arbitrum" },
];

export const MultiChainBalances = () => {
  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS;

  return (
    <div className="space-y-8">
      {SUPPORTED_CHAINS.map((chain) => (
        <ChainBalances 
          key={chain.id}
          chainId={chain.id}
          chainName={chain.name}
          safeAddress={daoAddress}
        />
      ))}
    </div>
  );
};

const ChainBalances = ({ 
  chainId, 
  chainName, 
  safeAddress 
}: {
  chainId: string;
  chainName: string;
  safeAddress?: string;
}) => {
  const { tokens, isLoading } = useDaoTokenBalances({
    chainid: chainId,
    safeAddress,
  });

  if (isLoading) return <div>Loading {chainName}...</div>;
  if (!tokens?.length) return null;

  return (
    <div>
      <h3>{chainName}</h3>
      {/* Render tokens */}
    </div>
  );
};
```

## Return Values

The hook returns an object with:

- `tokens`: Array of `TokenBalance` objects or `undefined`
- `isLoading`: Boolean indicating if data is being fetched
- `error`: Error object if the request failed
- `isError`: Boolean indicating if there was an error
- `refetch`: Function to manually refetch the data
- `isFetching`: Boolean indicating if a background refetch is happening

## Token Balance Type

```typescript
interface TokenBalance {
  tokenAddress: string | null; // null for native token
  balance: string; // Raw balance as string (in wei for ETH)
  token: {
    decimals: number;
    symbol: string;
    name: string;
    logoUri: string | null;
  };
}
```

## Example: Integration with Governance Page

You could use this hook on your governance page to show the DAO's treasury:

```tsx
// In app/governance/page.tsx or a component
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";

export default function GovernancePage() {
  const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS;
  
  const { tokens } = useDaoTokenBalances({
    chainid: "8453",
    safeAddress: daoAddress,
  });

  return (
    <div>
      {/* Other governance content */}
      
      <section className="mt-8">
        <h2>DAO Treasury</h2>
        {tokens && (
          <div>Total Assets: {tokens.length}</div>
        )}
      </section>
    </div>
  );
}
```

## Notes

- The hook uses React Query for caching and automatic refetching
- Data is cached based on `chainid` and `safeAddress`
- The hook will only fetch when both `chainid` and `safeAddress` are provided
- Fetching is automatically retried on failure (React Query default behavior)
