import { GET_ALL_POOLS, TAGS } from "@/constants";
import { executeGraphQLQuery } from "@/lib/utils";
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
          reserve: +pool.reserveA,
        },
        tokenB: {
          name: pool.tokenB.name,
          ticker: pool.tokenB.symbol,
          contractAddress: pool.tokenB.tokenAddress,
          // TODO: Add this later
          allTimeVolume: 0,
          reserve: +pool.reserveB,
        },
      };
    });
  }
}
