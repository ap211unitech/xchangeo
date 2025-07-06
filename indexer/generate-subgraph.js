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

const header = (dataSources) => `
specVersion: 1.2.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:${dataSources}
`;

const dataSourceTemplate = (token) => `
  - kind: ethereum
    name: ERC20Token-${token.address}
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

const tokenDataSources = TOKENS.map((token) => dataSourceTemplate(token)).join(
  ""
);

const content = header(tokenDataSources);

fs.writeFileSync("subgraph.yaml", content.trim() + "\n");

console.log("✅ subgraph.yaml generated successfully!");
