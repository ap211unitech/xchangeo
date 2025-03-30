import { ethers } from "hardhat";

export const sleep = async (seconds: number) =>
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const parseUnits = (val: number) => {
  return ethers.parseUnits(val.toString());
};

export const formatUnits = (val: bigint) => {
  return Number(ethers.formatUnits(val));
};
