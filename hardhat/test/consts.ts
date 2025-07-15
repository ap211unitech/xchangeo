import hre from "hardhat";
import { ContractTransactionResponse } from "ethers";

import { parseUnits } from "../utils";
import { ERC20SwapPool, ERC20Token } from "../typechain-types";

export const TOKEN_1 = {
  name: "Tether USD",
  symbol: "USDT",
  maximumCap: 100_000_000, // 100 million
};

const TOKEN_2 = {
  name: "Dai",
  symbol: "DAI",
  maximumCap: 100_000_000, // 100 million
};

export const LP_TOKEN = {
  name: "DAI/USDT LP Token",
  symbol: "DAIUSDT-LP",
};


export const deployERC20TokenContract = async () => {
  const Token = await hre.ethers.getContractFactory("ERC20Token");

  return await Token.deploy(TOKEN_1.name, TOKEN_1.symbol, TOKEN_1.maximumCap);
};

export const FAUCET = {
  lockTime: 10, // 10s
  withdrawlAmount: parseUnits(1), // 1 Unit
};

export const deployERC20TokenFaucetContract = async (tokenAddress: string) => {
  const Faucet = await hre.ethers.getContractFactory("ERC20Faucet");

  return await Faucet.deploy(
    tokenAddress,
    FAUCET.lockTime,
    FAUCET.withdrawlAmount
  );
};

export const deployERC20PoolContract = async (): Promise<
  [
    ERC20Token,
    ERC20Token,
    ERC20SwapPool & {
      deploymentTransaction(): ContractTransactionResponse;
    }
  ]
> => {
  const Token = await hre.ethers.getContractFactory("ERC20Token");

  const [token1, token2] = await Promise.all([
    await Token.deploy(TOKEN_1.name, TOKEN_1.symbol, TOKEN_1.maximumCap),
    await Token.deploy(TOKEN_2.name, TOKEN_2.symbol, TOKEN_2.maximumCap),
  ]);

  const ERC20SwapPool = await hre.ethers.getContractFactory("ERC20SwapPool");

  const pool = await ERC20SwapPool.deploy(
    token1,
    token2,
    30,
    LP_TOKEN.name,
    LP_TOKEN.symbol
  );

  return [token1, token2, pool];
};
