const IN_PRODUCTION = process.env.NODE_ENV === "production";

export const CONFIG = {
  REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string,
  GRAPHQL_API_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL as string,
  FAUCET_RELAYER_PRIVATE_KEY: process.env.NEXT_PUBLIC_FAUCET_RELAYER_PRIVATE_KEY as string,
  IN_PRODUCTION,
};
