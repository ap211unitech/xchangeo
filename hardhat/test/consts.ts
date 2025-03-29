import hre from "hardhat";
import { parseUnits } from "../utils";

export const TOKEN = {
  name: "Tether USD",
  symbol: "USDT",
  logoIpfsCid: "some ipfs hash",
  maximumCap: 100_000_000, // 100 million
};

export const deployERC20TokenContract = async () => {
  const Token = await hre.ethers.getContractFactory("ERC20Token");

  return await Token.deploy(
    TOKEN.name,
    TOKEN.symbol,
    TOKEN.logoIpfsCid,
    TOKEN.maximumCap
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
