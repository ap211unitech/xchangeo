import BN from "bignumber.js";
import { AddressLike, Contract, JsonRpcSigner, TransactionResponse } from "ethers";

import { ABI, GET_ALL_POOLS, GET_POOL_ACTIVITY, GET_POOL_INFO, GET_POOLS_ACTIVITY, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits, parseUnits } from "@/lib/utils";
import { GetAmountOutOnSwap, GetAmountsOnRemovingLiquidity, PoolActivity, PoolInfo, UserShare } from "@/types";

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

    return res.map((pool): PoolInfo => {
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
          allTimeVolume: formatUnits(BigInt(pool.allTimeVolumeA)),
          allTimeFee: formatUnits(BigInt(pool.allTimeFeesA)),
          reserve: formatUnits(BigInt(pool.reserveA)),
        },
        tokenB: {
          name: pool.tokenB.name,
          ticker: pool.tokenB.symbol,
          contractAddress: pool.tokenB.tokenAddress,
          allTimeVolume: formatUnits(BigInt(pool.allTimeVolumeB)),
          allTimeFee: formatUnits(BigInt(pool.allTimeFeesB)),
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
    maxSlippage: number,
  ): Promise<TransactionResponse> {
    const [formattedAmountA, formattedAmountB] = [parseUnits(amountTokenA), parseUnits(amountTokenB)];

    const poolContract = new Contract(await poolAddress, ABI.ERC20_SWAP, signer);
    const tokenAContract = new Contract(await tokenA, ABI.ERC20TOKEN, signer);
    const tokenBContract = new Contract(await tokenB, ABI.ERC20TOKEN, signer);

    const amountAMin = (BigInt(formattedAmountA) * BigInt(10000 - maxSlippage * 100)) / BigInt(10000);
    const amountBMin = (BigInt(formattedAmountB) * BigInt(10000 - maxSlippage * 100)) / BigInt(10000);

    const approveTokenATx: TransactionResponse = await tokenAContract.approve(poolAddress, formattedAmountA);
    await approveTokenATx.wait();

    const approveTokenBTx: TransactionResponse = await tokenBContract.approve(poolAddress, formattedAmountB);
    await approveTokenBTx.wait();

    const tx: TransactionResponse = await poolContract.addLiquidity(formattedAmountA, formattedAmountB, amountAMin, amountBMin);
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

    const approveLpTokenTx: TransactionResponse = await lpTokenContract.approve(await poolAddress, lpTokensToWithdraw);
    await approveLpTokenTx.wait();

    const tx: TransactionResponse = await poolContract.removeLiquidity(lpTokensToWithdraw);
    return tx;
  }

  public async getPoolActivity(poolAddress: string): Promise<PoolActivity[]> {
    const res = await executeGraphQLQuery<GetPoolsActivityResponse[]>(
      "poolTransactions",
      GET_POOL_ACTIVITY(poolAddress),
      {
        tags: [TAGS.getPoolActivity(poolAddress)],
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
        reserveA: formatUnits(BigInt(tx.reserveA)),
        reserveB: formatUnits(BigInt(tx.reserveB)),
        feesA: formatUnits(BigInt(tx.feesA)),
        feesB: formatUnits(BigInt(tx.feesB)),
        lpTokenAmount: formatUnits(BigInt(tx.lpTokenAmount)),
      };
    });
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
        reserveA: formatUnits(BigInt(tx.reserveA)),
        reserveB: formatUnits(BigInt(tx.reserveB)),
        feesA: formatUnits(BigInt(tx.feesA)),
        feesB: formatUnits(BigInt(tx.feesB)),
        lpTokenAmount: formatUnits(BigInt(tx.lpTokenAmount)),
      };
    });
  }

  public async getPoolInfo(poolAddress: string): Promise<PoolInfo> {
    const pool = await executeGraphQLQuery<GetAllPoolsResponse>(
      "pool",
      GET_POOL_INFO(poolAddress),
      {
        tags: [TAGS.getPoolInfo(poolAddress)],
      },
      "no-cache",
    );

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
        allTimeVolume: formatUnits(BigInt(pool.allTimeVolumeA)),
        allTimeFee: formatUnits(BigInt(pool.allTimeFeesA)),
        reserve: formatUnits(BigInt(pool.reserveA)),
      },
      tokenB: {
        name: pool.tokenB.name,
        ticker: pool.tokenB.symbol,
        contractAddress: pool.tokenB.tokenAddress,
        allTimeVolume: formatUnits(BigInt(pool.allTimeVolumeB)),
        allTimeFee: formatUnits(BigInt(pool.allTimeFeesB)),
        reserve: formatUnits(BigInt(pool.reserveB)),
      },
    };
  }

  public async getAmountOutOnSwap(pool: PoolInfo, tokenIn: AddressLike, amountIn: number): Promise<GetAmountOutOnSwap> {
    const poolContract = new Contract(pool.poolAddress, ABI.ERC20_SWAP, rpcProvider);

    const formattedAmountIn = BigInt(parseUnits(amountIn));

    const [tokenOut, amountOut] = await poolContract.getAmountOut(formattedAmountIn, await tokenIn);

    let estimatedFeeEth = 0.005;

    //////////////////////// Estimate fee for Swap transaction ////////////////////////

    try {
      // Populate tx (don't send yet)
      const unsignedTx = await poolContract.swap.populateTransaction(tokenIn, formattedAmountIn, 0);
      unsignedTx.from = pool.poolAddress;

      // Estimate gas
      const gasEstimate = await rpcProvider.estimateGas(unsignedTx);

      // Get gas price (EIP-1559 compatible)
      const feeData = await rpcProvider.getFeeData();
      const gasPrice = BigInt(feeData.gasPrice ?? feeData.maxFeePerGas ?? 0); // fallback

      const estimatedFeeWei = gasEstimate * gasPrice;
      estimatedFeeEth = formatUnits(estimatedFeeWei);
    } catch {}

    //////////////////////// /////////////////////////////////// //////////////////////

    return {
      fee: {
        amount: formatUnits((formattedAmountIn * BigInt(pool.feeTier)) / BigInt(10000)),
        token: pool.tokenA.contractAddress === tokenIn ? pool.tokenA : pool.tokenB,
      },
      tokenOut,
      amountOut: formatUnits(BigInt(amountOut)),
      estimatedSwapTxFee: estimatedFeeEth,
    };
  }

  public async swap(
    signer: JsonRpcSigner,
    poolAddress: AddressLike,
    tokenIn: AddressLike,
    amountIn: number,
    maxSlippage: number,
  ): Promise<TransactionResponse> {
    const formattedAmountIn = parseUnits(amountIn);

    const [poolContract, tokenInContract] = await Promise.all([
      new Contract(await poolAddress, ABI.ERC20_SWAP, signer),
      new Contract(await tokenIn, ABI.ERC20TOKEN, signer),
    ]);

    const [, formattedAmountOut] = await poolContract.getAmountOut(formattedAmountIn, await tokenIn);

    const minAmountOut = (BigInt(formattedAmountOut) * BigInt(10000 - maxSlippage * 100)) / BigInt(10000);

    const approveTokenInTx: TransactionResponse = await tokenInContract.approve(poolAddress, formattedAmountIn);
    await approveTokenInTx.wait();

    const tx: TransactionResponse = await poolContract.swap(tokenIn, formattedAmountIn, minAmountOut);
    return tx;
  }
}
