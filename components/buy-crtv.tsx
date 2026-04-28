"use client"

import { useState } from "react"
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers"
import { base } from "@reown/appkit/networks"
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, Loader2, Wallet } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BASE_USDC_ADDRESS, CRTV_TOKEN_ADDRESSES, TOKEN_SYMBOL } from "@/config/constants"

const ERC20_APPROVAL_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
]

export function BuyCRTV() {
    const { open } = useAppKit()
    const { address, isConnected } = useAppKitAccount()
    const { chainId, switchNetwork } = useAppKitNetwork()
    const [amount, setAmount] = useState("25")
    const [slippage, setSlippage] = useState("1")
    const [quote, setQuote] = useState<CrtvSwapQuote | null>(null)
    const [isQuoting, setIsQuoting] = useState(false)
    const [isSwapping, setIsSwapping] = useState(false)
    const [message, setMessage] = useState<SwapMessage | null>(null)

    const tokenAddress = CRTV_TOKEN_ADDRESSES[8453]
    const isBase = Number(chainId) === 8453
    const canQuote = Boolean(isConnected && address && isBase && amount && Number(amount) > 0)

    async function handleQuote() {
        if (!canQuote || !address) return

        setIsQuoting(true)
        setMessage(null)
        setQuote(null)

        try {
            const sellAmount = parseUnits(amount, 6).toString()
            const response = await fetch("/api/crtv-swap/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taker: address,
                    sellAmount,
                    slippageBps: Math.round(Number(slippage) * 100),
                }),
            })
            const result = await response.json()

            if (!response.ok) throw new Error(result.error || "Unable to quote CRTV swap")
            if (!isCrtvSwapQuote(result)) throw new Error("Swap quote was incomplete")

            setQuote(result)
            setMessage({ type: "success", text: "Quote ready. Review the expected CRTV before swapping." })
        } catch (error) {
            setMessage({ type: "error", text: getErrorMessage(error) })
        } finally {
            setIsQuoting(false)
        }
    }

    async function handleSwap() {
        if (!quote || !address) return

        setIsSwapping(true)
        setMessage(null)

        try {
            if (!window.ethereum) throw new Error("No browser wallet provider found")

            const provider = new BrowserProvider(window.ethereum as unknown as Eip1193Provider)
            const signer = await provider.getSigner()
            const allowanceTarget = quote.allowanceTarget

            if (allowanceTarget) {
                const usdc = new Contract(BASE_USDC_ADDRESS, ERC20_APPROVAL_ABI, signer)
                const allowance = await usdc.allowance(address, allowanceTarget)

                if (allowance < BigInt(quote.sellAmount)) {
                    setMessage({ type: "info", text: "Approve USDC for the swap router in your wallet." })
                    const approvalTx = await usdc.approve(allowanceTarget, quote.sellAmount)
                    await approvalTx.wait()
                }
            }

            setMessage({ type: "info", text: "Confirm the CRTV swap in your connected wallet." })
            const tx = await signer.sendTransaction({
                to: quote.transaction.to,
                data: quote.transaction.data,
                value: quote.transaction.value,
                gasLimit: quote.transaction.gas ? BigInt(quote.transaction.gas) : undefined,
            })
            setMessage({ type: "success", text: `Swap submitted: ${tx.hash}` })
        } catch (error) {
            setMessage({ type: "error", text: getErrorMessage(error) })
        } finally {
            setIsSwapping(false)
        }
    }

    function handleOnRamp() {
        open({ view: "OnRampProviders" })
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Buy {TOKEN_SYMBOL}</CardTitle>
                <CardDescription>
                    Swap USDC for {TOKEN_SYMBOL} on Base using the wallet already connected to the dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5 rounded-xl border p-5 bg-muted/20">
                    <div className="grid gap-2">
                        <Label htmlFor="usdc-amount">You pay</Label>
                        <div className="flex gap-2">
                            <Input
                                id="usdc-amount"
                                inputMode="decimal"
                                min="0"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                placeholder="25"
                            />
                            <div className="rounded-md border px-3 py-2 text-sm font-medium">USDC</div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slippage">Slippage tolerance</Label>
                        <div className="flex gap-2">
                            <Input
                                id="slippage"
                                inputMode="decimal"
                                min="0.1"
                                value={slippage}
                                onChange={(event) => setSlippage(event.target.value)}
                            />
                            <div className="rounded-md border px-3 py-2 text-sm font-medium">%</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-background p-4">
                        <p className="text-sm text-muted-foreground">You receive</p>
                        <p className="mt-1 text-3xl font-bold">
                            {quote ? formatTokenAmount(quote.buyAmount, 18) : "--"} {TOKEN_SYMBOL}
                        </p>
                        {quote?.price && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                Indicative price: {quote.price} {TOKEN_SYMBOL} per USDC
                            </p>
                        )}
                    </div>

                    {message && (
                        <Alert variant={message.type === "error" ? "destructive" : "default"}>
                            {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{message.type === "error" ? "Swap unavailable" : "Swap status"}</AlertTitle>
                            <AlertDescription className="break-words">{message.text}</AlertDescription>
                        </Alert>
                    )}

                    {!isConnected ? (
                        <Button className="w-full" size="lg" onClick={() => open()}>
                            Connect wallet
                            <Wallet className="ml-2 h-4 w-4" />
                        </Button>
                    ) : !isBase ? (
                        <Button className="w-full" size="lg" onClick={() => switchNetwork(base)}>
                            Switch to Base
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : quote ? (
                        <Button className="w-full" size="lg" onClick={handleSwap} disabled={isSwapping}>
                            {isSwapping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Swap USDC for {TOKEN_SYMBOL}
                        </Button>
                    ) : (
                        <Button className="w-full" size="lg" onClick={handleQuote} disabled={!canQuote || isQuoting}>
                            {isQuoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get live quote
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Single wallet flow</AlertTitle>
                        <AlertDescription>
                            This page signs approval and swap transactions with your existing AppKit wallet. No embedded DEX login is required.
                        </AlertDescription>
                    </Alert>

                    <div className="rounded-lg border p-4 bg-muted/50">
                        <h4 className="font-medium">Base {TOKEN_SYMBOL}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Contract address:</p>
                        <div
                            className="text-xs font-mono mt-2 bg-background p-2 rounded"
                            title={tokenAddress}
                        >
                            {shortenAddress(tokenAddress)}
                        </div>
                    </div>

                    <Button className="w-full" size="lg" variant="outline" onClick={handleOnRamp}>
                        Buy USDC with card
                        <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function formatTokenAmount(amount: string, decimals: number) {
    if (!isDecimalString(amount)) return "--"

    return Number(formatUnits(amount, decimals)).toLocaleString(undefined, {
        maximumFractionDigits: 6,
    })
}

function isCrtvSwapQuote(value: unknown): value is CrtvSwapQuote {
    if (!isRecord(value)) return false
    if (!isDecimalString(value.buyAmount) || !isDecimalString(value.sellAmount)) return false
    if (!isRecord(value.transaction)) return false

    return Boolean(value.transaction.to && value.transaction.data && isDecimalString(value.transaction.value))
}

function isDecimalString(value: unknown): value is string {
    return typeof value === "string" && /^\d+$/.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function shortenAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message

    return "Unable to complete the swap"
}

interface CrtvSwapQuote {
    sellAmount: string
    buyAmount: string
    price?: string
    allowanceTarget?: string
    transaction: {
        to: string
        data: string
        value: string
        gas?: string
    }
}

interface SwapMessage {
    type: "info" | "success" | "error"
    text: string
}

interface Eip1193Provider {
    request(args: {
        method: string
        params?: unknown[]
    }): Promise<unknown>
}
