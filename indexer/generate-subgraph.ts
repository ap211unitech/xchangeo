import fs from "fs";

import { TOKENS, FAUCETS, POOLS } from "./contracts";

type Contract = { address: string; startBlock: number };

const header = (dataSources: string) => `
specVersion: 1.2.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:${dataSources}
`;

const tokenDataSourceTemplate = (token: Contract, index: number) => `
  - kind: ethereum
    name: ERC20Token${index === 0 ? "" : "-" + token.address}
    network: sepolia
    source:
      address: "${token.address}"
      abi: ERC20Token
      startBlock: ${token.startBlock}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - Transfer
      abis:
        - name: ERC20Token
          file: ./abis/ERC20Token.json
      eventHandlers:
        - event: ERC20TokenCreated(indexed address,string,string)
          handler: handleERC20TokenCreated
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
      file: ./src/erc-20-token.ts
`;

const faucetDataSourceTemplate = (faucet: Contract, index: number) => `
  - kind: ethereum
    name: Faucet${index === 0 ? "" : "-" + faucet.address}
    network: sepolia
    source:
      address: "${faucet.address}"
      abi: Faucet
      startBlock: ${faucet.startBlock}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - Faucet
      abis:
        - name: Faucet
          file: ./abis/Faucet.json
      eventHandlers:
        - event: Faucet__Created(indexed address,indexed address,uint256,uint256,uint256)
          handler: handleFaucetCreated
        - event: Faucet__ReceivedFunds(indexed address,indexed address,indexed uint256,uint256)
          handler: handleFaucetRequestedFunds
      file: ./src/faucet.ts
`;

const liquidityPoolsDataSourceTemplate = (pool: Contract, index: number) => `
  - kind: ethereum
    name: ERC20SwapPool${index === 0 ? "" : "-" + pool.address}
    network: sepolia
    source:
      address: "${pool.address}"
      abi: ERC20SwapPool
      startBlock: ${pool.startBlock}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - Pool
      abis:
        - name: ERC20SwapPool
          file: ./abis/ERC20SwapPool.json
      eventHandlers:
        - event: PoolCreated(indexed address,indexed address,indexed address,address,string,string,uint256)
          handler: handlePoolCreated
        - event: LiquidityAdded(indexed address,indexed address,indexed address,uint256,uint256,uint256,uint256,uint256,uint256,address)
          handler: handleLiquidityAdded
        - event: LiquidityRemoved(indexed address,indexed address,indexed address,uint256,uint256,uint256,uint256,uint256,uint256,address)
          handler: handleLiquidityRemoved
        - event: TokenSwapped(address,indexed address,indexed address,uint256,uint256,uint256,uint256,uint256,indexed address)
          handler: handleTokenSwapped
      file: ./src/erc20-swap-pool.ts
`;

const tokenDataSources = TOKENS.map((token, index) =>
  tokenDataSourceTemplate(token, index)
).join("");

const faucetDataSources = FAUCETS.map((faucet, index) =>
  faucetDataSourceTemplate(faucet, index)
).join("");

const poolDataSources = POOLS.map((pool, index) =>
  liquidityPoolsDataSourceTemplate(pool, index)
).join("");

const content = header(
  [tokenDataSources, faucetDataSources, poolDataSources].join("\n")
);

fs.writeFileSync("subgraph.yaml", content.trim() + "\n");

console.log("✅ subgraph.yaml generated successfully!");
