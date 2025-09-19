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

  describe("Remove Liquidity", () => {
    it("Should revert if LP token amount is zero", async () => {
      await expect(pool.removeLiquidity(0)).to.be.revertedWithCustomError(
        pool,
        "ERC20SwapPool__InvalidAmount"
      );
    });

    it("Should revert if pool has no liquidity", async () => {
      await expect(pool.removeLiquidity(1000)).to.be.revertedWithCustomError(
        pool,
        "ERC20SwapPool__InvalidAmount"
      );
    });

    it("Should revert if user tries to remove more LP than they have", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 995, 995);

      await expect(pool.removeLiquidity(1001))
        .to.be.revertedWithCustomError(pool, "ERC20SwapPool__InvalidAmount")
        .withArgs("Not enough liquidity tokens");
    });

    it("Should burn LP tokens and transfer reserves proportionally", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 995, 995);

      const lpTokensToBurn = Math.ceil(
        Number(await lpToken.balanceOf(signer.address)) / 3
      ); // 334;
      await lpToken.approve(pool, lpTokensToBurn);

      const tx = await pool.removeLiquidity(lpTokensToBurn);
      await tx.wait();

      expect(await lpToken.balanceOf(signer.address)).to.equal(666);
      expect(await pool.getReserves()).to.deep.equal([666n, 666n]);
      expect(await lpToken.totalSupply()).to.be.equal(666);
    });

    it("Should emit LiquidityRemoved event", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 1000, 1000);
      const lpBalance = await lpToken.balanceOf(signer.address);
      await lpToken.approve(pool, lpBalance);

      const tx = await pool.removeLiquidity(lpBalance);
      const receipt = (await tx.wait()) as ContractTransactionReceipt;
      const block = (await hre.ethers.provider.getBlock(
        receipt.blockNumber
      )) as Block;

      await expect(tx)
        .to.emit(pool, "LiquidityRemoved")
        .withArgs(
          pool.target,
          token1.target,
          token2.target,
          1000,
          1000,
          lpBalance,
          0,
          0,
          block.timestamp,
          signer.address
        );
    });

    it("Should handle reserves with rounding differences", async () => {
      await token1.approve(pool, 3);
      await token2.approve(pool, 7);
      await pool.addLiquidity(3, 7, 1, 1);

      const lpBalance = await lpToken.balanceOf(signer.address);
      await lpToken.approve(pool, lpBalance);
      await pool.removeLiquidity(lpBalance);

      const [r1, r2] = await pool.getReserves();
      expect(r1).to.equal(0);
      expect(r2).to.equal(0);
    });

    // ----------------------------------------- Integration Tests ---------------------------------------------- //

    it("Should allow multiple users to remove liquidity proportionally", async () => {
      const [, userB] = await hre.ethers.getSigners();

      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 0, 0);

      await token1.transfer(userB.address, 1000);
      await token2.transfer(userB.address, 1000);

      await token1.connect(userB).approve(pool, 1000);
      await token2.connect(userB).approve(pool, 1000);
      await pool.connect(userB).addLiquidity(1000, 1000, 0, 0);

      const lpB = await lpToken.balanceOf(userB.address);
      await lpToken.connect(userB).approve(pool, lpB);

      await pool.connect(userB).removeLiquidity(lpB);
      expect(await lpToken.balanceOf(userB.address)).to.equal(0);
    });

    it("Should revert if LP tokens not approved for transfer", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 995, 995);

      const lpBal = await lpToken.balanceOf(signer.address);
      await expect(pool.removeLiquidity(lpBal)).to.be.revertedWithCustomError(
        token2,
        "ERC20InsufficientAllowance"
      );
    });

    it("Should update reserves correctly after partial LP burn", async () => {
      await token1.approve(pool, 1000);
      await token2.approve(pool, 1000);
      await pool.addLiquidity(1000, 1000, 995, 995);

      const lpBal = await lpToken.balanceOf(signer.address);
      const half = lpBal / 2n;

      await lpToken.approve(pool, half);
      await pool.removeLiquidity(half);

      const [r1, r2] = await pool.getReserves();
      expect(r1).to.equal(500);
      expect(r2).to.equal(500);
    });
  });
});
