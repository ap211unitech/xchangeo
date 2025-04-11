// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IERC20SwapPool {
    /// @notice Thrown when a provided token address is invalid
    /// @param description A message describing the reason for the error
    error ERC20SwapPool__InvalidTokenAddress(string description);

    /// @notice Thrown when the specified fee exceeds the maximum allowed threshold
    /// @param description A message describing the reason for the error
    error ERC20SwapPool__FeeMoreThanThreshold(string description);

    /// @notice Thrown when an overflow occurs during ratio validation or calculation
    /// @param description A message describing the reason for the error
    error ERC20SwapPool__OverflowInRatioCheck(string description);

    /// @notice Thrown when the token ratio provided is invalid or unbalanced
    /// @param description A message describing the reason for the error
    error ERC20SwapPool__InvalidTokenRatio(string description);

    /// @notice Thrown when liquidity tokens need to be minted is zero
    /// @param description A message describing the reason for the error
    error ERC20SwapPool__ZeroLiquidityToken(string description);

    /// @notice Emitted when liquidity is successfully added to the swap pool
    /// @param pool The address of the swap pool
    /// @param token1 The address of the first ERC20 token
    /// @param token2 The address of the second ERC20 token
    /// @param tokenAmount1 The amount of token1 added to the pool
    /// @param tokenAmount2 The amount of token2 added to the pool
    /// @param mintedLpTokens The amount of LP tokens minted for the liquidity provider i.e. sender
    /// @param reserveToken1 The updated reserve amount of token1 in the pool
    /// @param reserveToken2 The updated reserve amount of token2 in the pool
    /// @param timestamp The block timestamp when liquidity was added
    /// @param sender The address of the user who added the liquidity
    event LiquidityAdded(
        address indexed pool,
        address indexed token1,
        address indexed token2,
        uint256 tokenAmount1,
        uint256 tokenAmount2,
        uint256 mintedLpTokens,
        uint256 reserveToken1,
        uint256 reserveToken2,
        uint256 timestamp,
        address sender
    );

    /// @notice Adds liquidity to the pool with specified token amounts
    /// @dev Transfers the specified amounts of token A and token B from the sender to the pool and mints LP tokens in return
    /// @param _amountTokenA The amount of token A to add to the pool
    /// @param _amountTokenB The amount of token B to add to the pool
    /// @return mintedLpTokens The amount of LP tokens minted for the added liquidity
    function addLiquidity(
        uint256 _amountTokenA,
        uint256 _amountTokenB
    ) external returns (uint256 mintedLpTokens);

    /// @notice Calculates the output amount for a given input token and amount
    /// @dev Uses the current reserves and fee to determine the amount of the other token returned
    /// @param amountIn The amount of input token to be swapped
    /// @param tokenIn The address of the input token
    /// @return tokenOut The address of the output token
    /// @return amountOut The calculated amount of the output token
    /// @return reserveIn The reserve amount of the input token in the pool
    /// @return reserveOut The reserve amount of the output token in the pool
    /// @return isToken1 A boolean indicating whether the tokenIn is first token
    function getAmountOut(
        uint256 amountIn,
        address tokenIn
    )
        external
        view
        returns (
            address tokenOut,
            uint256 amountOut,
            uint256 reserveIn,
            uint256 reserveOut,
            bool isToken1
        );

    /// @notice Returns the addresses of the two tokens in the pool
    /// @return tokenA The address of token A
    /// @return tokenB The address of token B
    function getTokens() external view returns (address tokenA, address tokenB);

    /// @notice Returns the current reserves of token A and token B in the pool
    /// @return reserveA The reserve amount of token A
    /// @return reserveB The reserve amount of token B
    function getReserves()
        external
        view
        returns (uint256 reserveA, uint256 reserveB);

    /// @notice Returns the swap fee applied on each trade in the pool
    /// @dev This is a constant value and does not require storage lookup
    /// @return fee The fee value as a percentage (e.g., 30 for 0.3%)
    function getFee() external pure returns (uint);
}
