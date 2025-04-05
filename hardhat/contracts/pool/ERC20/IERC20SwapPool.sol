// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IERC20SwapPool {
    error ERC20SwapPool__InvalidTokenAddress(string description);

    error ERC20SwapPool__FeeMoreThanThreshold(string description);

    function getTokens() external view returns (address, address);

    function getReserves() external view returns (uint256, uint256);

    function getFee() external view returns (uint);
}
