"use client";

import { useDaoHooks, useDaos } from "@/hooks";

export function HooksTest() {
  const { config } = useDaoHooks();
  
  // Test the useDaos hook
  const { daos, isLoading, error } = useDaos({
    chainid: "1", // Ethereum mainnet
    queryOptions: {
      first: 5,
      orderBy: "createdAt",
      orderDirection: "desc"
    }
  });


  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">DAO Hooks Test</h3>
      
      <div className="mb-4">
        <h4 className="font-medium">Configuration:</h4>
        <p>Graph Key: {config.graphKey ? "✅ Set" : "❌ Missing"}</p>
        <p>Sequence Key: {config.sequenceKey ? "✅ Set" : "❌ Missing"}</p>
      </div>

      <div>
        <h4 className="font-medium">useDaos Hook Test:</h4>
        {isLoading && <p>Loading DAOs...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {daos && (
          <div>
            <p>Found {daos.length} DAOs</p>
            <ul className="list-disc list-inside mt-2">
              {daos.slice(0, 3).map((dao) => (
                <li key={dao.id} className="text-sm">
                  {dao.name} ({dao.id.slice(0, 8)}...)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
