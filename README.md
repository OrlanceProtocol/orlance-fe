# Orlance - Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Network](https://img.shields.io/badge/Network-Arbitrum%20Sepolia-2d374b)

Modern frontend dashboard for the Orlance fixed-yield ecosystem.

## Key Features

### Pools

- Multi-maturity pools (1M / 2M / 3M)
- Deposit, mint, swap, pool, redeem, and withdraw flows
- On-chain TVL per maturity (from TPS supply)
- APR metrics derived from AMM reserves and swap activity

### Auto-Roller Vault

- OAS-based auto-roll strategy
- On-chain next roll-over countdown
- Deposit/withdraw UX with allowance handling

### No-Loss Yield Lottery

- stETH deposit with on-chain round data
- Live participant and prize pool estimation
- Winner history from on-chain `WinnerDrawn` events

### Dashboard Experience

- Unified pools summary with explorer-aware metrics
- Wallet + faucet flow for testnet onboarding (`0.1 stETH` claim)
- Etherscan-compatible tx history integration

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Arbitrum Sepolia wallet for testing

### Installation

```bash
# From workspace root
cd orlance-fe

# Install dependencies
npm install

# Create local env
cp .env.example .env
```

Windows PowerShell:

```powershell
cd "orlance-fe"
npm install
Copy-Item .env.example .env
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

## Environment Configuration

Edit `.env` and provide values for:

```bash
# Network
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_EXPLORER_BASE_URL=https://sepolia.arbiscan.io
NEXT_PUBLIC_EXPLORER_API_URL=https://api.etherscan.io/v2/api
NEXT_PUBLIC_ETHERSCAN_API_KEY=YOUR_ARBISCAN_API_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID

# Core contracts
NEXT_PUBLIC_ORLANCE_MOCK_LIDO=0x...
NEXT_PUBLIC_ORLANCE_VAULT=0x...
NEXT_PUBLIC_ORLANCE_ROUTER=0x...
NEXT_PUBLIC_ORLANCE_AUTO_ROLLER=0x...
NEXT_PUBLIC_ORLANCE_LOTTERY=0x...

# Pool 1..3
NEXT_PUBLIC_ORLANCE_POOL_NAME_1=Orlance stETH 1M
NEXT_PUBLIC_ORLANCE_POOL_NAME_2=Orlance stETH 2M
NEXT_PUBLIC_ORLANCE_POOL_NAME_3=Orlance stETH 3M
NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP_1=...
NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP_2=...
NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP_3=...
NEXT_PUBLIC_ORLANCE_TPS_1=0x...
NEXT_PUBLIC_ORLANCE_TPS_2=0x...
NEXT_PUBLIC_ORLANCE_TPS_3=0x...
NEXT_PUBLIC_ORLANCE_TYS_1=0x...
NEXT_PUBLIC_ORLANCE_TYS_2=0x...
NEXT_PUBLIC_ORLANCE_TYS_3=0x...
NEXT_PUBLIC_ORLANCE_SIMPLE_AMM_1=0x...
NEXT_PUBLIC_ORLANCE_SIMPLE_AMM_2=0x...
NEXT_PUBLIC_ORLANCE_SIMPLE_AMM_3=0x...
```

Legacy fallback keys are still supported (`NEXT_PUBLIC_ORLANCE_TPS`, `NEXT_PUBLIC_ORLANCE_TYS`, etc.).

## Data and Calculations

- Pools TVL: derived from on-chain TPS supply per maturity.
- Fixed APR: derived from on-chain TPS/stETH AMM price.
- LP APR: derived from on-chain AMM swap volume and 24h fee estimate.
- Vault roll-over: uses on-chain `autoRoller.nextRollOver()`.
- Lottery rounds: uses on-chain `currentRoundId`, `rounds`, `activeMaturity`.

## Project Structure

```text
orlance-fe/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── pool/[id]/page.tsx
│   │   │   ├── vault/page.tsx
│   │   │   └── lottery/page.tsx
│   ├── hooks/
│   │   ├── useOrlancePoolData.ts
│   │   ├── useAutoRollerVault.ts
│   │   ├── useNoLossLottery.ts
│   │   └── useExplorerTxHistory.ts
│   ├── lib/orlance/contracts.ts
│   └── data/pools.ts
├── public/
├── .env.example
└── README.md
```

## Deployment Notes

### Vercel

- Deploy as a standard Next.js app.
- Add all `NEXT_PUBLIC_*` env vars in the project settings.
- Redeploy after updating contract addresses.

### VPS / Self-hosted

```bash
npm install
npm run build
npm start
```

Use Nginx/Caddy as reverse proxy if needed.

## Post-Deploy SC Sync

After running `FullDeploy` in `orlance-sc`:

1. Copy new addresses + maturities into `orlance-fe/.env`.
2. Optionally update `orlance-fe/.env.example` reference values.
3. Restart FE server (`npm run dev` or `npm start`).

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm start
```
