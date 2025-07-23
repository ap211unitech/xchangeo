# Xchangeo

**Xchangeo** is a fully decentralized AMM-based exchange supporting seamless ERC20 token swaps, liquidity pools, and LP token minting/burning with a constant product formula, slippage protection and fee mechanism with and real-time analytics via an on-chain indexer.

This project is modeled with a constant product market maker logic and designed to be fully EVM-compatible. It includes custom token faucets, an indexer built with The Graph, and a modern frontend for liquidity control and token tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Smart Contracts](#smart-contracts)
- [Contributing](#contributing)

## Features

- ⚖️ **Decentralized ERC20 Token Swaps**  
  Swap any supported ERC20 tokens directly on-chain using a constant product AMM formula.

- 💧 **Liquidity Pools & LP Tokens**  
  Add or remove liquidity from token pairs and receive LP tokens representing your share of the pool.

- 🔄 **Fee & Slippage Handling**  
  Smart contract-enforced slippage controls and fee mechanisms to ensure fair trades.

- 🧪 **Token Faucets**  
  Receive test tokens from the respective faucets to test the app.

- 📈 **Real-time Pool Analytics**  
  View live data like token reserves, prices, and LP positions via an integrated indexer powered by The Graph.

- 🧩 **Modular Contracts**  
  Clearly separated contracts for factory, pools, tokens, and utility logic.

- 🧪 **Full Local Development Stack**  
  Supports local node + The Graph + UI for full offline development and testing.

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

## See Live

https://xchangeo.vercel.app/

## Reach me out

porwalarjun95@gmail.com ([LinkedIn](https://www.linkedin.com/in/arjun-porwal-9198b71a3/))

## Run Indexer locally

npx hardhat ignition deploy ./ignition/modules/index.ts --network localhost

pnpm clean
pnpm ready
pnpm docker:start
pnpm create-local && pnpm deploy-local

```

```
