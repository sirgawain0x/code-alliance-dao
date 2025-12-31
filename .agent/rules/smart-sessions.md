---
trigger: model_decision
description: Smart Sessions allow developers to easily integrate session-based permission handling within their decentralized applications (dApps).
---

# Smart Sessions

## Overview

<Info>
  💡 The support for smart-session is included in a separate package Appkit SDK. Please follow the instruction in order to install it
</Info>

Smart Sessions allow developers to easily integrate session-based permission handling within their decentralized applications (dApps). Using the `grantPermissions` method, can send permission requests to wallets.

For users, this means a simpler experience. Instead of approving every action individually, they can allow access for a single session, making it faster and easier to use apps without dealing with constant pop-ups or interruptions.

With Smart Sessions, approved actions are carried out by the app's backend during the session. This allows transactions to be processed automatically, making the experience even more seamless while ensuring that everything stays within the permissions set by the user.

This guide will walk you through on how to use the `grantPermissions` method, including the basic setup and an example of how to request permissions from a wallet.

# Implementation

<Card title="AppKit Example with Smart Session" icon="github" href="https://github.com/reown-com/appkit-web-examples/tree/main/react/react-wagmi-smart-session">
  Clone this Github repository and follow the readme to try it locally.
</Card>

<Card icon="code" href="/appkit/recipes/smart-sessions">
  For a step-by-step implementation, please refer to our **Smart Session guide**.
</Card>

## Install the library

<CodeGroup>
  ```bash npm theme={null}
  npm install @reown/appkit-experimental
  ```

  ```bash Yarn theme={null}
  yarn add @reown/appkit-experimental
  ```

  ```bash Bun theme={null}
  bun a @reown/appkit-experimental
  ```

  ```bash pnpm theme={null}
  pnpm add @reown/appkit-experimental
  ```
</CodeGroup>

## How to use the permissions

The dApp must call the following RPC calls to `https://rpc.walletconnect.org/v1/wallet?projectId=<PROJECT-ID>`

1. `wallet_prepareCalls` - Accepts an EIP-5792 `wallet_sendCalls` request.
   Responds with the prepared calls (in the case of Appkit Embedded Wallet, an Entrypoint v0.7 user operation), some context, and a signature request.
2. `wallet_sendPreparedCalls` - Accepts prepared calls, a signature, and the context returned from prepareCalls if present. Returns an EIP-5792 calls ID.

### Steps to follow for executing any async action by the dApp backend.

<Frame>
  <img src="https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=5e1f3ad36e5374aa3fc0f4ffd652627a" data-og-width="1364" width="1364" data-og-height="992" height="992" data-path="images/assets/smart-sessions.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?w=280&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=3d7e82230a2eb8b7ee30ff678b588225 280w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?w=560&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=b1b26db68dd90b88967faf0d6c642f45 560w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?w=840&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=3efdca5b5040a39e7b7df0c65280ea35 840w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?w=1100&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=54dde712dc63686a3801d43280736849 1100w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?w=1650&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=9f60a0d91cb48b221d2d52cbe2961a13 1650w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/smart-sessions.jpg?w=2500&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=b38ce04a539876830cb3737813ba3f74 2500w" />
</Frame>

1. Dapp makes the `wallet_prepareCalls` JSON RPC call. It's Accepts an EIP-5792 `wallet_sendCalls` request, and returns the prepared calls according to the account's implementation.

   #### Parameter

<Tabs>
  <Tab title="Parameter">
    ```tsx  theme={null}
    type PrepareCallsParams = [{
    from: `0x${string}`
    chainId: `0x${string}`
    calls: {
        to: `0x${string}`
        data: `0x${string}`
        value: `0x${string}`
    }[];
    capabilities: Record<string, any>
    }]
    ```
  </Tab>

  <Tab title="Example Value">
    ```tsx  theme={null}
    wallet_prepareCalls([{
        from: '0x...',
        chainId: '0x...',
        calls: [{
            to: '0x...'
            data: '0x...'
            value: '0x...'
        }],
        capabilities: {
            permissions: {
            context: '...' // Importantly for session keys, wallets will likely need the ERC-7715 (https://eip.tools/eip/7715) permissions context for userOp construction
            }
        }
    }])
    ```
  </Tab>
