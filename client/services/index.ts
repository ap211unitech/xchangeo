import { CONFIG } from "@/config";

import { FaucetService } from "./faucet";
import { PoolService } from "./pool";
import { RpcProvider } from "./rpc";
import { TokenService } from "./token";

class AppService {
  private static instance: {
    tokenService: TokenService;
    faucetService: FaucetService;
    poolService: PoolService;
  } | null = null;

  private constructor() {}

  public static init() {
    if (!AppService.instance) {
      AppService.instance = {
        tokenService: new TokenService(),
        faucetService: new FaucetService(),
        poolService: new PoolService(),
      };
    }
    return AppService.instance;
  }
}

export const appService = AppService.init();
export const rpcProvider = RpcProvider.getProvider(CONFIG.RPC_URL);
