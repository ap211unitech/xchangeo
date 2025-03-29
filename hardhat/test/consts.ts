import hre from "hardhat";

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
