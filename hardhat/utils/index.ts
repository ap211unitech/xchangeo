import { ethers } from "hardhat";

export const parseUnits = (val: number) => {
  return ethers.parseUnits(val.toString());
};

export const formatUnits = (val: bigint) => {
  return Number(ethers.formatUnits(val));
};
