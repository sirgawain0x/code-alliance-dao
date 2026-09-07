"use client"

import { useEffect, useState } from "react"
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers"
import { base } from "@reown/appkit/networks"
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    Copy,
    CreditCard,
    Loader2,
    Wallet,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { METOKEN_DIAMOND_ABI } from "@/config/abis/metoken-diamond"
import {
    BASE_USDC_ADDRESS,
    BUY_TOKEN_ADDRESS,
    CRTV_PURCHASES_ENABLED,
    TOKEN_SYMBOL,
} from "@/config/constants"
import {
    CRTVAI_DECIMALS,
    CRTVAI_DIAMOND_ADDRESS,
    CRTVAI_HUB_2_VAULT_ADDRESS,
    CRTVAI_METOKEN_ADDRESS,
    USDC_DECIMALS,
} from "@/config/metoken"

const ERC20_APPROVAL_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
]

const COMING_SOON_COPY =
    "CRTVAI minting is temporarily unavailable. You can still add the token contract and get USDC ready on Base."

export function BuyCRTV() {
    const { open } = useAppKit()
    const { address, isConnected } = useAppKitAccount()
    const { chainId, switchNetwork } = useAppKitNetwork()
    const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
    const [amount, setAmount] = useState("25")
    const [sellAmount, setSellAmount] = useState("100")
    const [quote, setQuote] = useState<CrtvaiMintQuote | null>(null)
    const [sellQuote, setSellQuote] = useState<CrtvaiSellQuote | null>(null)
    const [usdcBalance, setUsdcBalance] = useState<string | null>(null)
    const [crtvaiBalance, setCrtvaiBalance] = useState<string | null>(null)
    const [isQuoting, setIsQuoting] = useState(false)
    const [isQuotingSell, setIsQuotingSell] = useState(false)
    const [isMinting, setIsMinting] = useState(false)
    const [isSelling, setIsSelling] = useState(false)
    const [message, setMessage] = useState<SwapMessage | null>(null)
    const [mintUnavailable, setMintUnavailable] = useState(false)
    const [copied, setCopied] = useState(false)

    const tokenAddress = BUY_TOKEN_ADDRESS
    const isBase = Number(chainId) === 8453
    const amountValidation = validateUsdcAmount(amount)
    const sellAmountValidation = validateMetokenAmount(sellAmount)
    const canQuote = Boolean(
        isConnected && address && isBase && amountValidation.isValid && Number(amount) > 0,
    )
    const canQuoteSell = Boolean(
        isConnected &&
            address &&
            isBase &&
            sellAmountValidation.isValid &&
            Number(sellAmount) > 0,
    )
    const showComingSoon = !CRTV_PURCHASES_ENABLED || mintUnavailable
    const hasInsufficientUsdc = (() => {
        if (!quote || usdcBalance === null) return false

        try {
            return parseUnits(usdcBalance, USDC_DECIMALS) < BigInt(quote.usdcAmount)
        } catch {
            return false
        }
    })()
    const hasInsufficientCrtvai = (() => {
        if (!sellQuote || crtvaiBalance === null) return false

        try {
            return parseUnits(crtvaiBalance, CRTVAI_DECIMALS) < BigInt(sellQuote.metokenAmount)
        } catch {
            return false
        }
    })()

    useEffect(() => {
        if (!isConnected || !address || !isBase) {
            setUsdcBalance(null)
            return
        }

        let cancelled = false

        async function loadUsdcBalance() {
            try {
                if (!window.ethereum) return

                const provider = new BrowserProvider(window.ethereum as unknown as Eip1193Provider)
                const usdc = new Contract(BASE_USDC_ADDRESS, ERC20_APPROVAL_ABI, provider)
                const balance = await usdc.balanceOf(address)
                if (!cancelled) setUsdcBalance(formatUnits(balance, USDC_DECIMALS))
            } catch {
                if (!cancelled) setUsdcBalance(null)
            }
        }

        void loadUsdcBalance()

        return () => {
            cancelled = true
        }
    }, [address, isBase, isConnected])

    useEffect(() => {
        if (!isConnected || !address || !isBase) {
            setCrtvaiBalance(null)
            return
        }

        let cancelled = false

        async function loadCrtvaiBalance() {
            try {
                if (!window.ethereum) return

                const provider = new BrowserProvider(window.ethereum as unknown as Eip1193Provider)
                const metoken = new Contract(CRTVAI_METOKEN_ADDRESS, ERC20_APPROVAL_ABI, provider)
                const balance = await metoken.balanceOf(address)
                if (!cancelled) setCrtvaiBalance(formatUnits(balance, CRTVAI_DECIMALS))
            } catch {
                if (!cancelled) setCrtvaiBalance(null)
            }
        }

        void loadCrtvaiBalance()

        return () => {
            cancelled = true
        }
    }, [address, isBase, isConnected])

    useEffect(() => {
        setMessage(null)
    }, [activeTab])

    useEffect(() => {
        if (!canQuote) {
            setQuote(null)
            return
        }

        let cancelled = false
        let usdcAmount: bigint

        try {
            usdcAmount = parseUnits(amount, USDC_DECIMALS)
        } catch {
            setQuote(null)
            return
        }

        if (usdcAmount <= 0n) {
            setQuote(null)
            return
        }

        setIsQuoting(true)
        const timer = window.setTimeout(async () => {
            try {
                const response = await fetch("/api/crtvai-mint/quote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usdcAmount: usdcAmount.toString() }),
                })
                const result = await response.json()

                if (!response.ok) {
                    if (!cancelled) {
                        if (result?.code === "MINT_DISABLED") {
                            setMintUnavailable(true)
                            setMessage({ type: "info", text: COMING_SOON_COPY })
                        } else {
                            setMessage({
                                type: "error",
                                text: result?.error || "Unable to fetch mint quote. Try again.",
                            })
                        }
                    }
                    return
                }

                if (!isCrtvaiMintQuote(result)) throw new Error("Mint quote was incomplete")

                if (!cancelled) {
                    setMintUnavailable(false)
                    setQuote(result)
                }
            } catch (error) {
                if (!cancelled) {
                    setMessage({ type: "error", text: getErrorMessage(error) })
                }
            } finally {
                if (!cancelled) setIsQuoting(false)
            }
        }, 400)

        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [amount, canQuote])

    useEffect(() => {
        if (!canQuoteSell || !address) {
            setSellQuote(null)
            return
        }

        let cancelled = false
        let metokenAmount: bigint

        try {
            metokenAmount = parseUnits(sellAmount, CRTVAI_DECIMALS)
        } catch {
            setSellQuote(null)
            return
        }

        if (metokenAmount <= 0n) {
            setSellQuote(null)
            return
        }

        setIsQuotingSell(true)
        const timer = window.setTimeout(async () => {
            try {
                const response = await fetch("/api/crtvai-mint/sell-quote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        metokenAmount: metokenAmount.toString(),
                        sender: address,
                    }),
                })
                const result = await response.json()

                if (!response.ok) {
                    if (!cancelled) {
                        setMessage({
                            type: "error",
                            text: result?.error || "Unable to fetch sell quote. Try again.",
                        })
                    }
                    return
                }

                if (!isCrtvaiSellQuote(result)) throw new Error("Sell quote was incomplete")

                if (!cancelled) setSellQuote(result)
            } catch (error) {
                if (!cancelled) {
                    setMessage({ type: "error", text: getErrorMessage(error) })
                }
            } finally {
                if (!cancelled) setIsQuotingSell(false)
            }
        }, 400)

        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [address, canQuoteSell, sellAmount])

    async function handleMint() {
        if (!quote || !address) return

        setIsMinting(true)
        setMessage(null)

        try {
            if (!window.ethereum) throw new Error("No browser wallet provider found")

            const provider = new BrowserProvider(window.ethereum as unknown as Eip1193Provider)
            const signer = await provider.getSigner()
            const usdc = new Contract(BASE_USDC_ADDRESS, ERC20_APPROVAL_ABI, signer)

            const quoteResponse = await fetch("/api/crtvai-mint/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usdcAmount: quote.usdcAmount }),
            })
            const freshQuote = await quoteResponse.json()
            if (!quoteResponse.ok || !isCrtvaiMintQuote(freshQuote)) {
                throw new Error(freshQuote?.error || "Unable to refresh mint quote")
            }

            const usdcAmount = BigInt(freshQuote.usdcAmount)
            const balance = await usdc.balanceOf(address)
            if (balance < usdcAmount) {
                throw new Error("Insufficient USDC balance for this mint amount")
            }

            const allowance = await usdc.allowance(address, CRTVAI_HUB_2_VAULT_ADDRESS)

            if (allowance < usdcAmount) {
                setMessage({
                    type: "info",
                    text: "Approve USDC for the MeToken hub vault in your wallet.",
                })
                const approvalTx = await usdc.approve(CRTVAI_HUB_2_VAULT_ADDRESS, usdcAmount)
                await approvalTx.wait()
            }

            setMessage({ type: "info", text: `Confirm the ${TOKEN_SYMBOL} mint in your connected wallet.` })
            const diamond = new Contract(CRTVAI_DIAMOND_ADDRESS, METOKEN_DIAMOND_ABI, signer)
            const mintTx = await diamond.mint(CRTVAI_METOKEN_ADDRESS, usdcAmount, address)
            const receipt = await mintTx.wait()
            setMessage({
                type: "success",
                text: `Mint submitted: ${receipt?.hash || mintTx.hash}. Estimated ${formatTokenAmount(freshQuote.metokenAmount, CRTVAI_DECIMALS)} ${TOKEN_SYMBOL} received.`,
            })
            setQuote(freshQuote)
        } catch (error) {
            setMessage({ type: "error", text: getErrorMessage(error) })
        } finally {
            setIsMinting(false)
        }
    }

    async function handleSell() {
        if (!sellQuote || !address) return

        setIsSelling(true)
        setMessage(null)

        try {
            if (!window.ethereum) throw new Error("No browser wallet provider found")

            const provider = new BrowserProvider(window.ethereum as unknown as Eip1193Provider)
            const signer = await provider.getSigner()
            const metoken = new Contract(CRTVAI_METOKEN_ADDRESS, ERC20_APPROVAL_ABI, signer)

            const quoteResponse = await fetch("/api/crtvai-mint/sell-quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    metokenAmount: sellQuote.metokenAmount,
                    sender: address,
                }),
            })
            const freshQuote = await quoteResponse.json()
            if (!quoteResponse.ok || !isCrtvaiSellQuote(freshQuote)) {
                throw new Error(freshQuote?.error || "Unable to refresh sell quote")
            }

            const metokenAmount = BigInt(freshQuote.metokenAmount)
            const balance = await metoken.balanceOf(address)
            if (balance < metokenAmount) {
                throw new Error("Insufficient CRTVAI balance for this sell amount")
            }

            setMessage({
                type: "info",
                text: `Confirm the ${TOKEN_SYMBOL} burn in your connected wallet. USDC will be sent to your wallet.`,
            })
            const diamond = new Contract(CRTVAI_DIAMOND_ADDRESS, METOKEN_DIAMOND_ABI, signer)
            const burnTx = await diamond.burn(CRTVAI_METOKEN_ADDRESS, metokenAmount, address)
            const receipt = await burnTx.wait()
            setMessage({
                type: "success",
                text: `Burn submitted: ${receipt?.hash || burnTx.hash}. Estimated ${formatTokenAmount(freshQuote.usdcAmount, USDC_DECIMALS)} USDC received.`,
            })
            setSellQuote(freshQuote)
            const updatedBalance = await metoken.balanceOf(address)
            setCrtvaiBalance(formatUnits(updatedBalance, CRTVAI_DECIMALS))
        } catch (error) {
            setMessage({ type: "error", text: getErrorMessage(error) })
        } finally {
            setIsSelling(false)
        }
    }

    function handleOnRamp() {
        open({ view: "OnRampProviders" })
    }

    async function handleCopyAddress() {
        try {
            await navigator.clipboard.writeText(tokenAddress)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch {
            setMessage({ type: "error", text: "Unable to copy contract address" })
        }
    }

    if (showComingSoon) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>Buy {TOKEN_SYMBOL}</CardTitle>
                        <Badge variant="secondary" className="gap-1">
                            <Clock3 className="h-3 w-3" />
                            Coming soon
                        </Badge>
                    </div>
                    <CardDescription>
                        Mint CRTVAI with USDC on Base via the MeToken hub. Add the token contract and fund USDC meanwhile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-5 rounded-xl border p-5 bg-muted/20">
                        <Alert>
                            <Clock3 className="h-4 w-4" />
                            <AlertTitle>Minting unavailable</AlertTitle>
                            <AlertDescription>{COMING_SOON_COPY}</AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                            <h3 className="font-medium">While you wait</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                <li>Connect your wallet on Base</li>
                                <li>Add the {TOKEN_SYMBOL} MeToken contract so balances show up</li>
                                <li>Buy USDC with a card so you can mint when purchases are enabled</li>
                            </ol>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            {!isConnected ? (
                                <Button className="flex-1" size="lg" onClick={() => open()}>
                                    Connect wallet
                                    <Wallet className="ml-2 h-4 w-4" />
                                </Button>
                            ) : !isBase ? (
                                <Button className="flex-1" size="lg" onClick={() => switchNetwork(base)}>
                                    Switch to Base
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button className="flex-1" size="lg" variant="secondary" disabled>
                                    Purchases opening soon
                                </Button>
                            )}
                            <Button className="flex-1" size="lg" variant="outline" onClick={handleOnRamp}>
                                Buy USDC with card
                                <CreditCard className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <TokenReadyCard
                        tokenAddress={tokenAddress}
                        copied={copied}
                        onCopy={handleCopyAddress}
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Buy &amp; Sell {TOKEN_SYMBOL}</CardTitle>
                <CardDescription>
                    Mint or burn {TOKEN_SYMBOL} with USDC on Base through the MeToken bonding curve. Your wallet signs transactions directly — this is not a DEX swap or CCIP bridge.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "buy" | "sell")}
                    className="gap-6"
                >
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="buy">Buy (Mint)</TabsTrigger>
                        <TabsTrigger value="sell">Sell (Burn)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="buy" className="mt-0">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-5 rounded-xl border p-5 bg-muted/20">
                                {usdcBalance && (
                                    <p className="text-sm text-muted-foreground">
                                        Wallet USDC balance: <span className="font-medium text-foreground">{usdcBalance}</span>
                                    </p>
                                )}

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
                                    {!amountValidation.isValid && amount.length > 0 && (
                                        <p className="text-sm text-destructive">{amountValidation.error}</p>
                                    )}
                                </div>

                                <div className="rounded-lg border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">You receive (estimated)</p>
                                    <p className="mt-1 text-3xl font-bold">
                                        {quote ? formatTokenAmount(quote.metokenAmount, CRTVAI_DECIMALS) : isQuoting ? "…" : "--"} {TOKEN_SYMBOL}
                                    </p>
                                    {quote?.priceUsdcPerToken && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Indicative price: {quote.priceUsdcPerToken} USDC per {TOKEN_SYMBOL}
                                        </p>
                                    )}
                                </div>

                                {message && activeTab === "buy" && !hasInsufficientUsdc && (
                                    <Alert variant={message.type === "error" ? "destructive" : "default"}>
                                        {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                        <AlertTitle>
                                            {message.type === "error"
                                                ? "Unable to mint"
                                                : message.type === "info"
                                                  ? "Heads up"
                                                  : "Mint status"}
                                        </AlertTitle>
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
                                ) : (
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleMint}
                                        disabled={!quote || isMinting || isQuoting || hasInsufficientUsdc}
                                    >
                                        {isMinting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {hasInsufficientUsdc
                                            ? "Insufficient USDC"
                                            : `Mint ${TOKEN_SYMBOL} with USDC`}
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>MeToken mint path</AlertTitle>
                                    <AlertDescription>
                                        USDC is approved to the hub vault, then the Diamond FoundryFacet mints CRTVAI to your wallet.
                                    </AlertDescription>
                                </Alert>

                                <TokenReadyCard
                                    tokenAddress={tokenAddress}
                                    copied={copied}
                                    onCopy={handleCopyAddress}
                                />

                                <Button className="w-full" size="lg" variant="outline" onClick={handleOnRamp}>
                                    Buy USDC with card
                                    <CreditCard className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="sell" className="mt-0">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-5 rounded-xl border p-5 bg-muted/20">
                                {crtvaiBalance && (
                                    <p className="text-sm text-muted-foreground">
                                        Wallet {TOKEN_SYMBOL} balance: <span className="font-medium text-foreground">{crtvaiBalance}</span>
                                    </p>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="crtvai-amount">You sell</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="crtvai-amount"
                                            inputMode="decimal"
                                            min="0"
                                            value={sellAmount}
                                            onChange={(event) => setSellAmount(event.target.value)}
                                            placeholder="100"
                                        />
                                        <div className="rounded-md border px-3 py-2 text-sm font-medium">{TOKEN_SYMBOL}</div>
                                    </div>
                                    {!sellAmountValidation.isValid && sellAmount.length > 0 && (
                                        <p className="text-sm text-destructive">{sellAmountValidation.error}</p>
                                    )}
                                </div>

                                <div className="rounded-lg border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">You receive (estimated)</p>
                                    <p className="mt-1 text-3xl font-bold">
                                        {sellQuote ? formatTokenAmount(sellQuote.usdcAmount, USDC_DECIMALS) : isQuotingSell ? "…" : "--"} USDC
                                    </p>
                                    {sellQuote?.priceUsdcPerToken && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Indicative price: {sellQuote.priceUsdcPerToken} USDC per {TOKEN_SYMBOL}
                                        </p>
                                    )}
                                </div>

                                {message && activeTab === "sell" && !hasInsufficientCrtvai && (
                                    <Alert variant={message.type === "error" ? "destructive" : "default"}>
                                        {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                        <AlertTitle>
                                            {message.type === "error"
                                                ? "Unable to sell"
                                                : message.type === "info"
                                                  ? "Heads up"
                                                  : "Sell status"}
                                        </AlertTitle>
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
                                ) : (
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleSell}
                                        disabled={!sellQuote || isSelling || isQuotingSell || hasInsufficientCrtvai}
                                    >
                                        {isSelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {hasInsufficientCrtvai
                                            ? `Insufficient ${TOKEN_SYMBOL}`
                                            : `Sell ${TOKEN_SYMBOL} for USDC`}
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>MeToken burn path</AlertTitle>
                                    <AlertDescription>
                                        Burning CRTVAI through the Diamond FoundryFacet returns USDC to your wallet via the bonding curve refund ratio. No USDC approval is needed.
                                    </AlertDescription>
                                </Alert>

                                <TokenReadyCard
                                    tokenAddress={tokenAddress}
                                    copied={copied}
                                    onCopy={handleCopyAddress}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function TokenReadyCard({
    tokenAddress,
    copied,
    onCopy,
}: {
    tokenAddress: string
    copied: boolean
    onCopy: () => void
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium">Base {TOKEN_SYMBOL} MeToken</h4>
                <p className="text-sm text-muted-foreground mt-1">Contract address:</p>
                <div
                    className="text-xs font-mono mt-2 bg-background p-2 rounded break-all"
                    title={tokenAddress}
                >
                    {tokenAddress}
                </div>
                <Button className="w-full mt-3" variant="outline" size="sm" onClick={onCopy}>
                    {copied ? (
                        <>
                            Copied
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Copy address
                            <Copy className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

function formatTokenAmount(amount: string, decimals: number) {
    if (!isDecimalString(amount)) return "--"

    const formatted = formatUnits(amount, decimals)
    const [whole, fraction = ""] = formatted.split(".")
    const trimmedFraction = fraction.replace(/0+$/, "").slice(0, 6)

    if (!trimmedFraction) return Number(whole).toLocaleString()

    return `${Number(whole).toLocaleString()}.${trimmedFraction}`
}

function validateUsdcAmount(value: string) {
    if (!value.trim()) return { isValid: false, error: "Enter a USDC amount" }

    if (!/^\d+(\.\d+)?$/.test(value)) {
        return { isValid: false, error: "Enter a valid USDC amount" }
    }

    const [, fraction = ""] = value.split(".")
    if (fraction.length > USDC_DECIMALS) {
        return { isValid: false, error: `USDC supports up to ${USDC_DECIMALS} decimal places` }
    }

    return { isValid: true, error: null }
}

function validateMetokenAmount(value: string) {
    if (!value.trim()) return { isValid: false, error: `Enter a ${TOKEN_SYMBOL} amount` }

    if (!/^\d+(\.\d+)?$/.test(value)) {
        return { isValid: false, error: `Enter a valid ${TOKEN_SYMBOL} amount` }
    }

    const [, fraction = ""] = value.split(".")
    if (fraction.length > CRTVAI_DECIMALS) {
        return { isValid: false, error: `${TOKEN_SYMBOL} supports up to ${CRTVAI_DECIMALS} decimal places` }
    }

    return { isValid: true, error: null }
}

function isCrtvaiSellQuote(value: unknown): value is CrtvaiSellQuote {
    if (!isRecord(value)) return false

    return isDecimalString(value.metokenAmount) && isDecimalString(value.usdcAmount)
}

function isCrtvaiMintQuote(value: unknown): value is CrtvaiMintQuote {
    if (!isRecord(value)) return false

    return isDecimalString(value.usdcAmount) && isDecimalString(value.metokenAmount)
}

function isDecimalString(value: unknown): value is string {
    return typeof value === "string" && /^\d+$/.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message

    return "Unable to complete the transaction"
}

interface CrtvaiMintQuote {
    usdcAmount: string
    metokenAmount: string
    priceUsdcPerToken?: string
}

interface CrtvaiSellQuote {
    metokenAmount: string
    usdcAmount: string
    priceUsdcPerToken?: string
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
