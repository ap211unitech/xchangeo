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

  describe("Request tokens", () => {
    let tx: ContractTransactionResponse;
    const mintBalance = parseUnits(100_000);

    beforeEach(async () => {
      // Mint some tokens to Faucet
      await usdtToken.mint(await faucet.getAddress(), mintBalance);

      // Request some tokens
      tx = await faucet.connect(addr1 as any).requestTokens();
      await tx.wait();
    });

    it("Should decrease faucet balance", async () => {
      // Faucet Balance should decrease by withdrawal amount
      expect(await usdtToken.balanceOf(await faucet.getAddress())).to.be.equal(
        mintBalance - FAUCET.withdrawlAmount
      );
    });

    it("Should increase user balance", async () => {
      // User Balance should increase by withdrawal amount
      expect(await usdtToken.balanceOf(addr1.address)).to.be.equal(
        FAUCET.withdrawlAmount
      );
    });

    it("Should have correct nextAccessTime", async () => {
      const prevAccessTime = BigInt((await tx.getBlock())?.timestamp || 0);
      const nextAccessTime = await faucet.getNextAccessTime(addr1.address);

      // Verify nextAccessTime
      expect(nextAccessTime - prevAccessTime).to.be.equal(FAUCET.lockTime);
    });

    it("Should emit event", async () => {
      await expect(tx)
        .to.be.emit(faucet, "Faucet__ReceivedFunds")
        .withArgs(
          await faucet.getAddress(),
          addr1.address,
          FAUCET.withdrawlAmount,
          (
            await tx.getBlock()
          )?.timestamp
        );
    });

    it("Should wait till next access time", async () => {
      // Requesting second time
      await expect(
        faucet.connect(addr1 as any).requestTokens()
      ).to.be.revertedWithCustomError(
        faucet,
        "Faucet__InsufficientTimeElapsed"
      );
    });
  });
});
