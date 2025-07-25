export const GET_ALL_TOKENS = `{
  erc20Tokens {
    id
    name
    symbol
    timestamp
    tokenAddress
    transactionHash
  }
}`;

export const GET_ALL_FAUCETS_METADATA = `{
  faucets {
    id
    faucetAddress
    tokenAddress
    lockTime
    withdrawalAmount
    timestamp
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

export const GET_FAUCET_TRANSACTIONS = `{
  transfers(
    orderBy: timestamp
    where: {eventType: "Faucet"}
    orderDirection: desc
    first: 10
  ) {
    amount
    eventType
    from
    id
    timestamp
    to
    transactionHash
    token {
      name
      symbol
      tokenAddress
    }
  }
}`;
