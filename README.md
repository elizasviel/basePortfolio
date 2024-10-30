# Base Token Swapper

A decentralized token swapping application built for Base network, powered by 0x Protocol. Enables seamless swaps between ETH and USDC with real-time price quotes and transaction history.

## Features

- 🔄 Swap between ETH and USDC on Base network
- 💰 Real-time price quotes from 0x Protocol
- 📊 Portfolio value tracking
- 📜 Transaction history with IndexedDB persistence
- 🎨 Clean, modern UI with custom design system

## Tech Stack

- React 18
- TypeScript
- Vite
- Viem for Ethereum interactions
- 0x Protocol for swap quotes
- IndexedDB for local storage
- CSS Modules for styling

## Prerequisites

- [Bun](https://bun.sh/) package manager
- Node.js 18+

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
bun i
```

3. Start the development server:

```bash
bun dev
```

The application will be available at `http://localhost:5173`

## Configuration

The application includes a demo configuration for testing:

- Burner wallet private key in `src/config/wallet.ts`
- 0x API key in `vite.config.ts`

## Architecture

- `/src/components` - React components organized by feature
- `/src/services` - Core business logic and external service integrations
- `/src/hooks` - Custom React hooks for state management
- `/src/types` - TypeScript type definitions
- `/src/styles` - Global styles and CSS modules
