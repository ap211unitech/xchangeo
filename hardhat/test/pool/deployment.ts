import hre from "hardhat";
import { expect } from "chai";
import { AddressLike, ContractTransactionResponse, Typed } from "ethers";

import { deployERC20PoolContract, LP_TOKEN } from "../consts";
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

  describe("Deployment", () => {
    it("Should have correct pool tokens", async () => {
      const [token_1, token_2] = await pool.getTokens();

      expect(token_1).to.be.equal(token1);
      expect(token_2).to.be.equal(token2);
    });

    it("Should have correct reserves", async () => {
      const [reserve1, reserve2] = await pool.getReserves();

      expect(reserve1).to.be.equal(0);
      expect(reserve2).to.be.equal(0);
    });

    it("Should have correct fee", async () => {
      const fee = await pool.getFee();
      expect(fee).to.be.equal(30);
    });

    it("Should have correct LpToken", async () => {
      expect(await lpToken.name()).to.be.equal(LP_TOKEN.name);
      expect(await lpToken.symbol()).to.be.equal(LP_TOKEN.symbol);
    });
  });
});
