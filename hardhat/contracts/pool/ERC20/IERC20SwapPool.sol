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

    /// @notice Thrown when a token transfer fails within the ERC20SwapPool contract
    /// @param description A message providing details about the reason for the transfer failure
    error ERC20SwapPool__TransferFailed(string description);

    /// @notice Thrown when an invalid amount is passed to the function (e.g., zero input)
    /// @param description A message providing details about the invalid amount condition
    error ERC20SwapPool__InvalidAmount(string description);

    /// @notice Thrown when the calculated output amount is less than the minimum expected due to slippage
    /// @param description A message explaining the slippage condition that caused the swap to fail
    error ERC20SwapPool__Slippage(string description);

    /// @notice Thrown when a swap or liquidity removal is attempted but the pool has insufficient reserves
    /// @param description A descriptive message explaining the context of the insufficient reserves
    error ERC20SwapPool__InsufficientReserves(string description);

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

    /// @notice Emitted when liquidity is removed from a pool
    /// @param pool The address of the liquidity pool
    /// @param token1 The address of token A in the pool
    /// @param token2 The address of token B in the pool
    /// @param liquidityPoolTokens The amount of LP tokens burned
    /// @param tokenAmount1 The amount of token A returned to the user
    /// @param tokenAmount2 The amount of token B returned to the user
    /// @param reserveToken1 The new reserve amount of token A in the pool after removal
    /// @param reserveToken2 The new reserve amount of token B in the pool after removal
    /// @param timestamp The time at which the liquidity was removed
    /// @param sender The address that initiated the liquidity removal
    event LiquidityRemoved(
        address indexed pool,
        address indexed token1,
        address indexed token2,
        uint256 liquidityPoolTokens,
        uint256 tokenAmount1,
        uint256 tokenAmount2,
        uint256 reserveToken1,
        uint256 reserveToken2,
        uint256 timestamp,
        address sender
    );

    /// @notice Emitted when a token swap is successfully executed in the liquidity pool
    /// @param pool The address of the liquidity pool where the swap occurred
    /// @param tokenIn The address of the token that was sent into the pool
    /// @param tokenOut The address of the token received from the pool
    /// @param amountIn The amount of input token provided by the sender
    /// @param amountOut The amount of output token returned to the sender
    /// @param reserveToken1 The updated reserve of token1 in the pool after the swap
    /// @param reserveToken2 The updated reserve of token2 in the pool after the swap
    /// @param timestamp The block timestamp when the swap occurred
    /// @param sender The address that initiated the swap
    event TokenSwapped(
        address pool,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 reserveToken1,
        uint256 reserveToken2,
        uint256 timestamp,
        address indexed sender
    );

    /// @notice Swaps a specified amount of input token for the corresponding output token in the pool
    /// @dev Transfers the input token from the sender to the pool and sends back the calculated amount of output token
    /// @param _tokenIn The address of the token being sent into the pool
    /// @param _amountIn The amount of the input token to swap
    /// @return success A boolean indicating whether the swap was successful
    function swap(
        address _tokenIn,
        uint256 _amountIn,
        uint256 minAmountOut
    ) external returns (bool);

    /// @notice Adds liquidity to the pool with specified token amounts
    /// @dev Transfers the specified amounts of token A and token B from the sender to the pool and mints LP tokens in return
    /// @param _amountTokenA The amount of token A to add to the pool
    /// @param _amountTokenB The amount of token B to add to the pool
    /// @return mintedLpTokens The amount of LP tokens minted for the added liquidity
    function addLiquidity(
        uint256 _amountTokenA,
        uint256 _amountTokenB
    ) external returns (uint256 mintedLpTokens);

    /// @notice Removes liquidity from the pool by burning LP tokens
    /// @dev Burns the specified amount of LP tokens and transfers the corresponding amounts of token A and token B back to the sender
    /// @param liquidityPoolTokens The amount of LP tokens to burn in order to withdraw liquidity
    /// @return amountTokenA The amount of token A returned to the sender
    /// @return amountTokenB The amount of token B returned to the sender
    function removeLiquidity(
        uint256 liquidityPoolTokens
    ) external returns (uint256 amountTokenA, uint256 amountTokenB);

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

    /// @notice Calculates the amount of underlying tokens returned upon removing a given amount of liquidity
    /// @dev Returns the estimated amounts of token A and token B corresponding to the specified LP tokens
    /// @param liquidityPoolTokens The amount of LP tokens to be removed
    /// @return amountTokenA The estimated amount of token A returned
    /// @return amountTokenB The estimated amount of token B returned
    function getAmountsOnRemovingLiquidity(
        uint256 liquidityPoolTokens
    ) external view returns (uint256 amountTokenA, uint256 amountTokenB);

    /// @notice Returns the addresses of the two tokens in the pool
    /// @return tokenA The address of token A
    /// @return tokenB The address of token B
    function getTokens() external view returns (address tokenA, address tokenB);

    /// @notice Returns the address of the LP token
    /// @return lpToken The address of LP token
    function getLpToken() external view returns (address);

    /// @notice Returns the current reserves of token A and token B in the pool
    /// @return reserveA The reserve amount of token A
    /// @return reserveB The reserve amount of token B
    function getReserves()
        external
        view
        returns (uint256 reserveA, uint256 reserveB);

    /// @notice Returns the swap fee applied on each trade in the pool
    /// @return fee The fee value as a percentage (e.g., 30 for 0.3%)
    function getFee() external view returns (uint);
}
