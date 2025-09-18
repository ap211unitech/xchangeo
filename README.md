# Xchangeo

**Xchangeo** is a fully decentralized, EVM-compatible exchange built on the Automated Market Maker (AMM) model. It provides a seamless platform for ERC20 token swaps, liquidity provisioning, slippage protection and fee mechanism and real-time analytics powered by an on-chain indexer. This project demonstrates a complete end-to-end dApp architecture, from smart contracts to a modern, reactive frontend.

This project is modeled with a constant product market maker logic and designed to be fully EVM-compatible. It includes custom token faucets, an indexer built with The Graph, and a modern frontend for liquidity control and token tracking.

## Live Application
**Check out the live deployment:** [https://xchangeo.vercel.app/](https://xchangeo.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Smart Contracts](#smart-contracts)
- [Indexer](#indexer)
- [Contributing](#contributing)
- [Reach me out](#reach-me-out)

## Features


-   ⚖️ **Decentralized ERC20 Swaps:** Swap supported ERC20 tokens directly on-chain using the constant product formula ($x * y = k$).

-   💧 **Liquidity Pools & LP Tokens:** Add or remove liquidity to token pairs and receive LP (Liquidity Provider) tokens representing your share of the pool.

-   🛡️ **Slippage & Fee Handling:** Smart contract-enforced slippage protection and a transparent fee mechanism ensure fair and predictable trades.

-   📈 **Real-time Pool Analytics:** View live data such as token reserves, volume, and LP positions via an integrated Subgraph indexer.

-   🧩 **Modular & Upgradable Contracts:** A clean, modular contract architecture separating the factory, pools, and routing logic.

-   🧪 **Token Faucets:** Includes custom faucets to acquire test tokens for experimenting with the platform.

-   🌐 **Full Local Development Stack:** A Docker-based environment that replicates the entire production stack (Hardhat Node, Indexer, Frontend) for seamless offline development and testing.

## Tech Stack

- **Frontend:** Next.js, Server-Side fetching, Tailwind CSS, TypeScript, React Hook Form & Zod Validation, Reown Wallet Kit, Ethers.js etc
- **Backend:** Hardhat, Solidity (Smart Contracts)
- **Indexer:** TheGraph, GraphQL, Docker
- **Testing:** Thorough testing using Chai, TypeScript and Ethers.js for robust smart contract.
- **Blockchain:** Sepolia Testnet (Ethereum)
- **Tools:** Hardhat, Ethers.js

## Smart Contracts

The smart contracts for Xchangeo are written in Solidity and implement the core protocol logic, including token swaps, liquidity provisioning, LP token minting/burning, and fee distribution. Additional contracts support custom token faucets for testing. All contracts are deployed on the Sepolia Testnet, an Ethereum-compatible network.

## Indexer

Xchangeo uses **The Graph** to index key events and state changes on-chain:

- Token swaps
- Liquidity added/removed
- LP token supply changes
- Token reserves and pool states
- and much more

The indexed data can be queried through a GraphQL API used by the frontend for real-time updates.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request


## Local Development Setup

Follow these steps to set up and run the entire project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [pnpm](https://pnpm.io/installation)
-   [Docker](https://www.docker.com/get-started/) and Docker Compose


### 1. Clone the Repository

```bash
git clone https://github.com/ap211unitech/xchangeo
cd xchangeo
```

### 2. Install Dependencies
Install dependencies for all workspaces (root, client, hardhat).

### 3. Configure Environment Variables
The client application requires environment variables. Create a `.env.local` file inside the `/client` directory.

```
NEXT_PUBLIC_REOWN_PROJECT_ID=
NEXT_PUBLIC_GRAPHQL_API_ENDPOINT=
NEXT_PUBLIC_RPC_URL=
```

### 4. Run the Local Stack

```bash
cd hardhat
npx hardhat test # run all unit and integration tests
npx hardhat compile # compiles all Solidity contracts and generates artifacts (ABI, bytecode, metadata)
npx hardhat node # keep this running
npx hardhat ignition deploy ./ignition/modules/index.ts --network localhost
```

```bash
cd indexer
pnpm clean
pnpm ready
pnpm docker:start # keep this running
pnpm create-local && pnpm deploy-local
```

```bash
cd client
pnpm dev
```

> You should now have:
>
> The frontend running at http://localhost:3000
>
> The local Hardhat node at http://localhost:8545
>
> The indexer's GraphQL endpoint at http://localhost:8000/subgraphs/name/indexer

## Reach me out

Arjun Porwal - porwalarjun95@gmail.com

[LinkedIn](https://www.linkedin.com/in/arjun-porwal-9198b71a3/) | [Portfolio](https://arjunporwal.vercel.app/)