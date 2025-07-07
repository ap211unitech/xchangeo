import { CONFIG } from "@/config";

import { RpcProvider } from "./rpc";
import { TokenService } from "./token";

export const appService = { tokenService: new TokenService() };
export const rpcProvider = RpcProvider.getProvider(CONFIG.RPC_URL);
