import hre from "hardhat";
import { expect } from "chai";
import {
  AddressLike,
  Block,
  ContractTransactionReceipt,
  ContractTransactionResponse,
  Typed,
} from "ethers";

import { deployERC20PoolContract } from "../consts";
import { ERC20SwapPool, ERC20Token, LpToken } from "../../typechain-types";

describe("ERC20/ERC20 Pool Contract", () => {
  let signer: { address: Typed | AddressLike };
  let token1: ERC20Token, token2: ERC20Token, lpToken: LpToken;
  let pool: ERC20SwapPool & {
    deploymentTransaction(): ContractTransactionResponse;
  };

  beforeEach(async () => {
    [signer] = await hre.ethers.getSigners();
    [token1, token2, pool] = await deployERC20PoolContract();
    lpToken = await hre.ethers.getContractAt(
      "LpToken",
      await pool.getLpToken()
    );
  });

  describe("Swap", () => {
    beforeEach(async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 995, 995);
    });

    it("Should revert if amount is zero", async () => {
      await expect(pool.swap(token1, 0, 0)).to.be.revertedWithCustomError(
        pool,
        "ERC20SwapPool__InvalidAmount"
      );
    });

    it("Should revert if token is not in the pool", async () => {
      const Token = await hre.ethers.getContractFactory("ERC20Token");
      const fakeToken = await Token.deploy("Fake", "FAKE", 10_000);

      await expect(pool.swap(fakeToken, 10, 10)).to.be.revertedWithCustomError(
        pool,
        "ERC20SwapPool__InvalidTokenAddress"
      );
    });

    it("Should revert if user has not approved tokenIn", async () => {
      let [, user] = await hre.ethers.getSigners();

      await token1.transfer(user.address, 100);
      await expect(
        pool.connect(user).swap(token1, 100, 0)
      ).to.be.revertedWithCustomError(token1, "ERC20InsufficientAllowance");
    });

    it("should revert if output amount is below minAmountOut (slippage)", async () => {
      await expect(pool.swap(token1.target, 100, 200))
        .to.be.revertedWithCustomError(pool, "ERC20SwapPool__Slippage")
        .withArgs("Slippage: amountOut too low");
    });

    it("Should revert if output amount is too low", async () => {
      await token1.approve(pool, 10000000);
      await pool.swap(token1, 10000000, 0);

      await token1.approve(pool, 10000000);

      await expect(pool.swap(token1, 10000000, 0))
        .to.be.revertedWithCustomError(pool, "ERC20SwapPool__Slippage")
        .withArgs("Slippage: amountOut too low");
    });

    it("Should emit TokenSwapped event", async () => {
      let [, user] = await hre.ethers.getSigners();

      await token1.transfer(user.address, 100);
      await token1.connect(user).approve(pool, 100);

      const tx = await pool.connect(user).swap(token1, 100, 0);
      const receipt = (await tx.wait()) as ContractTransactionReceipt;
      const timestamp = (
        (await hre.ethers.provider.getBlock(receipt.blockNumber)) as Block
      ).timestamp;

      const [new_reserve1, new_reserve2] = await pool.getReserves();

      await expect(tx)
        .to.emit(pool, "TokenSwapped")
        .withArgs(
          pool,
          token1.target,
          token2.target,
          100,
          90,
          new_reserve1,
          new_reserve2,
          timestamp,
          user.address
        );
    });

    // ----------------------------------------- Integration Tests ---------------------------------------------- //

    it("Should allow user to swap token1 for token2", async () => {
      let [, user] = await hre.ethers.getSigners();

      const amountIn = 100;
      await token1.transfer(user.address, amountIn);
      await token1.connect(user).approve(pool, amountIn);

      const reserveBefore = await pool.getReserves();
      const balanceOutBefore = await token2.balanceOf(user.address);

      const tx = await pool
        .connect(user)
        .swap(token1, amountIn, amountIn * 0.5);
      await tx.wait();

      const balanceOutAfter = await token2.balanceOf(user.address);
      expect(balanceOutAfter).to.be.gt(balanceOutBefore);

      const [res1After, res2After] = await pool.getReserves();
      expect(res1After).to.equal(reserveBefore[0] + BigInt(amountIn));
      expect(res2After).to.equal(await token2.balanceOf(pool.getAddress()));
    });

    it("Should apply LP fee correctly", async () => {
      let [, user] = await hre.ethers.getSigners();

      const amountIn = 100;
      const feePercent = 0.003; // 0.3%

      await token1.transfer(user.address, amountIn);
      await token1.connect(user).approve(pool, amountIn);

      const reserve1 = await token1.balanceOf(pool.getAddress());
      const reserve2 = await token2.balanceOf(pool.getAddress());

      const amountInWithFee = amountIn * (1 - feePercent);
      const expectedOut = Math.floor(
        (amountInWithFee * Number(reserve2)) /
          (Number(reserve1) + amountInWithFee)
      );

      const balanceBefore = await token2.balanceOf(user.address);
      const tx = await pool
        .connect(user)
        .swap(token1, amountIn, amountIn * 0.5);
      await tx.wait();

      const balanceAfter = await token2.balanceOf(user.address);
      expect(balanceAfter - balanceBefore).to.be.closeTo(expectedOut, 2);
    });

    it("Should allow user to swap token2 for token1", async () => {
      let [, user] = await hre.ethers.getSigners();

      const amountIn = 500;
      await token2.transfer(user.address, amountIn);
      await token2.connect(user).approve(pool, amountIn);

      const token1Before = await token1.balanceOf(user.address);
      const tx = await pool
        .connect(user)
        .swap(token2, amountIn, amountIn * 0.5);
      await tx.wait();
      const token1After = await token1.balanceOf(user.address);

      expect(token1After).to.be.gt(token1Before);
    });

    it("Should handle multiple swaps from different users", async () => {
      const [, user, other] = await hre.ethers.getSigners();

      await token1.transfer(other.address, 500);
      await token1.connect(other).approve(pool, 500);

      const tx1 = await pool.connect(other).swap(token1, 500, 500 * 0.5);
      await tx1.wait();

      await token2.transfer(user.address, 250);
      await token2.connect(user).approve(pool, 250);

      const tx2 = await pool.connect(user).swap(token2, 250, 250 * 0.5);
      await tx2.wait();

      const [r1, r2] = await pool.getReserves();
      expect(r1).to.be.gt(1000);
      expect(r2).to.be.lt(1000);
    });
  });
});
