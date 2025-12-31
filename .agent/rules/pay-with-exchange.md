---
trigger: model_decision
description: AppKit Pay with Exchange unlocks a powerful new flow: users can pay in crypto directly from their Centralized Exchange (CEXs) accounts like Binance or Coinbase, with no new wallets, no app switching, and no lost conversions.
---

# AppKit Pay with Exchange - Next.js

**AppKit Pay with Exchange** unlocks a powerful new flow: users can pay in crypto directly from their Centralized Exchange (CEXs) accounts like Binance or Coinbase, with no new wallets, no app switching, and no lost conversions.

## Quickstart

Here you can find a simplified process to integrate AppKit Pay:

<Warning>
  Projects first need to install and set up Reown AppKit before integrating AppKit Pay. If you haven't done so, please refer to the [Reown AppKit docs](/appkit/overview#quickstart).
</Warning>

## Code Example

<Card title="AppKit Pay Example" icon="github" href="https://github.com/reown-com/appkit-web-examples/tree/main/react/react-wagmi-appkit-pay">
  Check the React example
</Card>

### Install the library

<Note>
  Projects currently using Reown AppKit, or planning to use it to build custom payment flows with self-custodial wallets, should use AppKit Pay for a streamlined integration and significantly improved user experience out of the box. AppKit Pay can be found in `@reown/appkit-pay` npm package.
</Note>

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

There are two main ways to handle payments:

### `pay` - Full Payment Flow

This function handles the complete payment flow — it opens the payment UI *and* waits for the result (success, failure, cancel, timeout).

```ts  theme={null}
import { baseSepoliaETH, pay} from '@reown/appkit-pay'
```

In order to run the payment, use the function `pay`. This function receives three values: `recipient`, `amount`, and `paymentAsset`.

```ts  theme={null}
// pay function returns a PaymentResult object
const result = await pay({ 
    recipient: addressRecipient,
    amount: 0.0001,
    paymentAsset: baseSepoliaETH
});

if (result.success) {
    console.log("Payment successful: "+ result.result);
} else {
    console.error("Payment error: "+ result.error);
}
```

### `openPay` - Open Payment UI Only

This function opens or triggers the payment UI modal but doesn't return the result of the payment. Use the hook to handle the payment result.

```ts  theme={null}
import { baseSepoliaETH, openPay} from '@reown/appkit-pay'
```

Call the hook to open the payment modal.

```tsx  theme={null}
    const { open: openPay, isPending, isSuccess, data, error } = usePay({
      onSuccess: handleSuccess, 
      onError: handleError,
    });
```

Open the payment modal, but onSuccess/onError handles the actual payment result:

```tsx  theme={null}
      await openPay({ 
        paymentAsset: baseSepoliaETH,
        recipient: address,
        amount: 1000000000000000000 // 1 ETH
      });
```

Handle the payment result in the onSuccess/onError callbacks:

```tsx  theme={null}
    const handleSuccess = (data: PaymentResult) => {
      console.log("Payment successful:", data);
    };

    const handleError = (error: AppKitPayErrorMessage) => {
      console.error("Payment error:", error);
    };
```

Or handle the payment result in the UI by displaying the payment status:

```tsx  theme={null}
    {isSuccess || isPending || error && (
          <section>
            <h2>Payment Status</h2>
          {isSuccess && (
            <p>Payment successful: {data}</p>
          )}
          {isPending && (
            <p>Payment pending: {data}</p>
          )}
          {error && (
            <p>Payment error: {error}</p>
          )}
          </section>
    )}
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

## Prerequisites

### Enable Payments Feature in Dashboard

The "Payments" feature **must be enabled** in the [Reown Dashboard](https://dashboard.reown.com) before you can use AppKit Pay, even for local testing.

1. Go to your project in the Reown Dashboard
2. Navigate to the Payments section
3. Enable the Payments feature for your projectId

## Test locally

In order to test locally use localhost and port 3000. This is the only port available for local testing.

Add the following to your package.json file in order to run the development server on port 3000:

```json  theme={null}
"scripts": {
    "dev": "vite --port 3000",
},
```

## Test the complete exchange flow

To test the entire exchange process, we've implemented a dedicated test scenario that activates when using the token `baseSepoliaETH`.

<img src="https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=f0ac6b05b6c22bca1d70e206385e9486" alt="Test Exchange" data-og-width="500" width="500" data-og-height="453" height="453" data-path="images/test-exchange.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?w=280&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=5e776a276ae183fb350ef19bc66f0e61 280w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?w=560&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=ad41d6c7f393029fda387c97c758c38e 560w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?w=840&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=5055df3f1e35de65182ec691491868a4 840w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?w=1100&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=703b95af7b597fdb81bebf08074ab378 1100w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?w=1650&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=90bb58f429320c1866f9ff0ffb42abbc 1650w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange.png?w=2500&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=423406a407ac573e865ad8cdff6a998c 2500w" />

Upon selecting this test exchange, you will be redirected to a result modal where you can choose between two paths:

* **Complete Successfully** – Simulates a successful exchange outcome.

* **Trigger an Error** – Simulates a failed exchange with an error response.

<img src="https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=50f30dbfdbca6494826471f3f5cd9c3a" alt="Test Exchange Result" data-og-width="500" width="500" data-og-height="515" height="515" data-path="images/test-exchange2.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?w=280&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=66b477a762453389a519aaf355fd395a 280w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?w=560&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=7da54c9564fe1f4d068fa8d82d2d2e26 560w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?w=840&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=236d3333added1222ef30323f35fda1e 840w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?w=1100&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=e0a79862a0e079577619233ce1a79e7b 1100w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?w=1650&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=adfefc6c3f99060a79ec2b72f0ce2d65 1650w, https://mintcdn.com/reown-5552f0bb/Ro_EJGh7Rkd_L3Z5/images/test-exchange2.png?w=2500&fit=max&auto=format&n=Ro_EJGh7Rkd_L3Z5&q=85&s=4b0ac911b13a1e9e880f34579befa537 2500w" />

This setup allows you to safely verify both positive and negative exchange flows in a controlled environment.

## Hooks

All the pay with exchanges hooks must be imported from `@reown/appkit-pay/react`. For example:

```tsx  theme={null}
import { useAvailableExchanges } from '@reown/appkit-pay/react';
```

### useAvailableExchanges

Fetches and manages the state for available exchanges.

`useAvailableExchanges(options?: { isFetchOnInit?: boolean } & GetExchangesParams): UseAvailableExchangesReturn`

* `options`: Control initial fetch behavior.
* `returns`: `{ data, isLoading, error, fetch }`

`type GetExchangesParams= {
  page?: number
  asset?: string
  amount?: number | string
  network?: CaipNetworkId
}`

### usePayUrlActions

Provides functions (getUrl, openUrl) to interact with specific exchange URLs, returning the sessionId needed for status tracking.

`usePayUrlActions(): { getUrl, openUrl }`

* `getUrl(exchangeId, params): Promise<PayUrlResponse>`
* `openUrl(exchangeId, params, openInNewTab?): Promise<PayUrlResponse>` (Returns `{ url, sessionId }`)

### useExchangeBuyStatus

Fetches and polls for the status of a headless payment transaction using exchangeId and sessionId.

`useExchangeBuyStatus(params: UseExchangeBuyStatusParameters): UseExchangeBuyStatusReturn`

* `params`: `{ exchangeId, sessionId, pollingInterval?, isEnabled?, onSuccess?, onError? }`
* `returns`: `{ data, isLoading, error, refetch }`


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.reown.com/llms.txt