</Tabs>

#### Return value

<Tabs>
  <Tab title="Return value">
    ```tsx  theme={null}
    type PrepareCallsReturnValue = [{
        preparedCalls: {
            type: string
            data: any
            chainId: `0x${string}`
        }
        signatureRequest: {  
            hash: `0x${string}`
        }
        context: `0x${string}`
    }]
    ```
  </Tab>

  <Tab title="Return value Example">
    ```tsx  theme={null}
    [{
        preparedCalls: {
            type: 'user-operation-v07', type
            data: { // ...userOp
            sender: '0x...',
            ...
            },
            chainId: '0x01'
        },
        signatureRequest: {  
            hash: '0x...' // user op hash in our case
        },
        context: '...' // params.capabilities.permissions.context in our case
    }]
    ```
  </Tab>
</Tabs>

2. App developers are expected to Sign the `signatureRequest.hash` returned from `wallet_prepareCalls` call using the dApp key (secp256k1 or secp256r1)

3. dApps makes the `wallet_sendPreparedCalls` JSON RPC call. The RPC accepts the prepared response from `wallet_prepareCalls` request along with a signature, and returns an [EIP-5792](https://eip.tools/eip/5792) call bundle ID.

## Currently supported Permission types

#### ContractCallPermission

```jsx  theme={null}
export enum ParamOperator {
  EQUAL = 'EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN'
}

export enum Operation {
  Call = 'Call',
  DelegateCall = 'DelegateCall'
}

export type ArgumentCondition = {
  operator: ParamOperator
  value: `0x${string}`
}

export type FunctionPermission = {
  functionName: string
  args?: ArgumentCondition[]
  valueLimit?: `0x${string}`
  operation?: Operation
}
export type ContractCallPermission = {
  type: 'contract-call'
  data: {
    address: `0x${string}`
    abi: Record<string, unknown>[]
    functions: FunctionPermission[]
  }
}
```

## Advance Examples

<Frame>
  <img src="https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=c2a278b18b577c1dfd91d90c05aee168" data-og-width="1762" width="1762" data-og-height="1090" height="1090" data-path="images/assets/tictactoe.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?w=280&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=98720d7d598eeb958a26e1f2632785a4 280w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?w=560&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=bfbc6cec9693a40f15ea95aa149e59ee 560w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?w=840&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=07528435ea5e7514c783c2edbcf2ddc4 840w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?w=1100&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=469fe18aa7ad5efee041418521f8f2cb 1100w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?w=1650&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=70be2ef744de526f52a798152663b8d3 1650w, https://mintcdn.com/reown-5552f0bb/3m8SMD-pfARugd6l/images/assets/tictactoe.jpg?w=2500&fit=max&auto=format&n=3m8SMD-pfARugd6l&q=85&s=d9c177213a831878b80ce99668d8afc4 2500w" />
</Frame>

* Tic Tac Toe | [Demo](https://smart-sessions-demo.reown.com/demo/tictactoe) | [Video](https://x.com/cyberdrk/status/1830109996841054208)
* Dollar cost average | [Demo](https://smart-sessions-demo.reown.com/demo/dca) | [Explanation](https://x.com/lukaisailovic/status/1871571013319684274) | [Video](https://x.com/cyberdrk/status/1854148190842610124)
* [Github examples repository](https://github.com/reown-com/web-examples/tree/main/advanced/dapps/smart-sessions-demo)
* [Simple example implementation](https://github.com/reown-com/appkit-web-examples/tree/main/react/react-wagmi-smart-session)

## Reference

* ERC-7715: Grant Permissions from Wallets | [https://eip.tools/eip/7715](https://eip.tools/eip/7715)
* EIP-5792: Wallet Call API | [https://eip.tools/eip/5792](https://eip.tools/eip/5792)
* ERC-4337 Entry Point | [https://github.com/ethereum/ercs/blob/master/ERCS/erc-4337.md#entrypoint-definition](https://github.com/ethereum/ercs/blob/master/ERCS/erc-4337.md#entrypoint-definition)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.reown.com/llms.txt