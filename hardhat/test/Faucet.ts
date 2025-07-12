import hre from "hardhat";
import { expect } from "chai";
import { AddressLike, ContractTransactionResponse, Typed } from "ethers";

import { ERC20Faucet, ERC20Token } from "../typechain-types";
import {
  deployERC20TokenContract,
  deployERC20TokenFaucetContract,
  FAUCET,
} from "./consts";
import { parseUnits, sleep } from "../utils";

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

    it("Should emit Faucet__Created event", async function () {
      await faucet.waitForDeployment();

      const txHash = faucet.deploymentTransaction()?.hash ?? "";
      const receipt = await hre.ethers.provider.getTransactionReceipt(txHash);

      const iface = new hre.ethers.Interface([
        "event Faucet__Created(address indexed faucet, address indexed token, uint256 lockTime, uint256 withdrawalAmount, uint256 timestamp)",
      ]);

      const decodedLogs = receipt?.logs
        .map((log) => {
          try {
            return iface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((log) => log !== null);

      const event = decodedLogs?.find((e) => e.name === "Faucet__Created");
      expect(event).to.not.be.undefined;
      expect(event?.args.faucet).to.equal(await faucet.getAddress());
      expect(event?.args.token).to.equal(await usdtToken.getAddress());
      expect(event?.args.lockTime).to.equal(FAUCET.lockTime);
      expect(event?.args.withdrawalAmount).to.equal(FAUCET.withdrawlAmount);
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
      expect(await faucet.getBalance()).to.be.equal(
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

    it("Should throw error Insufficient Time Elapsed", async () => {
      // Requesting second time
      await expect(
        faucet.connect(addr1 as any).requestTokens()
      ).to.be.revertedWithCustomError(
        faucet,
        "Faucet__InsufficientTimeElapsed"
      );
    });

    it("Should throw error if faucet doesn't have enough funds", async () => {
      // withdraw all funds from faucet
      await faucet.withdraw();

      await expect(
        faucet.connect(addr1 as any).requestTokens()
      ).to.be.revertedWithCustomError(faucet, "Faucet__InsufficientFunds");
    });
  });

  describe("Set Lock Time", () => {
    const newLockTime = 1; // 1s

    beforeEach(async () => {
      await faucet.setLockTime(newLockTime);
    });

    it("Should not set lock time by any random user", async () => {
      await expect(
        faucet.connect(addr1 as any).setLockTime(newLockTime)
      ).to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount");
    });

    it("Should set new lockTime", async () => {
      expect(await faucet.getLockTime()).to.be.equal(newLockTime);
    });

    describe("Request tokens", () => {
      let initialFaucetBalance = BigInt(0);
      const mintBalance = parseUnits(10);
      beforeEach(async () => {
        // Mint Some Balance to faucet
        await usdtToken.mint(await faucet.getAddress(), mintBalance);

        initialFaucetBalance = await faucet.getBalance();
        await faucet.connect(addr2 as any).requestTokens();
      });

      it("Should request tokens after time elapsed according to new lock time", async () => {
        await sleep(newLockTime);
        await faucet.connect(addr2 as any).requestTokens();

        // Should decrease faucet balance
        expect(await faucet.getBalance()).to.be.equal(
          initialFaucetBalance - BigInt(2 * Number(FAUCET.withdrawlAmount))
        );

        // Should increase faucet balance
        expect(await usdtToken.balanceOf(addr2.address)).to.be.equal(
          BigInt(2 * Number(FAUCET.withdrawlAmount))
        );
      });
    });
  });

  describe("Set Withdrawal Amount", async () => {
    const newWithdrawalAmount = parseUnits(100);
    beforeEach(async () => {
      await faucet.setWithdrawalAmount(newWithdrawalAmount);
    });

    it("Should not set withdrawal amount by any random user", async () => {
      await expect(
        faucet.connect(addr1 as any).setWithdrawalAmount(newWithdrawalAmount)
      ).to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount");
    });

    it("Should set new withdrawalAmount", async () => {
      expect(await faucet.getWithdrawalAmount()).to.be.equal(
        newWithdrawalAmount
      );
    });

    describe("Request tokens", () => {
      let tx: ContractTransactionResponse;
      let initialFaucetBalance = BigInt(0);
      const mintBalance = parseUnits(1000);
      beforeEach(async () => {
        // Mint Some Balance to faucet
        await usdtToken.mint(await faucet.getAddress(), mintBalance);

        initialFaucetBalance = await faucet.getBalance();
        tx = await faucet.connect(addr2 as any).requestTokens();
      });

      it("Should decrease faucet balance", async () => {
        // Faucet Balance should decrease by withdrawal amount
        expect(
          await usdtToken.balanceOf(await faucet.getAddress())
        ).to.be.equal(mintBalance - newWithdrawalAmount);
        expect(await faucet.getBalance()).to.be.equal(
          mintBalance - newWithdrawalAmount
        );
      });

      it("Should increase user balance", async () => {
        // User Balance should increase by withdrawal amount
        expect(await usdtToken.balanceOf(addr2.address)).to.be.equal(
          newWithdrawalAmount
        );
      });

      it("Should have correct nextAccessTime", async () => {
        const prevAccessTime = BigInt((await tx.getBlock())?.timestamp || 0);
        const nextAccessTime = await faucet.getNextAccessTime(addr2.address);

        // Verify nextAccessTime
        expect(nextAccessTime - prevAccessTime).to.be.equal(FAUCET.lockTime);
      });

      it("Should emit event", async () => {
        await expect(tx)
          .to.be.emit(faucet, "Faucet__ReceivedFunds")
          .withArgs(
            await faucet.getAddress(),
            addr2.address,
            newWithdrawalAmount,
            (
              await tx.getBlock()
            )?.timestamp
          );
      });
    });
  });
});
