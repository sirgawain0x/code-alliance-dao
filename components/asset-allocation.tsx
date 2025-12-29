"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Coins } from "lucide-react"
import { useDaoTokenBalances } from "@/hooks/useDaoTokenBalances"
import { formatUnits } from "viem"

// Helper to determine token type based on symbol
function getTokenType(symbol: string): string {
  const stablecoins = ["USDC", "USDT", "DAI", "FRAX", "BUSD", "TUSD"];
  const wrappedTokens = ["WETH", "WBTC"];

  if (stablecoins.includes(symbol.toUpperCase())) {
    return "Stablecoin";
  }
  if (wrappedTokens.includes(symbol.toUpperCase())) {
    return "Wrapped";
  }
  if (symbol.toUpperCase() === "ETH") {
    return "Native";
  }
  return "Token";
}

// Helper to determine risk level based on token type
function getTokenRisk(type: string): string {
  switch (type) {
    case "Stablecoin":
      return "low";
    case "Native":
    case "Wrapped":
      return "medium";
    default:
      return "medium";
  }
}

export function AssetAllocation() {
  const daoAddress = process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS;

  const { tokens, isLoading, error } = useDaoTokenBalances({
    chainid: "8453", // Base Mainnet
    safeAddress: daoAddress,
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case "Stablecoin":
        return "text-blue-400"
      case "Native":
      case "Wrapped":
        return "text-purple-400"
      case "Token":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  // Calculate total value and percentages
  const totalValue = tokens?.reduce((sum, token) => {
    if (!token.token?.decimals) return sum;
    const value = Number(formatUnits(BigInt(token.balance), token.token.decimals));
    return sum + value;
  }, 0) || 0;

  const assets = tokens?.filter(token => token.token != null).map((token) => {
    const decimals = token.token!.decimals ?? 18;
    const balance = Number(formatUnits(BigInt(token.balance), decimals));
    const percentage = totalValue > 0 ? (balance / totalValue) * 100 : 0;
    const type = getTokenType(token.token!.symbol ?? "UNKNOWN");
    const risk = getTokenRisk(type);

    return {
      name: token.token!.symbol ?? "UNKNOWN",
      fullName: token.token!.name ?? "Unknown Token",
      type,
      amount: balance,
      percentage,
      risk,
      logoUri: token.token!.logoUri ?? null,
      tokenAddress: token.tokenAddress,
    };
  }) || [];

  // Sort by percentage (highest first)
  assets.sort((a, b) => b.percentage - a.percentage);

  if (isLoading) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
            <Button variant="outline" size="sm" disabled>
              Rebalance
            </Button>
          </div>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-red-400">Error loading assets: {error.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
          </div>
          <div className="text-center py-8">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No assets found in treasury</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
          <Button variant="outline" size="sm">
            Rebalance
          </Button>
        </div>

        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.tokenAddress || asset.name} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {asset.logoUri && (
                    <img
                      src={asset.logoUri}
                      alt={asset.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-foreground">{asset.name}</h4>
                    <p className={`text-xs ${getAssetTypeColor(asset.type)}`}>{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {asset.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">{asset.percentage.toFixed(1)}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <Badge className={getRiskColor(asset.risk)} variant="outline">
                    {asset.risk} risk
                  </Badge>
                  <span className="text-muted-foreground" title={asset.fullName ?? undefined}>
                    {(asset.fullName ?? "Unknown").length > 20
                      ? `${(asset.fullName ?? "Unknown").substring(0, 20)}...`
                      : (asset.fullName ?? "Unknown")}
                  </span>
                </div>
              </div>

              <Progress value={asset.percentage} className="h-1" />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Assets</span>
            <span className="font-medium text-foreground">{assets.length} tokens</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
