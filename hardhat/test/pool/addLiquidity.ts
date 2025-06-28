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

  describe("Add Liquidity", () => {
    it("Should throw error on zero amount", async () => {
      await expect(pool.addLiquidity(0, 1)).to.be.revertedWithCustomError(
        pool,
        `ERC20SwapPool__InvalidAmount`
      );
      await expect(pool.addLiquidity(1, 0)).to.be.revertedWithCustomError(
        pool,
        `ERC20SwapPool__InvalidAmount`
      );
    });

    it("Should revert if allowance is not enough", async () => {
      await token1.approve(pool, 10);
      await token2.approve(pool, 5); // not sufficient allowance

      await expect(pool.addLiquidity(10, 10)).to.be.revertedWithCustomError(
        token2,
        "ERC20InsufficientAllowance"
      );
    });

    it("Should add initial liquidity and mint LP tokens", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 4000);

      const tx = await pool.addLiquidity(1000, 4000);
      await tx.wait();

      const [reserve1, reserve2] = await pool.getReserves();
      expect(reserve1).to.equal(1000);
      expect(reserve2).to.equal(4000);

      const lpToken = await hre.ethers.getContractAt(
        "LpToken",
        await pool.getLpToken()
      );
      const balance = await lpToken.balanceOf(signer.address);
      expect(balance).to.be.equal(2000); // sqrt(1000 * 4000) = 2000
    });

    it("Should revert if token ratio does not match existing pool reserves", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000);

      await token1.approve(pool, 100);
      await token2.approve(pool, 200); // wrong ratio

      await expect(pool.addLiquidity(100, 200)).to.be.revertedWithCustomError(
        pool,
        "ERC20SwapPool__InvalidTokenRatio"
      );
    });

    it("Should allow adding liquidity with correct ratio after initial", async () => {
      const amountToken1_A = 373;
      const amountToken2_A = 1119; // 3 * 373, maintains ratio 1:3

      await token1.approve(pool, amountToken1_A);
      await token2.approve(pool, amountToken2_A);
      await pool.addLiquidity(amountToken1_A, amountToken2_A);

      // Second addition, same ratio (1:3)
      const amountToken1_B = 149;
      const amountToken2_B = 447; // 149 * 3

      await token1.approve(pool, amountToken1_B);
      await token2.approve(pool, amountToken2_B);
      const tx = await pool.addLiquidity(amountToken1_B, amountToken2_B);
      await tx.wait();

      // Check that reserves are correctly updated
      const [reserve1, reserve2] = await pool.getReserves();
      expect(reserve1).to.equal(amountToken1_A + amountToken1_B);
      expect(reserve2).to.equal(amountToken2_A + amountToken2_B);

      // Confirm LP tokens were minted
      const lpToken = await hre.ethers.getContractAt(
        "LpToken",
        await pool.getLpToken()
      );
      const balance = await lpToken.balanceOf(signer.address);
      expect(balance).to.be.equal(904);
    });

    it("Should update reserves after each liquidity addition", async () => {
      await token1.approve(pool, 500);
      await token2.approve(pool, 500);
      await pool.addLiquidity(500, 500);

      let [reserve1, reserve2] = await pool.getReserves();
      expect(reserve1).to.equal(500);
      expect(reserve2).to.equal(500);

      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000);

      [reserve1, reserve2] = await pool.getReserves();
      expect(reserve1).to.equal(1500);
      expect(reserve2).to.equal(1500);
    });

    it("Should emit LiquidityAdded event", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);

      const tx = await pool.addLiquidity(1000, 1000);
      const receipt = (await tx.wait()) as ContractTransactionReceipt;
      const block = (await hre.ethers.provider.getBlock(
        receipt.blockNumber
      )) as Block;

      await expect(tx).to.emit(pool, "LiquidityAdded").withArgs(
        pool.target,
        token1.target,
        token2.target,
        1000,
        1000,
        1000, // LP Tokens
        1000,
        1000,
        block.timestamp, // Use actual timestamp from the mined block
        signer.address
      );
    });

    it("Should allow multiple users to add liquidity", async () => {
      // Bootstrap Liquidity
      await token1.approve(pool, 1000);
      await token2.approve(pool, 4000);
      await pool.addLiquidity(1000, 4000);
      expect(await lpToken.balanceOf(signer.address)).to.be.equal(2000);

      const [, other] = await hre.ethers.getSigners();

      await token1.transfer(other.address, 500);
      await token2.transfer(other.address, 2000);

      await token1.connect(other).approve(pool, 500);
      await token2.connect(other).approve(pool, 2000);
      await expect(pool.connect(other).addLiquidity(500, 2000)).to.not.be
        .reverted;

      const [reserve1, reserve2] = await pool.getReserves();
      expect(reserve1).to.equal(1500);
      expect(reserve2).to.equal(6000);

      expect(await lpToken.balanceOf(other.address)).to.be.equal(1000);
    });
  });
});
