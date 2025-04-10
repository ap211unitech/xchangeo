// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import {ERC20Token} from "../../token/Token.sol";
import {LpToken} from "../../token/LpToken.sol";
import "./IERC20SwapPool.sol";

contract ERC20SwapPool is IERC20SwapPool, ReentrancyGuard {
    using Math for uint256;

    ERC20Token private immutable token1;
    ERC20Token private immutable token2;
    LpToken private immutable lpToken;
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

    function addLiquidity(
        uint256 amountToken1,
        uint256 amountToken2
    ) external nonReentrant returns (uint256) {
        (uint256 reserve_1, uint256 reserve_2) = getReserves();

        if (reserve_1 > 0 || reserve_2 > 0) {
            // This check must exist inorder to prevent price impact on adding liquidity
            /*****
                 reserve_1      amountToken1
                ------------ = --------------
                 reserver_2     amountToken2
            /******/

            (bool successLeft, uint256 leftSide) = reserve_1.tryMul(
                amountToken2
            );
            (bool successRight, uint256 rightSide) = amountToken1.tryMul(
                reserve_2
            );

            if (!(successLeft && successRight)) {
                revert ERC20SwapPool__OverflowInRatioCheck(
                    "Overflow in ratio check"
                );
            }

            if (leftSide != rightSide) {
                revert ERC20SwapPool__InvalidTokenRatio("Invalid token ratio");
            }
        }

        // Transfer tokens to pool
        token1.transferFrom(msg.sender, address(this), amountToken1);
        token2.transferFrom(msg.sender, address(this), amountToken2);

        uint256 mintingLpTokens = 0;
        uint256 totalSupply = lpToken.totalSupply();

        // Mint LP tokens
        if (totalSupply == 0) {
            mintingLpTokens = Math.sqrt(amountToken1 * amountToken2);
        } else {
            mintingLpTokens = Math.min(
                (amountToken1 * totalSupply) / reserve_1,
                (amountToken2 * totalSupply) / reserve_2
            );
        }

        if (mintingLpTokens == 0) {
            revert ERC20SwapPool__MintingLpTokensTooLess(
                "Can not mint 0 LP tokens"
            );
        }

        lpToken.mint(msg.sender, mintingLpTokens);

        emit LiquidityAdded(
            address(this),
            address(token1),
            address(token2),
            amountToken1,
            amountToken2,
            mintingLpTokens,
            token1.balanceOf(address(this)),
            token2.balanceOf(address(this)),
            block.timestamp,
            msg.sender
        );

        return mintingLpTokens;
    }

    /******************** Getters ********************/
    function getTokens() public view returns (address, address) {
        return (address(token1), address(token2));
    }

    function getReserves() public view returns (uint256, uint256) {
        return (
            token1.balanceOf(address(this)),
            token2.balanceOf(address(this))
        );
    }

    function getFee() external view returns (uint) {
        return fee;
    }
}
