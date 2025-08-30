import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseUnits } from "../../utils";

const TOKENS = [
  {
    name: "Tether USD",
    symbol: "USDT",
    maximumCap: 100_000_000,
    faucet: {
      lockTime: 60 * 1,
      withdrawalAmount: 5,
    },
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    maximumCap: 100_000_000,
    faucet: {
      lockTime: 60 * 1,
      withdrawalAmount: 10,
    },
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    maximumCap: 50_000_000,
    faucet: {
      lockTime: 60 * 5,
      withdrawalAmount: 15,
    },
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    maximumCap: 21_000_000,
    faucet: {
      lockTime: 60 * 10,
      withdrawalAmount: 0.005,
    },
  },
];

const POOLS = [
  { tokenA: "USDT", tokenB: "USDC", fee: 5 }, // 0.05% fee for stable pairs
  { tokenA: "USDC", tokenB: "DAI", fee: 5 }, // 0.05% fee for stable pairs
  { tokenA: "USDT", tokenB: "WBTC", fee: 30 }, // 0.3% fee for a more volatile pair
];

const DeployModule = buildModule("DeployModule", (m) => {
  const deployedContracts: Record<any, any> = {};

  // Step 1: Deploy tokens
  for (const token of TOKENS) {
    const id = `ERC20Token_${token.symbol}`;
    const tokenContract = m.contract(
      "ERC20Token",
      [token.name, token.symbol, token.maximumCap],
      { id }
    );

    deployedContracts[token.symbol] = tokenContract;
  }

  // STEP 2: Deploy faucets and mint balance to them
  for (const token of TOKENS) {
    const { lockTime, withdrawalAmount } = token.faucet;
    const tokenContract = deployedContracts[token.symbol];

    const faucetContract = m.contract(
      "ERC20Faucet",
      [tokenContract, lockTime, parseUnits(withdrawalAmount)],
      {
        id: `Faucet_${token.symbol}`,
        after: [tokenContract],
      }
    );

    // Step 3: Mint tokens to the faucet
    const mintCall = m.call(
      tokenContract,
      "mint",
      [
        faucetContract, // or another address
        parseUnits(token.maximumCap / 1000),
      ],
      {
        id: `Mint_${token.symbol}`,
        after: [faucetContract], // Mint only after faucet is deployed
      }
    );

    deployedContracts[`faucet_${token.symbol}`] = faucetContract;
    deployedContracts[`mint_${token.symbol}`] = mintCall;
  }

  // STEP 3: Deploy the liquidity pools using the token contracts
  for (const pool of POOLS) {
    const { tokenA, tokenB, fee } = pool;
    const tokenAContract = deployedContracts[pool.tokenA];
    const tokenBContract = deployedContracts[pool.tokenB];

    // Create a unique name and symbol for the Liquidity Provider (LP) token
    const lpTokenName = `${tokenA}/${tokenB} LP Token`;
    const lpTokenSymbol = `${tokenA}-${tokenB}-LP`;

    const poolContract = m.contract(
      "ERC20SwapPool",
      [tokenAContract, tokenBContract, fee, lpTokenName, lpTokenSymbol],
      {
        id: `Pool_${pool.tokenA}_${pool.tokenB}`,
        // This pool can only be deployed after its underlying tokens are deployed
        after: [tokenAContract, tokenBContract],
      }
    );

    deployedContracts[`pool_${pool.tokenA}_${pool.tokenB}`] = poolContract;
  }

  return deployedContracts;
});

export default DeployModule;
