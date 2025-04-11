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
    uint private constant fee = 30; // fee is in basis points: 30 = 0.3%, 1000 = 10%

    uint256 private reserve1;
    uint256 private reserve2;

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

        lpToken = new LpToken(_lpTokenName, _lpTokenSymbol, _lpTokenLogo);
    }

    function _updateReserves(uint256 _reserve1, uint256 _reserve2) internal {
        reserve1 = _reserve1;
        reserve2 = _reserve2;
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
            revert ERC20SwapPool__ZeroLiquidityToken(
                "Can not mint 0 LP tokens"
            );
        }

        lpToken.mint(msg.sender, mintingLpTokens);

        // Update Reserves/Liquidity
        uint256 new_reserve1 = reserve_1 + amountToken1;
        uint256 new_reserve2 = reserve_2 + amountToken2;
        _updateReserves(new_reserve1, new_reserve2);

        // Emit event
        emit LiquidityAdded(
            address(this),
            address(token1),
            address(token2),
            amountToken1,
            amountToken2,
            mintingLpTokens,
            new_reserve1,
            new_reserve2,
            block.timestamp,
            msg.sender
        );

        return mintingLpTokens;
    }

    /******************** Getters ********************/
    function getAmountOut(
        uint256 amountIn,
        address tokenIn
    ) public view returns (uint256, uint256, uint256, bool) {
        if (!(address(token1) == tokenIn || address(token2) == tokenIn)) {
            revert ERC20SwapPool__InvalidTokenAddress("Invalid token");
        }

        bool isToken1 = address(token1) == tokenIn;
        (uint256 reserve_1, uint256 reserve_2) = getReserves();

        // xy = k
        // (x + dx.(1-f))(y - dy) = k
        // dy = y.dx.(1-f)/(x+dx.(1-f))

        // since fee in basis points

        //                y.dx.(100_00 - f)
        // so, dy = ------------------------------
        //           (100_00.x + dx.(100_00 - f))

        uint256 amountInWithFee = (amountIn * (10000 - fee));

        (uint256 resIn, uint256 resOut) = isToken1
            ? (reserve_1, reserve_2)
            : (reserve_2, reserve_1);

        uint256 numerator = resOut * amountInWithFee;
        uint256 denominator = (10000 * resIn) + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        return (amountOut, resIn, resOut, isToken1);
    }

    function getTokens() public view returns (address, address) {
        return (address(token1), address(token2));
    }

    function getReserves() public view returns (uint256, uint256) {
        return (reserve1, reserve2);
    }

    function getFee() external pure returns (uint) {
        return fee;
    }
}
