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

const DeployModule = buildModule("DeployModule", (m) => {
  const exports: Record<string, any> = {};

  TOKENS.forEach((token) => {
    const { lockTime, withdrawalAmount } = token.faucet;

    // Step 1: Deploy tokens
    const tokenContract = m.contract(
      "ERC20Token",
      [token.name, token.symbol, token.maximumCap],
      {
        id: `ERC20Token_${token.symbol}`,
      }
    );

    // Step 2: Deploy faucets, using token addresses as constructor args
    const faucetContract = m.contract(
      "ERC20Faucet",
      [tokenContract, lockTime, parseUnits(withdrawalAmount)],
      {
        id: `Faucet_${token.symbol}`,
      }
    );

    exports[token.symbol] = {
      token: tokenContract,
      faucet: faucetContract,
    };
  });

  return exports;
});

export default DeployModule;
