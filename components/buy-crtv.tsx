"use client"

import { useAppKit } from "@reown/appkit/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CreditCard, ArrowRight, Wallet, ExternalLink } from "lucide-react"
import { BASE_USDC_ADDRESS, BASE_WETH_ADDRESS, CRTV_TOKEN_ADDRESSES, TOKEN_SYMBOL } from "@/config/constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BuyCRTV() {
    const { open } = useAppKit()
    const tokenAddress = CRTV_TOKEN_ADDRESSES[8453]
    const aerodromeSrc = `https://aerodrome.finance/swap?from=${BASE_USDC_ADDRESS}&to=${tokenAddress}`
    const aerodromeEthSrc = `https://aerodrome.finance/swap?from=${BASE_WETH_ADDRESS}&to=${tokenAddress}`

    function handleOnRamp() {
        open({ view: 'OnRampProviders' })
    }

    function handleSwap() {
        open({
            view: 'Swap',
            arguments: {
                fromToken: 'USDC',
                toToken: TOKEN_SYMBOL,
            },
        })
    }

    return (
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Buy {TOKEN_SYMBOL}</CardTitle>
                <CardDescription>
                    Swap USDC or ETH for {TOKEN_SYMBOL} on Base through Aerodrome liquidity.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="overflow-hidden rounded-xl border bg-background">
                    <iframe
                        src={aerodromeSrc}
                        title={`Aerodrome swap USDC to ${TOKEN_SYMBOL}`}
                        className="h-[720px] w-full bg-background"
                        allow="clipboard-write; web-share"
                    />
                </div>

                <div className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>CRTV pre-selected</AlertTitle>
                        <AlertDescription>
                            The embedded swap is set to buy {TOKEN_SYMBOL} on Base. Connect a wallet in Aerodrome to complete the trade.
                        </AlertDescription>
                    </Alert>

                    <div className="rounded-lg border p-4 bg-muted/50">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-background rounded-full border">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium">Base {TOKEN_SYMBOL}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Contract address:
                                </p>
                                <div className="text-xs break-all font-mono mt-2 bg-background p-2 rounded">
                                    {tokenAddress}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleOnRamp}>
                        Buy USDC or ETH with card
                        <CreditCard className="ml-2 h-4 w-4" />
                    </Button>

                    <Button className="w-full" size="lg" variant="outline" onClick={handleSwap}>
                        Open AppKit USDC swap
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button className="w-full" variant="outline" asChild>
                        <a href={aerodromeEthSrc} target="_blank" rel="noopener noreferrer">
                            Swap ETH on Aerodrome <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
