---
name: cloud-codebase-runbook
description: Use when a Cloud agent needs to install, run, log in to, or test this Next.js DAO dashboard.
---

# Cloud codebase runbook

Use this skill first when you need a practical path from a fresh Cloud agent checkout to a running, testable app.

## Whole app setup

- Use `pnpm`; the repo declares `packageManager: pnpm@10.27.0`.
- Install dependencies with `pnpm install --frozen-lockfile`.
- Create `.env.local` when runtime data is needed:
  - `DATABASE_URL`: required by `lib/db.ts` as soon as server actions import the database client.
  - `NEXT_PUBLIC_TARGET_DAO_ADDRESS`: Base DAO address used by DAO overview, proposals, voting, treasury, and sidebar components.
  - `NEXT_PUBLIC_GRAPH_KEY`: optional DAO hooks Graph API key. Leave blank for UI-only work, but expect empty/error states on live DAO queries.
  - `NEXT_PUBLIC_SEQUENCE_KEY`: optional Sequence API key for token balances.
  - `NEXT_PUBLIC_REOWN_PROJECT_ID` or `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: optional AppKit project id. A fallback id exists for local smoke tests.
- Start the app with `pnpm dev` and open `http://localhost:3000`.
- For production parity, run `pnpm build` and then `pnpm start`.
- There is no committed automated test runner yet. Use `pnpm lint`, `pnpm build`, and targeted manual checks as the baseline.

## App shell and dashboard pages

Areas: `app/page.tsx`, `app/layout.tsx`, `components/sidebar*.tsx`, `components/dashboard-header.tsx`, overview cards, project/subdao/governance pages.

Testing workflow:

1. Start `pnpm dev`.
2. Visit `/`, `/projects`, `/subdaos`, `/governance`, `/treasury`, and `/parent-dao`.
3. Confirm the sidebar works on desktop and mobile widths.
4. Confirm loading, empty, and populated states for DAO data. If keys are missing, verify the page still renders useful fallback UI instead of crashing.
5. Run `pnpm build` before finishing changes that affect routes, layout, imports, or provider setup.

## DAO data and treasury hooks

Areas: `hooks/useDao*.ts`, `hooks/useProposals.ts`, `hooks/useSubDAOStats.ts`, `components/chain-governance.tsx`, treasury/proposal components, `utils/endpoints.ts`.

Testing workflow:

1. Set `NEXT_PUBLIC_TARGET_DAO_ADDRESS` to a known Base DAO address.
2. Add `NEXT_PUBLIC_GRAPH_KEY` and `NEXT_PUBLIC_SEQUENCE_KEY` when validating live Graph or token-balance behavior.
3. Start `pnpm dev` and open pages that consume the changed hook.
4. Watch browser console and terminal logs for failed requests, missing env values, and React Query errors.
5. Test the no-key path by temporarily omitting public keys from `.env.local`; UI should render loading, empty, or friendly error states.

## Members and server actions

Areas: `app/actions.ts`, `lib/db.ts`, `lib/schema.sql`, `app/members/page.tsx`, `components/member-grid.tsx`, `components/members-overview.tsx`, `components/role-management.tsx`.

Testing workflow:

1. Provide `DATABASE_URL`; without it, database imports throw during server rendering.
2. If using a fresh database, apply `lib/schema.sql` before starting the app.
3. Start `pnpm dev` and visit `/members`.
4. Exercise filters, role/status views, and search if the touched component includes them.
5. For UI-only work where a live database is unavailable, avoid `/members` as proof and validate the changed component in another route or with a temporary local mock that is removed before committing.

## Wallet, onramp, and swap flows

Areas: `contexts/AppKitProvider.tsx`, `components/appkit-wrapper.tsx`, `components/buy-crtv.tsx`, `lib/wallet-utils.ts`, `config/constants.ts`.

Testing workflow:

1. Set `NEXT_PUBLIC_REOWN_PROJECT_ID` if testing real wallet login. The built-in fallback is acceptable for layout smoke tests only.
2. Start `pnpm dev` and open `/buy`.
3. Click the AppKit connect button and verify login options render.
4. Connect a browser wallet or social/email option when validating authenticated behavior.
5. Test Base, Polygon, and Optimism paths when touching token, pool, CCIP, onramp, or swap constants.
6. To reset a sticky wallet session, clear local storage keys that start with `wc@`, `@w3m`, `@appkit`, `wagmi`, or contain `walletconnect`, then reload.

## Feature flags and mocks

- There is no central feature-flag service in this repo today.
- AppKit features are configured directly in `contexts/AppKitProvider.tsx` under `features` (`analytics`, `email`, `socials`, `onramp`, `swaps`).
- For Cloud testing, prefer environment-driven setup and browser mocks over committed code changes.
- If you must mock network, wallet, or database behavior to reproduce a bug, keep the mock local and remove it before committing unless the task explicitly asks for test infrastructure.

## Update this skill

When you discover a reliable testing trick, setup requirement, flaky command, seeded account, or required env var:

1. Add it to the section for the codebase area it affects.
2. Include the exact command, route, env var, or browser action.
3. Note whether the workflow needs real credentials, can use mocks, or is safe for smoke tests.
4. Keep entries short and practical; this file should stay useful during the first few minutes of a Cloud task.
