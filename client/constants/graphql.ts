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

export const GET_ALL_POOLS = `{
  pools {
    fee
    id
    pool
    reserveA
    reserveB
    allTimeVolumeA
    allTimeVolumeB
    allTimeFeesA
    allTimeFeesB
    lpToken {
      id
      name
      symbol
      tokenAddress
    }
    tokenA {
      id
      name
      symbol
      tokenAddress
    }
    tokenB {
      id
      name
      symbol
      tokenAddress
    }
  }
}`;

export const GET_POOLS_ACTIVITY = `{
  poolTransactions(
    orderBy: timestamp
    orderDirection: desc
    first: 50
  ) {
    amountA
    amountB
    eventType
    id
    sender
    timestamp
    tokenA {
      name
      symbol
      tokenAddress
    }
    tokenB {
      name
      symbol
      tokenAddress
    }
    reserveA
    reserveB
    feesA
    feesB
    lpTokenAmount
    transactionHash
  }
}`;

export const GET_POOL_ACTIVITY = (poolAddress: string) => `{
  poolTransactions(
    where: {pool_: {pool: "${poolAddress}"}},
    orderBy: timestamp,
    orderDirection: desc,
    first: 500
  ) {
    amountA
    amountB
    eventType
    id
    sender
    timestamp
    tokenA {
      name
      symbol
      tokenAddress
    }
    tokenB {
      name
      symbol
      tokenAddress
    }
    reserveA
    reserveB
    feesA
    feesB
    lpTokenAmount
    transactionHash
  }
}`;

export const GET_POOL_INFO = (poolAddress: string) => `{
  pool(id: "${poolAddress}") {
    fee
    id
    pool
    reserveA
    reserveB
    allTimeVolumeA
    allTimeVolumeB
    allTimeFeesA
    allTimeFeesB
    lpToken {
      id
      name
      symbol
      tokenAddress
    }
    tokenA {
      id
      name
      symbol
      tokenAddress
    }
    tokenB {
      id
      name
      symbol
      tokenAddress
    }
  }
}`;
