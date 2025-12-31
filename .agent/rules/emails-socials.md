---
trigger: model_decision
description: To allow users to authenticate using their email or social accounts, you need to configure the features parameter in the createAppKit function.
---

# Email & Socials

To allow users to authenticate using their email or social accounts, you need to configure the `features` parameter in the `createAppKit` function.

<Tabs>
  <Tab title="Wagmi">
    ```ts {6-20} theme={null}
    const modal = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [mainnet, arbitrum],
      metadata,
      features: {
        email: true, // default to true
        socials: [
          "google",
          "x",
          "github",
          "discord",
          "apple",
          "facebook",
          "farcaster",
        ],
        emailShowWallets: true, // default to true
      },
      allWallets: "SHOW", // default to SHOW
    });
    ```
  </Tab>

  <Tab title="Ethers">
    ```ts {6-20} theme={null}
    const modal = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [mainnet, arbitrum],
      metadata,
      features: {
        email: true, // default to true
        socials: [
          "google",
          "x",
          "github",
          "discord",
          "apple",
          "facebook",
          "farcaster",
        ],
        emailShowWallets: true, // default to true
      },
      allWallets: "SHOW", // default to SHOW
    });
    ```

    <Note>
      AppKit with ethers v5 does not support the `auth` parameter and social logins. If you're using ethers v5, please consider upgrading to ethers v6 following this [ethers migration guide](https://docs.ethers.org/v6/migrating/) and [AppKit Docs](https://docs.walletconnect.com/appkit/overview)
    </Note>
  </Tab>

  <Tab title="Solana">
    ```ts {6-20} theme={null}
    const modal = createAppKit({
      adapters: [solanaWeb3JsAdapter],
      projectId,
      networks: [solana, solanaTestnet, solanaDevnet],
      metadata,
      features: {
        email: true, // default to true
        socials: [
          "google",
          "x",
          "discord",
          "farcaster",
          "github",
          "apple",
          "facebook",
        ],
        emailShowWallets: true, // default to true
      },
      allWallets: "SHOW", // default to SHOW
    });
    ```
  </Tab>
</Tabs>

## Options

* ***email \[boolean]*** : This boolean defines whether you want to enable email login. Default `true`
* ***socials \[array]*** : This array contains the list of social platforms that you want to enable for user authentication. The platforms in the example include Google, X, GitHub, Discord, Apple, Facebook and Farcaster. The default value of `undefined` displays everything. Set it to `false` to disable this feature. You can also pass an empty array to disable it.
* ***emailShowWallets \[boolean]*** : This boolean defines whether you want to show the wallet options on the first connect screen. If this is false and `socials` are enabled, it will show a button that directs you to a new screen displaying the wallet options. Default `true`

## User flow

1. Users will be able to connect to you application by simply using an email address. AppKit will send to them a One Time Password (OTP) to copy and paste in the modal, which will help to
   verify the user's authenticity. This will create a non-custodial wallet for your user which will be available in any application that integrates AppKit and email login.

