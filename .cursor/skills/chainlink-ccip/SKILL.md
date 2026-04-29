---
name: chainlink-ccip
description: Build, debug, and explain Chainlink CCIP integrations for EVM apps, including arbitrary messaging, token transfer, and programmable token transfer. Use when users mention CCIP, cross-chain messaging, chain selectors, routers, LINK fee funding, CCIP Explorer, or Sender/Receiver workflows.
---

# Chainlink CCIP

Use this skill when the task involves Chainlink CCIP architecture, setup, coding, or troubleshooting.

## Quick triage

1. Identify capability:
   - `arbitrary messaging` (data only)
   - `token transfer` (tokens only)
   - `programmable token transfer` (data + tokens)
2. Identify chain family and account model:
   - EVM message receivers must be smart contracts (not EOAs)
   - EVM token transfers can target smart contracts or EOAs
3. Verify required inputs:
   - source and destination chains are CCIP-supported
   - destination chain selector is correct
   - router addresses are correct for each chain
   - fee token and funding strategy (LINK or native where supported)

## Implementation workflow (EVM)

1. Confirm prerequisites:
   - wallet funded on both testnets
   - sufficient gas token + LINK when paying fees in LINK
2. Build sender:
   - construct `Client.EVM2AnyMessage`
   - encode receiver and payload with `abi.encode(...)`
   - set `tokenAmounts`, `extraArgs`, and `feeToken`
   - estimate fees with router `getFee(...)`
   - approve fee token and call `ccipSend(...)`
3. Build receiver:
   - inherit CCIP receiver base contract
   - validate `sourceChainSelector` and sender allowlist as needed
   - decode payload and execute minimal, safe logic
4. Observe delivery:
   - track source tx and CCIP message status in CCIP Explorer
   - verify destination `ccipReceive` execution and emitted events

## Best-practice checklist

- Do not hardcode `extraArgs`; keep them upgrade-friendly
- Validate destination chain and receiver addresses before sending
- Understand `allowOutOfOrderExecution` trade-offs
- Respect service limits (payload size, gas, token count)
- Add access control, rate limits, and pause controls for production
- Model failures explicitly and emit events for observability

## Troubleshooting checklist

- Message not delivered:
  - check chain selector, router addresses, and explorer status
  - confirm destination receiver supports expected account type
- Fee/transfer failures:
  - check fee estimate, LINK balance, and allowance to router
  - retry with higher funding if destination gas spikes
- Receiver reverts:
  - inspect decode logic and input schema compatibility
  - validate source-chain/sender allowlist logic

## Additional resources

- For deeper implementation guidance, see [reference.md](reference.md)
- Canonical source: https://docs.chain.link/ccip/llms-full.txt
