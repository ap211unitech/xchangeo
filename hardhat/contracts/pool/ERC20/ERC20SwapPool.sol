// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {ERC20Token} from "../../token/Token.sol";
import {LpToken} from "../../token/LpToken.sol";
import "./IERC20SwapPool.sol";

contract ERC20SwapPool is IERC20SwapPool, ReentrancyGuard {
    ERC20Token private token1;
    ERC20Token private token2;
    LpToken private lpToken;
    uint private fee; // if 100, it means 1%

    constructor(
        address _token1,
        address _token2,
        uint _fee,
        string memory _lpTokenName,
        string memory _lpTokenSymbol,
        string memory _lpTokenLogo
    ) {
        if (_token1 == address(0) || _token2 == address(0))
            revert ERC20SwapPool__InvalidTokenAddress("Invalid Token Address");

        // Fee cannot be more than 2%
        if (_fee > 200)
            revert ERC20SwapPool__FeeMoreThanThreshold(
                "Fee cannot be more than 2%"
            );

        token1 = ERC20Token(_token1);
        token2 = ERC20Token(_token2);
        fee = _fee;

        lpToken = new LpToken(_lpTokenName, _lpTokenSymbol, _lpTokenLogo);
    }

    /******************** Getters ********************/
    function getTokens() public view returns (address, address) {
        return (address(token1), address(token2));
    }

    function getReserves() external view returns (uint256, uint256) {
        return (
            token1.balanceOf(address(this)),
            token2.balanceOf(address(this))
        );
    }

    function getFee() external view returns (uint) {
        return fee;
    }
}
