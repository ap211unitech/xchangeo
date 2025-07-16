import fs from "fs";

const TOKENS = [
  {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    startBlock: 0,
  },
  {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    startBlock: 0,
  },
  {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    startBlock: 0,
  },
  {
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    startBlock: 0,
  },
];

const FAUCETS = [
  {
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    startBlock: 0,
  },
  {
    address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    startBlock: 0,
  },
  {
    address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    startBlock: 0,
  },
  {
    address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    startBlock: 0,
  },
];

const header = (dataSources) => `
specVersion: 1.2.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:${dataSources}
`;

const tokenDataSourceTemplate = (token, index) => `
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

const faucetDataSourceTemplate = (faucet, index) => `
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

const tokenDataSources = TOKENS.map((token, index) =>
  tokenDataSourceTemplate(token, index)
).join("");

const faucetDataSources = FAUCETS.map((faucet, index) =>
  faucetDataSourceTemplate(faucet, index)
).join("");

const content = header([tokenDataSources, faucetDataSources].join("\n"));

fs.writeFileSync("subgraph.yaml", content.trim() + "\n");

console.log("✅ subgraph.yaml generated successfully!");
