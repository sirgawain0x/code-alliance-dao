"use client";

import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances";

export function TokenBalancesTest() {
  const { tokens, isLoading, error } = useDaoTokenBalances({
    chainid: "1",
    safeAddress: "0x1234567890123456789012345678901234567890"
  });

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Token Balances Test</h3>
      
      {isLoading && <p>Loading token balances...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {tokens && (
        <div>
          <p>Found {tokens.length} token balances</p>
          <ul className="list-disc list-inside mt-2">
            {tokens.map((token, index) => (
              <li key={index} className="text-sm">
                {token.token?.symbol || "Unknown"}: {token.balance} 
                {token.tokenAddress && ` (${token.tokenAddress.slice(0, 8)}...)`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
