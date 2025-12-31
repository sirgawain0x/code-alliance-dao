---
trigger: model_decision
description: Deposit with Exchange gives your users a seamless way to fund their connected wallets directly from centralized exchange accounts like Coinbase and Binance (with more exchanges coming soon).
---

# Deposit with Exchange - Next.js

**Deposit with Exchange** gives your users a seamless way to fund their connected wallets directly from centralized exchange accounts like Coinbase and Binance (with more exchanges coming soon). Instead of forcing users to leave your app, log into their exchange, and manually handle withdrawals, you can offer a guided in-app flow that keeps them engaged and ready to transact.

## Pre-Requisites

**To enable this feature, you will need to provide your own Coinbase Developer Platform (CDP) API keys.**

You can find instructions on how to do this [here](https://docs.cdp.coinbase.com/onramp-&-offramp/introduction/getting-started).

Head over to [Reown Dashboard](https://dashboard.reown.com) and navigate to the "Fund from Exchange" section to configure your API keys.

<Frame>
  <img src="https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=a80b5341404ce8b114b0fc45dd5edce1" alt="Coinbase CDP Keys Setup" data-og-width="370" width="370" data-og-height="599" height="599" data-path="images/dwe-coinbase.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?w=280&fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=7b26f23b0e87647723c79c1b3f7e8edd 280w, https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?w=560&fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=f2b35c2cd440c48716045e0d242a0c8b 560w, https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?w=840&fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=977ac4c1a1e7b381a1e274a8067bbaaf 840w, https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?w=1100&fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=5a69d567d295a0558824420e16d79744 1100w, https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?w=1650&fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=610d3c0f253b0c0c395f897d4772e88d 1650w, https://mintcdn.com/reown-5552f0bb/9dthy0xdim8e0IYU/images/dwe-coinbase.png?w=2500&fit=max&auto=format&n=9dthy0xdim8e0IYU&q=85&s=3dcb7dc847450ab316448a67a23d5e96 2500w" />
</Frame>

## Quickstart

This feature will start working as soon as your team is on the allowed-list. Please, contact [sales@reown.com](mailto:sales@reown.com) to get started.

<Warning>
  Projects first need to install and set up Reown AppKit before integrating AppKit Pay. If you haven't done so, please refer to the [Reown AppKit docs](/appkit/overview#quickstart).
</Warning>

Clicking on Fund your wallet will show the modal below:

<img src="https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=ece293850d6decb28ab0725d58769ce0" alt="Funding your wallet with Deposit with Exchange" data-og-width="1557" width="1557" data-og-height="715" height="715" data-path="images/fundDepositWithExchange.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?w=280&fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=a74d72eeb5afb37859252991c1f45fc2 280w, https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?w=560&fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=4dd47d00e2cefd4ca26afab93fbe434b 560w, https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?w=840&fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=a0ebe158cea0cf42725575e67af52df0 840w, https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?w=1100&fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=2cd84f8eb35618a18825895073a4d420 1100w, https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?w=1650&fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=77b07e9df833d88f18242205749f4355 1650w, https://mintcdn.com/reown-5552f0bb/OmgWGx5ADZaQgMs0/images/fundDepositWithExchange.jpg?w=2500&fit=max&auto=format&n=OmgWGx5ADZaQgMs0&q=85&s=b99ac6581af4f78878d073e03afb0a46 2500w" />

## Start Deposit with Exchange from a button

### Install the library

<CodeGroup>
  ```bash npm theme={null}
  npm install @reown/appkit-pay
  ```

  ```bash Yarn theme={null}
  yarn add @reown/appkit-pay
  ```

  ```bash Bun theme={null}
  bun a @reown/appkit-pay
  ```

  ```bash pnpm theme={null}
  pnpm add @reown/appkit-pay
  ```
</CodeGroup>

### Usage

Import the `baseUSDC` asset, the `pay` function and the `useAppKitAccount` hook to get the address of the connected wallet.

```ts  theme={null}

import { baseUSDC, pay } from '@reown/appkit-pay';
import { useAppKitAccount  } from '@reown/appkit/react'
```

Get the address of the connected wallet using the `useAppKitAccount` hook. You can also check if the user is connected using the `isConnected` boolean.

```ts  theme={null}
const { address, isConnected } = useAppKitAccount()
```

In order to run the deposit, use the function `pay`. This function receives three values.

```ts  theme={null}
// pay function returns a PaymentResult object
const result = await pay({ 
    recipient: address,
    amount: 0.0001,
    paymentAsset: baseUSDC
});

if (result.success) {
    console.log("Payment successful: "+ result.result);
} else {
    console.error("Payment error: "+ result.error);
}
```

## Supported Networks and Assets

For a complete list of supported networks and assets across different exchanges (Coinbase, Binance), please refer to the [Networks and Assets Supported](/appkit/payments/pay-with-exchange#networks-and-assets-supported) section in our Pay with Exchange documentation.

## Assets Configuration

For the moment, AppKit Pay has pre-configured these assets:

* baseETH, baseSepoliaETH, and baseUSDC
* ethereumUSDC, optimismUSDC, arbitrumUSDC, polygonUSDC and solanaUSDC
* ethereumUSDT, optimismUSDT, arbitrumUSDT, polygonUSDT and solanaUSDT

```ts  theme={null}
import { baseETH } from '@reown/appkit-pay' 
```

For custom assets, you can create a paymentAsset object with all the information:

```ts  theme={null}
// Configure the paymentAsset
const paymentAssetDetails = {
    network: 'eip155:8453', // Base Mainnet
    asset: 'native', // Or USDC in Base: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
    metadata: {
        name: 'Ethereum', // Or 'USD Coin'
        symbol: 'ETH',    // Or 'USDC'
        decimals: 18      // Or 6 for USDC
    }
};
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.reown.com/llms.txt