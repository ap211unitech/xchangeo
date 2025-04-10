// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IERC20SwapPool {
    error ERC20SwapPool__InvalidTokenAddress(string description);

    error ERC20SwapPool__FeeMoreThanThreshold(string description);

    error ERC20SwapPool__OverflowInRatioCheck(string description);

    error ERC20SwapPool__InvalidTokenRatio(string description);

    error ERC20SwapPool__MintingLpTokensTooLess(string description);

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

    function addLiquidity(
        uint256 _amountTokenA,
        uint256 _amountTokenB
    ) external returns (uint256);

    function getTokens() external view returns (address, address);

    function getReserves() external view returns (uint256, uint256);

    function getFee() external pure returns (uint);
}
