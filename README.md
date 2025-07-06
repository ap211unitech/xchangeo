# Xchangeo

AMM-based Decentralized Exchange (DEX)

## Run Indexer locally

npx hardhat ignition deploy ./ignition/modules/index.ts --network localhost

pnpm clean
pnpm ready
pnpm docker:start
pnpm create-local && pnpm deploy-local