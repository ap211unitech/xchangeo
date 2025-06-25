import hre from "hardhat";
import { parseUnits } from "../utils";

export const TOKEN_1 = {
  name: "Tether USD",
  symbol: "USDT",
  logoIpfsCid: "some ipfs hash",
  maximumCap: 100_000_000, // 100 million
};

const TOKEN_2 = {
  name: "Dai",
  symbol: "DAI",
  logoIpfsCid: "some ipfs hash",
  maximumCap: 100_000_000, // 100 million
};

export const LP_TOKEN = {
  name: "DAI/USDT LP Token",
  symbol: "DAIUSDT-LP",
  logoIpfsCid: "some ipfs hash",
};

export const deployERC20TokenContract = async () => {
  const Token = await hre.ethers.getContractFactory("ERC20Token");

  return await Token.deploy(
    TOKEN_1.name,
    TOKEN_1.symbol,
    TOKEN_1.logoIpfsCid,
    TOKEN_1.maximumCap
  );
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

export const deployERC20PoolContract = async () => {
  const Token = await hre.ethers.getContractFactory("ERC20Token");

  const [token1, token2] = await Promise.all([
    await (
      await Token.deploy(
        TOKEN_1.name,
        TOKEN_1.symbol,
        TOKEN_1.logoIpfsCid,
        TOKEN_1.maximumCap
      )
    ).getAddress(),
    await (
      await Token.deploy(
        TOKEN_2.name,
        TOKEN_2.symbol,
        TOKEN_2.logoIpfsCid,
        TOKEN_2.maximumCap
      )
    ).getAddress(),
  ]);

  const ERC20SwapPool = await hre.ethers.getContractFactory("ERC20SwapPool");

  return await ERC20SwapPool.deploy(
    token1,
    token2,
    30,
    LP_TOKEN.name,
    LP_TOKEN.symbol,
    LP_TOKEN.logoIpfsCid
  );
};