2. Eventually the user can optionally choose to move from a non-custodial wallet to a self-custodial one by pressing "Upgrade Wallet" on AppKit.
   This will open the *([WalletConnect secure website](https://secure.walletconnect.com/dashboard))* that will walk your user through the upgrading process.

## UI Variants

AppKit SDK offers multiple UI variants to customize the user experience for the authentication process.

By configuring the `emailShowWallets` option in the `features` parameter, you can control the initial connect screen behavior:

* **`emailShowWallets: true`**: When this option is enabled, the initial connect screen will display the available wallet options directly to the user. This allows users to choose their preferred wallet immediately.

<Frame>
  <img height="400" width="300" src="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=fd9e1d3822a2842c430f972171d4ea72" data-og-width="736" data-og-height="1342" data-path="images/w3m/auth/modal_wallets.webp" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=280&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=5a1fe0c32c7f55f3e641ea5e5955027c 280w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=560&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=61c4ad220dd7aa7aa6cc0bd64d08c106 560w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=840&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=ce26e296f6e687a15e4733b529208f98 840w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=1100&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=7ccb37678a3705fcb12757c7fe407910 1100w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=1650&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=212fc6491e3a1b4e4695e26e3bd80ae7 1650w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=2500&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=2e0b45cc5a158d991a2d152310e4992e 2500w" />
</Frame>

* **`emailShowWallets: false`**: If this option is disabled, the initial connect screen will show a button instead. When the user clicks this button, they will be directed to a new screen that lists all the available wallet options. This can help simplify the initial interface and reduce visual clutter.

<Frame>
  <img height="400" width="300" src="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=0563720f6e4317cc3d36c0431ea6d0f1" data-og-width="726" data-og-height="838" data-path="images/w3m/auth/modal_no_wallets.webp" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?w=280&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=5b6cdcd6149f1b8adc6c8ebbe1449386 280w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?w=560&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=8530cd15fefc590f269944a293103c57 560w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?w=840&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=df3202b5a9c64075935dca3aa9ed5c7f 840w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?w=1100&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=3c1f3192af3c251f1a42d7d4b5e39b6b 1100w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?w=1650&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=1ecac5cc0ed3b24b4cd19212e51c7bc2 1650w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_no_wallets.webp?w=2500&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=834cbb5f36c792013f67834d85e4cf9c 2500w" />
</Frame>

By configuring the `socials` option in the `features` parameter, you can control the amount of social providers you want to show on the connect screen:

* **`socials: ['google']`**: When you only set one social provider, it will give you a button with \`connect with provider.

<Frame>
  <img height="400" width="300" src="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=5b96b3142095bf68771f5a61c62d7951" data-og-width="726" data-og-height="1246" data-path="images/w3m/auth/modal_one_social.webp" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?w=280&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=d661563855136a2b84bdcc8c6da0dc2a 280w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?w=560&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=8c852c5abfd666ac2e585861a610eabd 560w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?w=840&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=f8e8f0d94f0c894940d422d4967d5a9c 840w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?w=1100&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=c117d711ebc62a78bf38f7cddbfb8200 1100w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?w=1650&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=c516b99449e0909a26b865e4d9edf1c0 1650w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_one_social.webp?w=2500&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=a80dc28cf6e290c395f0a03ae1109705 2500w" />
</Frame>

* **`socials: ['google', 'discord']`**: When you set 2 social provider, it will give you 2 buttons next to each other with the logo of the social provider

<Frame>
  <img height="400" width="300" src="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=2e93617d52f6fc024280279089b83f2b" data-og-width="738" data-og-height="1254" data-path="images/w3m/auth/modal_two_social.webp" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?w=280&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=b2ad40befccea362047de5d3771dbc59 280w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?w=560&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=d910b7ff903661d201f1e468728c5bf4 560w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?w=840&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=282fd01b3d184e34a9e3699665ea47cb 840w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?w=1100&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=867617250b24909aaf5456b739dfcd6e 1100w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?w=1650&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=86824adfc07225fbf1223ae77b7c4f37 1650w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_two_social.webp?w=2500&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=8988d95814ef665714d10a9c65e5e076 2500w" />
</Frame>

* **` socials: ['google', 'x', 'discord', 'apple', 'github']`**: When you set more than 2 social providers, the first provider in the array will get a button with `connect with provider`. The other providers will get a button with the logo of the social provider next to each other.

<Frame>
  <img height="400" width="300" src="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=fd9e1d3822a2842c430f972171d4ea72" data-og-width="736" data-og-height="1342" data-path="images/w3m/auth/modal_wallets.webp" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=280&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=5a1fe0c32c7f55f3e641ea5e5955027c 280w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=560&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=61c4ad220dd7aa7aa6cc0bd64d08c106 560w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=840&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=ce26e296f6e687a15e4733b529208f98 840w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/images/w3m/auth/modal_wallets.webp?w=1100&fit=max&auto=format&n=pFjT1B7UtTo7EOJK&q=85&s=7ccb37678a3705fcb12757c7fe407910 1100w, https://mintcdn.com/reown-5552f0bb/pFjT1B7UtTo7EOJK/image