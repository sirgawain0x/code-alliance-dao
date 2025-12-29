"use client"

import { useState } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CreditCard, ArrowRight, Wallet, ExternalLink } from "lucide-react"
import { CRTV_TOKEN_ADDRESSES, CRTV_POOL_ADDRESSES, SUPPORTED_CHAINS, TOKEN_SYMBOL } from "@/config/constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BuyCRTV() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const { open } = useAppKit()

    const isSupportedChain = SUPPORTED_CHAINS.includes(chainId as any)
    const tokenAddress = isSupportedChain ? CRTV_TOKEN_ADDRESSES[chainId as keyof typeof CRTV_TOKEN_ADDRESSES] : null;
    const poolAddress = isSupportedChain ? CRTV_POOL_ADDRESSES[chainId as keyof typeof CRTV_POOL_ADDRESSES] : null;

    const handleOnRamp = () => {
        open({ view: 'OnRampProviders' })
    }

    const handleSwap = () => {
        // Try to open with the token address. If 1inch/AppKit supports address, this is best.
        // Otherwise, we might need to fallback to the symbol or a direct DEX link.
        open({
            view: 'Swap',
            arguments: {
                toToken: tokenAddress || TOKEN_SYMBOL
            }
        })
    }

    const getDexLink = () => {
        switch (chainId) {
            case 8453: // Base
                return `https://aerodrome.finance/swap?to=${tokenAddress}`
            case 137: // Polygon
                return `https://app.uniswap.org/swap?chain=polygon&outputCurrency=${tokenAddress}`
            case 10: // Optimism
                return `https://app.uniswap.org/swap?chain=optimism&outputCurrency=${tokenAddress}`
            default:
                return "#"
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Buy {TOKEN_SYMBOL}</CardTitle>
                <CardDescription>Get {TOKEN_SYMBOL} in two simple steps.</CardDescription>
            </CardHeader>
            <CardContent>
                {!isConnected ? (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet not connected</AlertTitle>
                        <AlertDescription>
                            Please connect your wallet to purchase tokens.
                        </AlertDescription>
                    </Alert>
                ) : !isSupportedChain ? (
                    <div className="space-y-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Unsupported Network</AlertTitle>
                            <AlertDescription>
                                Please switch to Base, Polygon, or Optimism to buy {TOKEN_SYMBOL}.
                            </AlertDescription>
                        </Alert>
                        <div className="grid grid-cols-1 gap-2">
                            <Button onClick={() => switchChain({ chainId: 8453 })}>Switch to Base</Button>
                            <Button onClick={() => switchChain({ chainId: 137 })}>Switch to Polygon</Button>
                            <Button onClick={() => switchChain({ chainId: 10 })}>Switch to Optimism</Button>
                        </div>
                    </div>
                ) : (
                    <Tabs defaultValue="onramp" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="onramp">1. Get Funds</TabsTrigger>
                            <TabsTrigger value="swap">2. Swap for {TOKEN_SYMBOL}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="onramp" className="space-y-4 pt-4">
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-background rounded-full border">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Need crypto?</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Buy ETH or USDC directly with your credit card or bank account using our secure on-ramp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full" size="lg" onClick={handleOnRamp}>
                                Buy Crypto via Card (On-Ramp)
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </TabsContent>

                        <TabsContent value="swap" className="space-y-4 pt-4">
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-background rounded-full border">
                                        <Wallet className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Swap for {TOKEN_SYMBOL}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Swap your ETH or USDC for {TOKEN_SYMBOL} directly within the wallet.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Token Info */}
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Contract Address:</span>
                                    <div className="text-xs break-all font-mono mt-1 bg-muted p-2 rounded">{tokenAddress}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Liquidity Pool:</span>
                                    <div className="text-xs break-all font-mono mt-1 bg-muted p-2 rounded">{poolAddress}</div>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleSwap}
                            >
                                Open Swap
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <div className="text-center">
                                <span className="text-xs text-muted-foreground">Or buy directly on DEX:</span>
                                <Button variant="link" size="sm" asChild className="h-auto p-0 ml-1">
                                    <a href={getDexLink()} target="_blank" rel="noopener noreferrer">
                                        Launch DEX <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>
        </Card>
    )
}
