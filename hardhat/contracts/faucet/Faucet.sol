// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./IFaucet.sol";

contract ERC20Faucet is IERC20Faucet, Ownable, ReentrancyGuard {
    IERC20 private token;
    uint256 private lockTime;
    uint256 private withdrawalAmount;

    mapping(address => uint256) private nextAccessTime;

    constructor(
        address _tokenAddress,
        uint256 _lockTime,
        uint256 _withdrawalAmount
    ) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
        lockTime = _lockTime;
        withdrawalAmount = _withdrawalAmount;
        emit Faucet__Created(
            address(this),
            address(token),
            lockTime,
            withdrawalAmount,
            block.timestamp
        );
    }

    function requestTokens(
        address recipientAddress
    ) external nonReentrant returns (bool) {
        if (recipientAddress == address(0)) {
            revert Faucet__InvalidAddress(
                address(token),
                recipientAddress,
                "Recipient must not be a zero account"
            );
        }

        uint256 availableFunds = token.balanceOf(address(this));

        if (availableFunds < withdrawalAmount) {
            revert Faucet__InsufficientFunds(
                address(token),
                withdrawalAmount,
                availableFunds,
                "Insufficient funds in faucet for withdrawal request"
            );
        }

        if (nextAccessTime[recipientAddress] > block.timestamp) {
            revert Faucet__InsufficientTimeElapsed(
                address(token),
                nextAccessTime[recipientAddress],
                lockTime,
                block.timestamp,
                "Insufficient time elapsed since last withdrawal - try again later."
            );
        }

        nextAccessTime[recipientAddress] = block.timestamp + lockTime;
        token.transfer(recipientAddress, withdrawalAmount);

        emit Faucet__ReceivedFunds(
            address(this),
            recipientAddress,
            withdrawalAmount,
            block.timestamp
        );

        return true;
    }

    function withdraw() external nonReentrant onlyOwner returns (bool) {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Faucet__Withdraw(
            address(this),
            msg.sender,
            token.balanceOf(address(this))
        );
        return true;
    }

    function setWithdrawalAmount(
        uint256 _withdrawalAmount
    ) external nonReentrant onlyOwner {
        withdrawalAmount = _withdrawalAmount;
    }

    function setLockTime(uint256 _lockTime) external nonReentrant onlyOwner {
        lockTime = _lockTime;
    }

    /******************** Getters ********************/
    function getToken() external view returns (address) {
        return address(token);
    }

    function getLockTime() external view returns (uint256) {
        return lockTime;
    }

    function getWithdrawalAmount() external view returns (uint256) {
        return withdrawalAmount;
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getNextAccessTime(address user) external view returns (uint256) {
        return (nextAccessTime[user]);
    }
}
