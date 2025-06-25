import hre from "hardhat";
import { expect } from "chai";
import { ContractTransactionResponse } from "ethers";

import { deployERC20PoolContract, LP_TOKEN } from "../consts";
import { ERC20SwapPool } from "../../typechain-types";

describe("ERC20/ERC20 Pool Contract", () => {
  let pool: ERC20SwapPool & {
    deploymentTransaction(): ContractTransactionResponse;
  };

  beforeEach(async () => {
    pool = await deployERC20PoolContract();
  });

  describe("Deployment", () => {
    it("Check initial metadata", async () => {
      const [token1, token2] = await pool.getTokens();
      const fee = await pool.getFee();
      const [reserve1, reserve2] = await pool.getReserves();

      const lpToken = await hre.ethers.getContractAt(
        "LpToken",
        await pool.getLpToken()
      );

      expect(token1).to.be.equal("0xD84379CEae14AA33C123Af12424A37803F885889");
      expect(token2).to.be.equal("0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5");

      expect(await lpToken.getAddress()).to.be.equal(
        "0x782df4e02589470f7052428C9C879592FD4b0290"
      );
      expect(await lpToken.name()).to.be.equal(LP_TOKEN.name);
      expect(await lpToken.symbol()).to.be.equal(LP_TOKEN.symbol);
      expect(await lpToken.logo()).to.be.equal(LP_TOKEN.logoIpfsCid);

      expect(fee).to.be.equal(30);
      expect(reserve1).to.be.equal(0);
      expect(reserve2).to.be.equal(0);
    });
  });
});
