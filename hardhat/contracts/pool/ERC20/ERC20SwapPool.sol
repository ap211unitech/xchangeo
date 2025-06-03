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

    function swap(
        address _tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant returns (bool) {
        if (amountIn == 0) {
            revert ERC20SwapPool__InvalidAmount(
                "Amount must be greater than zero"
            );
        }

        (
            ,
            uint256 amountOut,
            uint256 reserveIn,
            uint256 reserveOut,
            bool isToken1
        ) = getAmountOut(amountIn, _tokenIn);

        // Handle Slippage
        if (amountOut < minAmountOut) {
            revert ERC20SwapPool__Slippage("Slippage: amountOut too low");
        }

        if (reserveIn == 0 || reserveOut == 0) {
            revert ERC20SwapPool__InsufficientReserves("Pool is empty");
        }

        (
            uint256 new_reserve1,
            uint new_reserve2,
            ERC20Token tokenIn,
            ERC20Token tokenOut
        ) = isToken1
                ? (reserveIn + amountIn, reserveOut - amountOut, token1, token2)
                : (
                    reserveOut - amountOut,
                    reserveIn + amountIn,
                    token2,
                    token1
                );

        // Transfer input token amount to pool
        bool success = tokenIn.transferFrom(
            msg.sender,
            address(this),
            amountIn
        );
        if (!success) {
            revert ERC20SwapPool__TransferFailed(
                "Swap failed: Can not transfer input amount to pool"
            );
        }

        _updateReserves(new_reserve1, new_reserve2);

        // Transfer amountOut to user
        success = tokenOut.transfer(msg.sender, amountOut);
        if (!success) {
            revert ERC20SwapPool__TransferFailed(
                "Swap failed: Can not transfer output amount to user"
            );
        }

        // Emit event
        emit TokenSwapped(
            address(this),
            address(tokenIn),
            address(tokenOut),
            amountIn,
            amountOut,
            new_reserve1,
            new_reserve2,
            block.timestamp,
            msg.sender
        );

        return true;
    }

    function addLiquidity(
        uint256 amountToken1,
        uint256 amountToken2
    ) external nonReentrant returns (uint256) {
        if (amountToken1 == 0 || amountToken2 == 0) {
            revert ERC20SwapPool__InvalidAmount(
                "Amount must be greater than zero"
            );
        }

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

    function removeLiquidity(
        uint256 liquidityPoolTokens
    )
        external
        nonReentrant
        returns (uint256 amountTokenA, uint256 amountTokenB)
    {
        if (liquidityPoolTokens == 0) {
            revert ERC20SwapPool__InvalidAmount("Zero Liquidity Tokens");
        }

        (amountTokenA, amountTokenB) = getAmountsOnRemovingLiquidity(
            liquidityPoolTokens
        );

        (uint256 reserve_1, uint256 reserve_2) = getReserves();

        if (amountTokenA == 0 || amountTokenB == 0) {
            revert ERC20SwapPool__InvalidAmount("Calculated zero amounts");
        }

        if (amountTokenA > reserve_1 || amountTokenB > reserve_2) {
            revert ERC20SwapPool__InsufficientReserves("Insufficient Reserves");
        }

        // Burn LP tokens from the user
        lpToken.burnFrom(msg.sender, liquidityPoolTokens);

        // Update reserves after burning
        uint256 new_reserve1 = reserve_1 - amountTokenA;
        uint256 new_reserve2 = reserve_2 - amountTokenB;
        _updateReserves(new_reserve1, new_reserve2);

        // Transfer tokens to user
        token1.transfer(msg.sender, amountTokenA);
        token2.transfer(msg.sender, amountTokenB);

        // Emit event
        emit LiquidityRemoved(
            address(this),
            address(token1),
            address(token2),
            liquidityPoolTokens,
            amountTokenA,
            amountTokenB,
            new_reserve1,
            new_reserve2,
            block.timestamp,
            msg.sender
        );
    }

    /******************** Getters ********************/
    function getAmountOut(
        uint256 amountIn,
        address tokenIn
    ) public view returns (address, uint256, uint256, uint256, bool) {
        if (!(address(token1) == tokenIn || address(token2) == tokenIn)) {
            revert ERC20SwapPool__InvalidTokenAddress("Invalid token");
        }

        bool isToken1 = address(token1) == tokenIn;
        (uint256 reserve_1, uint256 reserve_2) = getReserves();

        address tokenOut = isToken1 ? address(token2) : address(token1);

        (uint256 resIn, uint256 resOut) = isToken1
            ? (reserve_1, reserve_2)
            : (reserve_2, reserve_1);

        // xy = k
        // (x + dx.(1-f))(y - dy) = k
        // dy = y.dx.(1-f)/(x+dx.(1-f))

        // since fee in basis points

        //                y.dx.(100_00 - f)
        // so, dy = ------------------------------
        //           (100_00.x + dx.(100_00 - f))

        uint256 amountInWithFee = (amountIn * (10000 - fee));

        uint256 numerator = resOut * amountInWithFee;
        uint256 denominator = (10000 * resIn) + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        return (tokenOut, amountOut, resIn, resOut, isToken1);
    }

    function getAmountsOnRemovingLiquidity(
        uint256 liquidityPoolTokens
    ) public view returns (uint256 amountTokenA, uint256 amountTokenB) {
        if (liquidityPoolTokens == 0) {
            revert ERC20SwapPool__InvalidAmount("Zero Liquidity Tokens");
        }

        // t = totalSupply of liquidity pool tokens
        // s = liquidityPoolTokens
        // l = liquidity (reserve0 || reserve1)
        // dl = liquidity to be removed (amount0 || amount1)

        // The change in liquidity/token reserves should be proportional to shares burned
        //        l.s
        // dl = -------
        //         t

        (uint256 reserve_1, uint256 reserve_2) = getReserves();
        uint256 totalSupply = lpToken.totalSupply();

        amountTokenA = reserve_1.mulDiv(liquidityPoolTokens, totalSupply);
        amountTokenB = reserve_2.mulDiv(liquidityPoolTokens, totalSupply);
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
