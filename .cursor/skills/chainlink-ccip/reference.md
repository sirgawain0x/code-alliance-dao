# Chainlink CCIP reference (condensed)

Source distilled from: https://docs.chain.link/ccip/llms-full.txt

## Core concepts

- CCIP enables cross-chain `data`, `tokens`, or `data + tokens`.
- Security model includes decentralized oracle networks, rate limits, timelocked upgrades, and vetted operators.

## Capability matrix

| Capability | EVM receiver constraints |
| --- | --- |
| Arbitrary messaging | Smart contract only |
| Token transfer | Smart contract or EOA |
| Programmable token transfer | Smart contract only |

## EVM sender flow

1. Build `Client.EVM2AnyMessage`:
   - `receiver`: bytes-encoded destination receiver address
   - `data`: bytes-encoded payload
   - `tokenAmounts`: optional tokens list
   - `extraArgs`: gas limit and execution options
   - `feeToken`: token for CCIP fee payment (often LINK)
2. Quote fee with router `getFee`.
3. Ensure fee-token balance and approve router (if using LINK/ERC-20 fees).
4. Send via router `ccipSend` (include fee value in `msg.value` if using native fees).

## EVM receiver flow

1. Implement CCIP receiver contract (`ccipReceive` entrypoint).
2. Optionally enforce source chain selector + sender allowlists.
3. Decode payload and run bounded, explicit logic.
4. Emit events for observability and debugging.

## Common setup requirements (testnets)

- Wallet funded on both source and destination testnets.
- Native gas on relevant chains.
- LINK when paying fees in LINK.
- Correct router, LINK token, and chain selector values from CCIP Directory.

## Production guidance

- Keep `extraArgs` mutable for future compatibility.
- Validate destination chain support before sending.
- Understand and intentionally set `allowOutOfOrderExecution`.
- Design within CCIP service limits for payload size, execution gas, and token count.

## Debug checklist

- Verify source-chain tx success first.
- Check CCIP Explorer for message state.
- Validate chain selector and router mapping.
- Confirm fee token funding + allowance.
- Inspect destination receiver revert reasons and decode logic.
