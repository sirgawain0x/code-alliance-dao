---
trigger: model_decision
description: AppKit provides a simple solution for integrating with “Sign In With Ethereum” (SIWE), a new form of authentication that enables users to control their digital identity with their Ethereum account.
---

# Sign In With Ethereum

AppKit provides a simple solution for integrating with "Sign In With Ethereum" (SIWE), a new form of authentication that enables users to control their digital identity with their Ethereum account.
SIWE is a standard also known as [EIP-4361](https://docs.login.xyz/general-information/siwe-overview/eip-4361).

<Warning>
  **SIWE is being migrated to SIWX.** We recommend using [SIWX (Sign In With X)](/appkit/authentication/siwx/default) for new implementations as it provides multichain authentication support. For existing SIWE implementations, see the [migration guide](/appkit/authentication/siwx/default#migrating-from-siwe-to-siwx).
</Warning>

## One-Click Auth

**One-Click Auth** represents a key advancement within WalletConnect v2, streamlining the user authentication process in AppKit by enabling them to seamlessly connect with a wallet and sign a SIWE message with just one click.
It supports both [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271), the standard for signature validation in smart accounts, and [EIP-6492](https://eips.ethereum.org/EIPS/eip-6492), which enables signature validation for smart accounts (contracts) that are not yet deployed, allowing messages to be signed without requiring prior deployment.

Connecting a wallet, proving control of an address with an off-chain signature, authorizing specific actions. These are the kinds of authorizations that can be encoded as ["ReCaps"](https://eips.ethereum.org/EIPS/eip-5573). ReCaps are permissions for a specific website or dapp that can be compactly encoded as a long string in the message you sign and translated by any wallet into a straight-forward one-sentence summary.
WalletConnect uses permissions expressed as ReCaps to enable a One-Click Authentication.

## NextAuth

[NextAuth](https://next-auth.js.org/) is a complete open-source authentication solution for Next.js applications.
It is designed from the ground up to support Next.js and Serverless. We can use NextAuth with SIWE to handle users authentication and sessions.

## Installation

<Tabs>
  <Tab title="One-Click Auth">
    <CodeGroup>
      ```bash npm theme={null}
      npm install @reown/appkit-siwe next-auth
      ```

      ```bash Yarn theme={null}
      yarn add @reown/appkit-siwe next-auth
      ```

      ```bash Bun theme={null}
      bun a @reown/appkit-siwe next-auth
      ```

      ```bash pnpm theme={null}
      pnpm add @reown/appkit-siwe next-auth
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Legacy">
    <Warning>For a better UX we recommend using One-Click Auth.</Warning>

    Install the AppKit SIWE package, additionally we also recommend installing [siwe](https://docs.login.xyz/) which will abstract a lot of the required logic.

    <CodeGroup>
      ```bash npm theme={null}
      npm install @reown/appkit-siwe siwe next-auth viem
      ```

      ```bash Yarn theme={null}
      yarn add @reown/appkit-siwe siwe next-auth viem
      ```

      ```bash Bun theme={null}
      bun a @reown/appkit-siwe siwe next-auth viem
      ```

      ```bash pnpm theme={null}
      pnpm add @reown/appkit-siwe siwe next-auth viem
      ```
    </CodeGroup>
  </Tab>
</Tabs>

## Configure your SIWE Client

<Card title="Next.js SIWE Example" icon="github" href="https://github.com/reown-com/appkit-web-examples/tree/main/nextjs/next-siwe-next-auth">
  Check the Next.js example using NextAuth
</Card>

<Tabs>
  <Tab title="One-Click Auth">
    ```ts  theme={null}
    import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
    import type {
      SIWEVerifyMessageArgs,
      SIWECreateMessageArgs,
      SIWESession,
    } from "@reown/appkit-siwe";
    import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
    import { mainnet, sepolia } from "@reown/appkit/networks";

    export const siweConfig = createSIWEConfig({
      getMessageParams: async () => ({
        domain: typeof window !== "undefined" ? window.location.host : "",
        uri: typeof window !== "undefined" ? window.location.origin : "",
        chains: [mainnet.id, sepolia.id],
        statement: "Please sign with your account",
      }),
      createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
        formatMessage(args, address),
      getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) {
          throw new Error("Failed to get nonce!");
        }

        return nonce;
      },
      getSession: async () => {
        const session = await getSession();
        if (!session) {
          return null;
        }

        // Validate address and chainId types
        if (
          typeof session.address !== "string" ||
          typeof session.chainId !== "number"
        ) {
          return null;
        }

        return {
          address: session.address,
          chainId: session.chainId,
        } satisfies SIWESession;
      },
      verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
        try {
          const success = await signIn("credentials", {
            message,
            redirect: false,
            signature,
            callbackUrl: "/protected",
          });

          return Boolean(success?.ok);
        } catch (error) {
          return false;
        }
      },
      signOut: async () => {
        try {
          await signOut({
            redirect: false,
          });

          return true;
        } catch (error) {
          return false;
        }
      },
    });
    ```

    ### `verifySignature`

    Verify a SIWE signature.

    ```ts  theme={null}
    import { createPublicClient, http } from "viem";

    const publicClient = createPublicClient({
      transport: http(
        `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`
      ),
    });
    const isValid = await publicClient.verifyMessage({
      message,
      address: address as `0x${string}`,
      signature: signature as `0x${string}`,
    });

    // The verifySignature is not working with social logins and emails with non deployed smart accounts
    // for this reason we recommend using the viem to verify the signature
    // import { verifySignature } from '@reown/appkit-siwe'
    // const isValid = await verifySignature({ address, message, signature, chainId, projectId })
    ```

    ### `getChainIdFromMessage`

    Get the chain ID from the SIWE message.

    ```ts  theme={null}
    import { getChainIdFromMessage } from "@reown/appkit-siwe";

    const chainId = getChainIdFromMessage(message);
    ```

    ### `getAddressFromMessage`

    Get the address from the SIWE message.

    ```ts  theme={null}
    import { getAddressFromMessage } from "@reown/appkit-siwe";

    const address = getAddressFromMessage(message);
    ```
  </Tab>

  <Tab title="Legacy">
    With help of the [siwe package](https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/implement-the-frontend) we will create the required configuration for AppKit.

    <Info>
      The nonce and verification process will be implemented in your backend. [Read
      more.](https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/implement-the-backend)
    </Info>

    Let's create a file to instantiate our SIWE configuration. For this example we will use `config/siwe.ts`

    ```ts  theme={null}
    import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";

    import { SiweMessage } from "siwe";

    import type {
      SIWEVerifyMessageArgs,
      SIWECreateMessageArgs,
    } from "@reown/appkit-siwe";
    import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";

    export const siweConfig = createSIWEConfig({
      createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
        new SiweMessage({
          version: "1",
          domain: window.location.host,
          uri: window.location.origin,
          address,
          chainId,
          nonce,
          // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
          statement: "Sign in With Ethereum.",
        }).prepareMessage(),
      getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) {
          throw new Error("Failed to get nonce!");
        }

        return nonce;
      },
      getSession,
      verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
        try {
          const success = await signIn("credentials", {
            message,
            redirect: false,
            signature,
            callbackUrl: "/protected",
          });

          return Boolean(success?.ok);
        } catch (error) {
          return false;
        }
      },
      signOut: async () => {
        try {
          await signOut({
            redirect: false,
          });

          return true;
        } catch (error) {
          return false;
        }
      },
    });
    ```
  </Tab>
</Tabs>

## Set up your API route

Add `NEXTAUTH_SECRET` as an environment variable, it will be used to encrypt and decrypt user sessions. [Learn more.](https://next-auth.js.org/configuration/options#nextauth_secret)

Create your API route at `app/api/auth/[...nextauth]/route.ts`.

<Tabs>
  <Tab title="One-Click Auth">
    ```ts  theme={null}
    import NextAuth from "next-auth";
    import credentialsProvider from "next-auth/providers/credentials";
    import {
      type SIWESession,
      verifySignature,
      getChainIdFromMessage,
      getAddressFromMessage,
    } from "@reown/appkit-siwe";

    declare module "next-auth" {
      interface Session extends SIWESession {
        address: string;
        chainId: number;
      }
    }

    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (!nextAuthSecret) {
      throw new Error("NEXTAUTH_SECRET is not set");
    }

    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
    if (!projectId) {
      throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
    }

    const providers = [
      credentialsProvider({
        name: "Ethereum",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials) {
          try {
            if (!credentials?.message) {
              throw new Error("SiweMessage is undefined");
            }
            const { message, signature } = credentials;
            const address = getAddressFromMessage(message);
            const chainId = getChainIdFromMessage(message);

            const isValid = await verifySignature({
              address,
              message,
              signature,
              chainId,
              projectId,
            });

            if (isValid) {
              return {
                id: `${chainId}:${address}`,
              };
            }

            return null;
          } catch (e) {
            return null;
          }
        },
      }),
    ];

    const handler = NextAuth({
      // https://next-auth.js.org/configuration/providers/oauth
      secret: nextAuthSecret,
      providers,
      session: {
        strategy: "jwt",
      },
      callbacks: {
        session({ session, token }) {
          if (!token.sub) {
            return session;
          }

          const [, chainId, address] = token.sub.split(":");
          if (chainId && address) {
            session.address = address;
            session.chainId = parseInt(chainId, 10);
          }

          return session;
        },
      },
    });

    export { handler as GET, handler as POST };
    ```
  </Tab>

  <Tab title="Legacy">
    ```ts  theme={null}
    import { NextAuthOptions } from "next-auth";
    import credentialsProvider from "next-auth/providers/credentials";
    import { getCsrfToken } from "next-aut