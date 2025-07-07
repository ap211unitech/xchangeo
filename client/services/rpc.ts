import { JsonRpcProvider } from "ethers";

export class RpcProvider {
  private static instance: JsonRpcProvider | null = null;

  private constructor() {}

  public static getProvider(rpcUrl: string): JsonRpcProvider {
    if (!RpcProvider.instance) {
      RpcProvider.instance = new JsonRpcProvider(rpcUrl);
    }
    return RpcProvider.instance;
  }
}
