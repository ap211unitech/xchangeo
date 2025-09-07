import BN from "bignumber.js";
import { AddressLike, Contract, JsonRpcSigner, TransactionResponse } from "ethers";

import { ABI, GET_ALL_POOLS, GET_POOLS_ACTIVITY, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits, parseUnits } from "@/lib/utils";
import { GetAmountsOnRemovingLiquidity, PoolActivity, PoolInfo, UserShare } from "@/types";

import { rpcProvider } from "..";
import { GetAllPoolsResponse, GetPoolsActivityResponse, IPoolService } from "./types";

export class PoolService implements IPoolService {
  public async getAllPools(): Promise<PoolInfo[]> {
    const res = await executeGraphQLQuery<GetAllPoolsResponse[]>(
      "pools",
      GET_ALL_POOLS,
      {
        tags: [TAGS.getAllPools()],
      },
      "no-cache",
    );

    return res.map(pool => {
      return {
        poolAddress: pool.pool,
        feeTier: +pool.fee,
        lpToken: {
          name: pool.lpToken.name,
          ticker: pool.lpToken.symbol,
          contractAddress: pool.lpToken.tokenAddress,
        },
        tokenA: {
          name: pool.tokenA.name,
          ticker: pool.tokenA.symbol,
          contractAddress: pool.tokenA.tokenAddress,
          // TODO: Add this later
          allTimeVolume: 0,
          reserve: formatUnits(BigInt(pool.reserveA)),
        },
        tokenB: {
          name: pool.tokenB.name,
          ticker: pool.tokenB.symbol,
          contractAddress: pool.tokenB.tokenAddress,
          // TODO: Add this later
          allTimeVolume: 0,
          reserve: formatUnits(BigInt(pool.reserveB)),
        },
      };
    });
  }

  public async getUserShare(poolsInfo: PoolInfo[], address: string): Promise<UserShare[]> {
    return Promise.all(
      poolsInfo.map(async pool => {
        const lpTokenContract = new Contract(pool.lpToken.contractAddress, ABI.ERC20TOKEN, rpcProvider);
        const [totalSupply, userBalance] = await Promise.all([await lpTokenContract.totalSupply(), await lpTokenContract.balanceOf(address)]);

        return {
          poolAddress: pool.poolAddress,
          userShare: totalSupply === BigInt(0) ? 0 : new BN(userBalance).dividedBy(new BN(totalSupply)).multipliedBy(100).toNumber(),
        };
      }),
    );
  }

  public async addLiquidity(
    signer: JsonRpcSigner,
    poolAddress: AddressLike,
    tokenA: AddressLike,
    tokenB: AddressLike,
    amountTokenA: number,
    amountTokenB: number,
  ): Promise<TransactionResponse> {
    const [formattedAmountA, formattedAmountB] = [parseUnits(amountTokenA), parseUnits(amountTokenB)];

    const poolContract = new Contract(await poolAddress, ABI.ERC20_SWAP, signer);
    const tokenAContract = new Contract(await tokenA, ABI.ERC20TOKEN, signer);
    const tokenBContract = new Contract(await tokenB, ABI.ERC20TOKEN, signer);

    await tokenAContract.approve(poolAddress, formattedAmountA);
    await tokenBContract.approve(poolAddress, formattedAmountB);

    const tx: TransactionResponse = await poolContract.addLiquidity(formattedAmountA, formattedAmountB);
    return tx;
  }

  public async getAmountsOnRemovingLiquidity(
    poolAddress: AddressLike,
    lpTokenAddress: AddressLike,
    percentageToWithdraw: number,
    address: string,
  ): Promise<GetAmountsOnRemovingLiquidity> {
    const [poolContract, lpTokenContract] = await Promise.all([
      new Contract(await poolAddress, ABI.ERC20_SWAP, rpcProvider),
      new Contract(await lpTokenAddress, ABI.ERC20TOKEN, rpcProvider),
    ]);

    const userBalance = await lpTokenContract.balanceOf(address);

    if (userBalance === BigInt(0)) {
      return { amountTokenA: "0", amountTokenB: "0" };
    }

    const [amountTokenA, amountTokenB] = await poolContract.getAmountsOnRemovingLiquidity(
      (BigInt(userBalance) * BigInt(percentageToWithdraw)) / BigInt(100),
    );

    return { amountTokenA: formatUnits(amountTokenA).toString(), amountTokenB: formatUnits(amountTokenB).toString() };
  }

  public async removeLiquidity(signer: JsonRpcSigner, poolAddress: AddressLike, lpTokenAddress: AddressLike, percentageToWithdraw: number) {
    const [poolContract, lpTokenContract] = await Promise.all([
      new Contract(await poolAddress, ABI.ERC20_SWAP, signer),
      new Contract(await lpTokenAddress, ABI.ERC20TOKEN, signer),
    ]);

    const userBalance = await lpTokenContract.balanceOf(signer.address);
    const lpTokensToWithdraw = (BigInt(userBalance) * BigInt(percentageToWithdraw)) / BigInt(100);

    await lpTokenContract.approve(await poolAddress, lpTokensToWithdraw);

    const tx: TransactionResponse = await poolContract.removeLiquidity(lpTokensToWithdraw);
    return tx;
  }

  public async getPoolsActivity(): Promise<PoolActivity[]> {
    const res = await executeGraphQLQuery<GetPoolsActivityResponse[]>(
      "poolTransactions",
      GET_POOLS_ACTIVITY,
      {
        tags: [TAGS.getPoolsActivity()],
      },
      "no-cache",
    );

    return res.map(tx => {
      return {
        id: tx.id,
        eventType: tx.eventType,
        sender: tx.sender,
        timestamp: +tx.timestamp,
        transactionHash: tx.transactionHash,
        tokenA: {
          name: tx.tokenA.name,
          ticker: tx.tokenA.symbol,
          tokenAddress: tx.tokenA.tokenAddress,
          amount: formatUnits(BigInt(tx.amountA)),
        },
        tokenB: {
          name: tx.tokenB.name,
          ticker: tx.tokenB.symbol,
          tokenAddress: tx.tokenB.tokenAddress,
          amount: formatUnits(BigInt(tx.amountB)),
        },
      };
    });
  }
}
