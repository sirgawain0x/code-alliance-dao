"use client"

import { useState } from "react"
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { base, optimism, polygon } from '@reown/appkit/networks'
import { createClient } from "@chainlink/ccip-js";
import { ethersSignerToWalletClient } from "@chainlink/ccip-js/dist/ethers-adapters";
import { base as viemBase, optimism as viemOptimism, polygon as viemPolygon } from "viem/chains";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2 } from "lucide-react"
import { ethers, parseUnits } from "ethers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CRTV_TOKEN_ADDRESSES, CHAIN_SELECTORS, CCIP_ROUTER_ADDRESSES, SUPPORTED_CHAINS } from "@/config/constants"
import { PoolStatsCard } from "./pool-stats-card"

type ChainId = keyof typeof CRTV_TOKEN_ADDRESSES;

export function BridgeForm() {
    const { address, isConnected } = useAppKitAccount()
    const { chainId, switchNetwork } = useAppKitNetwork()
    const currentChainId = chainId as ChainId | undefined;

    const [amount, setAmount] = useState("")
    const [destChainId, setDestChainId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<"idle" | "approving" | "bridging">("idle")
    const [statusData, setStatusData] = useState<{ txHash?: string, error?: string }>({})

    // Filter available destinations (exclude current)
    const availableDestinations = SUPPORTED_CHAINS.filter(c => c !== currentChainId);

    const handleBridge = async () => {
        if (!address || !currentChainId || !destChainId || !amount) return;

        setIsLoading(true);
        setStatusData({});

        try {
            // 1. Setup Providers/Signers
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const provider = new ethers.BrowserProvider(window.ethereum as any);
            const signer = await provider.getSigner();

            const routerAddress = CCIP_ROUTER_ADDRESSES[currentChainId];
            const tokenAddress = CRTV_TOKEN_ADDRESSES[currentChainId];
            const destSelector = CHAIN_SELECTORS[parseInt(destChainId) as ChainId];

            if (!routerAddress || !tokenAddress || !destSelector) {
                throw new Error("Configuration error: Missing addresses");
            }

            // Map chainId to Viem chain
            const chainMap: Record<number, any> = {
                8453: viemBase,
                10: viemOptimism,
                137: viemPolygon
            };
            const viemChain = chainMap[currentChainId];
            if (!viemChain) throw new Error("Unsupported chain for SDK");

            // Convert to Viem Client
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletClient = await ethersSignerToWalletClient(signer as any, viemChain);
            const ccipClient = createClient();

            const amountBigInt = parseUnits(amount, 18);

            // 2. Check Allowance & Approve
            setStep("approving");

            // Check allowance
            const currentAllowance = await ccipClient.getAllowance({
                client: walletClient,
                routerAddress: routerAddress as any,
                tokenAddress: tokenAddress as any,
                account: address as any
            });

            if (currentAllowance < amountBigInt) {
                const { txHash } = await ccipClient.approveRouter({
                    client: walletClient,
                    routerAddress: routerAddress as any,
                    tokenAddress: tokenAddress as any,
                    amount: amountBigInt,
                    waitForReceipt: true
                });
                console.log("Approved tx:", txHash); // Optional logging
            }

            // 3. Bridge
            setStep("bridging");

            const { txHash } = await ccipClient.transferTokens({
                client: walletClient,
                routerAddress: routerAddress as any,
                tokenAddress: tokenAddress as any,
                amount: amountBigInt,
                destinationChainSelector: destSelector,
                destinationAccount: address as any, // Send to self
                feeTokenAddress: ethers.ZeroAddress as any, // Native fee
            });

            setStatusData({ txHash });
            setStep("idle");
            setAmount("");
        } catch (e: any) {
            console.error("Bridge Error:", e);
            setStatusData({ error: e.message || "Unknown error occurred" });
            setStep("idle");
        } finally {
            setIsLoading(false);
        }
    }

    if (!isConnected || !SUPPORTED_CHAINS.includes(currentChainId as any)) {
        return (
            <div className="text-center py-4 space-y-4">
                <p className="text-muted-foreground">Connect to a supported network to bridge.</p>
                <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => switchNetwork(base)}>Base</Button>
                    <Button variant="outline" size="sm" onClick={() => switchNetwork(optimism)}>OP</Button>
                    <Button variant="outline" size="sm" onClick={() => switchNetwork(polygon)}>Poly</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-4">
            <PoolStatsCard />

            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                <div className="grid gap-2">
                    <Label>Destination Chain</Label>
                    <Select value={destChainId} onValueChange={setDestChainId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select chain" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableDestinations.map(c => (
                                <SelectItem key={c} value={c.toString()}>
                                    {c === 8453 ? "Base" : c === 10 ? "Optimism" : "Polygon"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                    />
                </div>

                {statusData.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{statusData.error}</AlertDescription>
                    </Alert>
                )}

                {statusData.txHash && (
                    <Alert className="border-green-500 text-green-500">
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription className="break-all">
                            Details: <a href={`https://ccip.chain.link/msg/${statusData.txHash}`} target="_blank" className="underline">View on CCIP Explorer</a>
                        </AlertDescription>
                    </Alert>
                )}

                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleBridge}
                    disabled={isLoading || !destChainId || !amount}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {step === "approving" ? "Approving..." : "Bridging..."}
                        </>
                    ) : (
                        <>
                            Bridge Tokens <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
