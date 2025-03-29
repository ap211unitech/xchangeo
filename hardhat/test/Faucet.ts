import hre from "hardhat";
import { expect } from "chai";
import { AddressLike, ContractTransactionResponse, Typed } from "ethers";

import { ERC20Faucet, ERC20Token } from "../typechain-types";
import {
  deployERC20TokenContract,
  deployERC20TokenFaucetContract,
  FAUCET,
} from "./consts";
import { parseUnits } from "../utils";

describe("ERC20Faucet Contract", () => {
  // global vars
  let usdtToken: ERC20Token & {
    deploymentTransaction(): ContractTransactionResponse;
  };
  let faucet: ERC20Faucet & {
    deploymentTransaction(): ContractTransactionResponse;
  };
  let owner: { address: Typed | AddressLike };
  let addr1: { address: Typed | AddressLike };
  let addr2: { address: Typed | AddressLike };

  beforeEach(async function () {
    // Get Signers here.
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    usdtToken = await deployERC20TokenContract();

    faucet = await deployERC20TokenFaucetContract(await usdtToken.getAddress());
  });

  describe("Deployment", () => {
    it("Should set the correct token address", async () => {
      const token = await faucet.getToken();
      expect(token).to.be.equal(await usdtToken.getAddress());
    });

    it("Should set the correct lock time", async () => {
      const lockTime = await faucet.getLockTime();
      expect(lockTime).to.be.equal(FAUCET.lockTime);
    });

    it("Should set the correct withdrawal amount", async () => {
      const withdrawalAmount = await faucet.getWithdrawalAmount();
      expect(withdrawalAmount).to.be.equal(FAUCET.withdrawlAmount);
    });

    it("Should set the correct token balance", async () => {
      let faucetBalance = await faucet.getBalance();
      expect(faucetBalance).to.be.equal(0);

      // Mint some balance
      const mintBalance = parseUnits(100);
      await usdtToken.mint(await faucet.getAddress(), mintBalance);
      faucetBalance = await faucet.getBalance();
      expect(faucetBalance).to.be.equal(mintBalance);
    });
  });
});
