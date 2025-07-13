export const GET_ALL_TOKENS = `{
  erc20Tokens {
    id
    name
    symbol
    timestamp
    tokenAddress
    blockNumber
  }
}`;

export const GET_FAUCET_METADATA = (tokenAddress: string) => `{
  faucets(where: { tokenAddress: "${tokenAddress}" }) {
    id
    faucetAddress
    tokenAddress
    lockTime
    withdrawalAmount
    timestamp
  }
}`;
