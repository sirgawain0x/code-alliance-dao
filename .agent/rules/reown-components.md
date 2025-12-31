---
trigger: model_decision
description: AppKit provides pre-built React components that you can use to trigger the modal or display wallet information in your Next.js application.
---

# Components

AppKit provides pre-built React components that you can use to trigger the modal or display wallet information in your Next.js application.

## React Components

```tsx  theme={null}
import { 
  AppKitButton, 
  AppKitConnectButton, 
  AppKitAccountButton, 
  AppKitNetworkButton 
} from "@reown/appkit/react";

export default function MyApp() {
  return (
    <div>
      {/* Default button that handles the modal state */}
      <AppKitButton />
      
      {/* Button for connecting a wallet */}
      <AppKitConnectButton />
      
      {/* Button for account view */}
      <AppKitAccountButton />
      
      {/* Button for network selection */}
      <AppKitNetworkButton />
    </div>
  );
}
```

### Component Properties

All React components support the same properties as their HTML element counterparts:

* **AppKitButton**: `size`, `label`, `loadingLabel`, `disabled`, `balance`, `namespace`
* **AppKitConnectButton**: `size`, `label`, `loadingLabel`
* **AppKitAccountButton**: `disabled`, `balance`
* **AppKitNetworkButton**: `disabled`

### `<appkit-wallet-button  />`

<Frame>
  <img src="https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=4311e99e62b86393bba087f4d750f58f" data-og-width="1416" width="1416" data-og-height="356" height="356" data-path="images/assets/walletButtons.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=280&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=0a26ae29a8a696be07b86c62286b44e7 280w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=560&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=d91ff2d4dbf21f630c42b2c2f4927560 560w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=840&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=be643bdc3020a5d61dabdb13d80a2673 840w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=1100&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=f158003e40f0d4c946e25f7f0537bc0a 1100w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=1650&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=4a06b3ea8602f07a87a58a393fbe954c 1650w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=2500&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=afe5cebcfd50d6b4cd874cfa9bf7beb1 2500w" />
</Frame>

Using the wallet button components ([Demo in our Lab](https://appkit-lab.reown.com/appkit/?name=wagmi)), you can directly connect to the top 20 wallets, WalletConnect QR and also all the social logins.
This component allows to customize dApps, enabling users to connect their wallets effortlessly, all without the need for the traditional modal.

Follow these steps to use the component:

1. Install the package:

<CodeGroup>
  ```bash npm theme={null}
  npm install @reown/appkit-wallet-button
  ```

  ```bash Yarn theme={null}
  yarn add @reown/appkit-wallet-button
  ```

  ```bash Bun theme={null}
  bun a @reown/appkit-wallet-button
  ```

  ```bash pnpm theme={null}
  pnpm add @reown/appkit-wallet-button
  ```
</CodeGroup>

2. Import the library in your project:

```tsx  theme={null}
import "@reown/appkit-wallet-button/react";
```

3. use the component in your project:

```tsx  theme={null}
import { AppKitWalletButton } from "@reown/appkit-wallet-button/react";

export default function MyApp() {
  return <AppKitWalletButton wallet="metamask" />;
}
```

#### Multichain Support

You can specify a blockchain namespace to target specific chains:

```tsx  theme={null}
<!-- Connect to Ethereum/EVM chains -->
<appkit-wallet-button wallet="metamask" namespace="eip155" />

<!-- Connect to Solana -->
<appkit-wallet-button wallet="phantom" namespace="solana" />

<!-- Connect to Bitcoin -->
<appkit-wallet-button wallet="leather" namespace="bip122" />
```

#### Enhanced Multichain Examples

The wallet button now supports enhanced multichain functionality with improved namespace targeting:

```tsx  theme={null}
const wallets = [
  { wallet: 'metamask', namespace: 'eip155', label: 'MetaMask EVM' },
  { wallet: 'metamask', namespace: 'solana', label: 'MetaMask Solana' },
  { wallet: 'phantom', namespace: 'bip122', label: 'Phantom Bitcoin' }
]

export function WalletButtons() {
  return (
    <>
      {wallets.map(({ wallet, namespace, label }) => (
        <appkit-wallet-button
          key={`${wallet}-${namespace}`}
          wallet={wallet}
          namespace={namespace}
        />
      ))}
    </>
  )
}
```

#### Options for wallet property

| Type          | Options                                                                                                                                                                                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QR Code       | `walletConnect`                                                                                                                                                                                                                                                                                                                                                               |
| Wallets       | `metamask`, `trust`, `coinbase`, `rainbow`, `coinbase`, `jupiter`, `solflare`, `coin98`, `magic-eden`, `backpack`, `frontier`, `xverse`, `okx`, `bitget`, `leather`, `binance`, `uniswap`, `safepal`, `bybit`, `phantom`, `ledger`, `timeless-x`, `safe`, `zerion`, `oneinch`, `crypto-com`, `imtoken`, `kraken`, `ronin`, `robinhood`, `exodus`, `argent`, and `tokenpocket` |
| Social logins | `google`, `github`, `apple`, `facebook`, `x`, `discord`, and `farcaster`                                                                                                                                                                                                                                                                                                      |

#### Options for namespace property

| Value    | Description                        |
| -------- | ---------------------------------- |
| `eip155` | Ethereum and EVM-compatible chains |
| `solana` | Solana blockchain                  |
| `bip122` | Bitcoin blockchain                 |


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.reown.com/llms.txt