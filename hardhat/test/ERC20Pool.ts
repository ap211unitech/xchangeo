import hre from "hardhat";
import { expect } from "chai";
import { ContractTransactionResponse } from "ethers";

import { deployERC20PoolContract, LP_TOKEN } from "./consts";
import { ERC20SwapPool } from "../typechain-types";

describe("ERC20/ERC20 Pool Contract", () => {
  let token1: string, token2: string;
  let pool: ERC20SwapPool & {
    deploymentTransaction(): ContractTransactionResponse;
  };

  beforeEach(async () => {
    [token1, token2, pool] = await deployERC20PoolContract();
  });

  describe("Deployment", () => {
    it("Check initial metadata", async () => {
      const [token_1, token_2] = await pool.getTokens();
      const fee = await pool.getFee();
      const [reserve1, reserve2] = await pool.getReserves();

      const lpToken = await hre.ethers.getContractAt(
        "LpToken",
        await pool.getLpToken()
      );

      expect(token_1).to.be.equal(token1);
      expect(token_2).to.be.equal(token2);

      expect(await lpToken.name()).to.be.equal(LP_TOKEN.name);
      expect(await lpToken.symbol()).to.be.equal(LP_TOKEN.symbol);
      expect(await lpToken.logo()).to.be.equal(LP_TOKEN.logoIpfsCid);

      expect(fee).to.be.equal(30);
      expect(reserve1).to.be.equal(0);
      expect(reserve2).to.be.equal(0);
    });
  });
});
