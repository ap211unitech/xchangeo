import BN from "bignumber.js";
import { AddressLike, Contract, Eip1193Provider, TransactionResponse } from "ethers";

import { ABI, GET_ALL_POOLS, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits, getAmountOnAddingLiquidity, getSigner, parseUnits } from "@/lib/utils";
import { PoolInfo } from "@/types";

import { GetAllPoolsResponse, IPoolService } from "./types";

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

  public async addLiquidity(
    wallet: Eip1193Provider,
    poolAddress: AddressLike,
    tokenA: AddressLike,
    tokenB: AddressLike,
    amountTokenA: number,
    amountTokenB: number,
  ): Promise<TransactionResponse> {
    const signer = await getSigner(wallet);

    const [formattedAmountA, formattedAmountB] = [new BN(parseUnits(amountTokenA)), new BN(parseUnits(amountTokenB))];

    const poolContract = new Contract(await poolAddress, ABI.ERC20_SWAP, signer);
    const tokenAContract = new Contract(await tokenA, ABI.ERC20TOKEN, signer);
    const tokenBContract = new Contract(await tokenB, ABI.ERC20TOKEN, signer);

    let [reserveA, reserveB] = await poolContract.getReserves();
    [reserveA, reserveB] = [new BN(reserveA), new BN(reserveB)];

    const derivedAmountTokenA = formattedAmountA;
    const derivedAmountTokenB = getAmountOnAddingLiquidity(reserveA, reserveB, formattedAmountA, formattedAmountB, true);

    await tokenAContract.approve(poolAddress, derivedAmountTokenA.toString());
    await tokenBContract.approve(poolAddress, derivedAmountTokenB.toString());

    const tx: TransactionResponse = await poolContract.addLiquidity(derivedAmountTokenA.toString(), derivedAmountTokenB.toString());
    return tx;
  }
}
