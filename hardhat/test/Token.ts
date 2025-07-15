import hre from "hardhat";
import { expect } from "chai";
import { AddressLike, ContractTransactionResponse, Typed } from "ethers";

import { ERC20Token } from "../typechain-types";
import { formatUnits, parseUnits } from "../utils";
import { deployERC20TokenContract, TOKEN_1 as TOKEN } from "./consts";

describe("ERC20Token contract", () => {
  // global vars
  let usdtToken: ERC20Token & {
    deploymentTransaction(): ContractTransactionResponse;
  };
  let owner: { address: Typed | AddressLike };
  let addr1: { address: Typed | AddressLike };
  let addr2: { address: Typed | AddressLike };

  beforeEach(async function () {
    // Get Signers here.
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    usdtToken = await deployERC20TokenContract();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await usdtToken.owner()).to.equal(owner.address);
    });

    it("Should set the metadata", async function () {
      expect(await usdtToken.name()).to.equal('TOKEN.name');
      expect(await usdtToken.symbol()).to.equal(TOKEN.symbol);
      expect(await usdtToken.decimals()).to.equal(18);
    });

    it("Should assign the initial supply to 1000", async function () {
      const totalSupply = await usdtToken.totalSupply();
      expect(formatUnits(totalSupply)).to.equal(TOKEN.maximumCap / 100_000);
    });

    it("Should assign the initial supply of tokens to the owner", async function () {
      const ownerBalance = await usdtToken.balanceOf(owner.address);
      expect(await usdtToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to 100 millions", async function () {
      const cap = await usdtToken.cap();
      expect(Number(formatUnits(cap))).to.equal(TOKEN.maximumCap);
    });

    it("Should emit ERC20TokenCreated event", async function () {
      await usdtToken.waitForDeployment();

      const txHash = usdtToken.deploymentTransaction()?.hash ?? "";
      const receipt = await hre.ethers.provider.getTransactionReceipt(txHash);

      const iface = new hre.ethers.Interface([
        "event ERC20TokenCreated(address indexed token, string name, string symbol)",
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

      const event = decodedLogs?.find((e) => e.name === "ERC20TokenCreated");
      expect(event).to.not.be.undefined;
      expect(event?.args.token).to.equal(await usdtToken.getAddress());
      expect(event?.args.name).to.equal("Tether USD");
      expect(event?.args.symbol).to.equal("USDT");
    });
  });

  describe("Mint", function () {
    const amountToMint = parseUnits(10);
    let tokenTotalSupplyBefore: number;

    beforeEach(async () => {
      tokenTotalSupplyBefore = formatUnits(await usdtToken.totalSupply());
      await usdtToken.mint(addr1.address, amountToMint);
    });

    it("Should update balance of user", async () => {
      expect(await usdtToken.balanceOf(addr1.address)).to.eq(amountToMint);
    });

    it("Should increase total supply by 10 tokens", async () => {
      expect(formatUnits(await usdtToken.totalSupply())).to.eq(
        tokenTotalSupplyBefore + 10
      );
    });

    it("Mint maximum possible amount", async () => {
      const totalSupply = formatUnits(await usdtToken.totalSupply());

      // Mint remaining supply between some accounts in random proportion //
      const REMAINING_SUPPY = TOKEN.maximumCap - totalSupply;

      const PART_1 = parseUnits(REMAINING_SUPPY * 0.2);
      const PART_2 = parseUnits(REMAINING_SUPPY * 0.3);
      const PART_3 = parseUnits(REMAINING_SUPPY * 0.5);

      await usdtToken.mint(owner.address, PART_1);
      await usdtToken.mint(addr1.address, PART_2);
      await usdtToken.mint(addr2.address, PART_3);

      //////////////////////////////////////////////////////////////////////

      expect(await usdtToken.totalSupply()).to.eq(await usdtToken.cap());
    });

    it("Should throw error if total supply exceeds maximum allowed cap", async () => {
      const totalSupply = formatUnits(await usdtToken.totalSupply());

      const MINIMUM_AMOUNT_TO_EXCEED_MAX_CAP =
        parseUnits(TOKEN.maximumCap - totalSupply) + BigInt(1);

      await expect(
        usdtToken.mint(addr1.address, MINIMUM_AMOUNT_TO_EXCEED_MAX_CAP)
      ).to.be.rejectedWith(
        "ERC20ExceededCap(100000000000000000000000001, 100000000000000000000000000)"
      );
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await usdtToken.transfer(addr1.address, 50);
      let addr1Balance = await usdtToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(BigInt(50));

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await usdtToken.connect(addr1 as any).transfer(addr2.address, 50);
      addr1Balance = await usdtToken.balanceOf(addr1.address);
      const addr2Balance = await usdtToken.balanceOf(addr2.address);

      expect(addr2Balance).to.equal(BigInt(50));
      expect(addr1Balance).to.equal(BigInt(0));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await usdtToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        usdtToken.connect(addr1 as any).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(usdtToken, "ERC20InsufficientBalance");

      // Owner balance shouldn't have changed.
      expect(await usdtToken.balanceOf(owner.address)).to.equal(
        BigInt(initialOwnerBalance)
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await usdtToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await usdtToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await usdtToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await usdtToken.balanceOf(owner.address);
      expect(Number(finalOwnerBalance)).to.equal(
        Number(initialOwnerBalance) - 150
      );

      const addr1Balance = await usdtToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(BigInt(100));

      const addr2Balance = await usdtToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(BigInt(50));
    });
  });
});
