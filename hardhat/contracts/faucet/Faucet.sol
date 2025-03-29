// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./IFaucet.sol";

contract ERC20Faucet is IERC20Faucet, Ownable {
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
    }

    function requestTokens() external returns (bool) {
        if (msg.sender == address(0)) {
            revert Faucet__InvalidSender(
                address(token),
                msg.sender,
                "Request must not originate from a zero account"
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

        if (nextAccessTime[msg.sender] > block.timestamp) {
            revert Faucet__InsufficientTimeElapsed(
                address(token),
                nextAccessTime[msg.sender],
                lockTime,
                block.timestamp,
                "Insufficient time elapsed since last withdrawal - try again later."
            );
        }

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        token.transfer(msg.sender, withdrawalAmount);

        emit Faucet__ReceivedFunds(address(this), msg.sender, withdrawalAmount);

        return true;
    }

    function withdraw() external onlyOwner returns (bool) {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Faucet__Withdraw(
            address(this),
            msg.sender,
            token.balanceOf(address(this))
        );
        return true;
    }

    function setWithdrawalAmount(uint256 _withdrawalAmount) external onlyOwner {
        withdrawalAmount = _withdrawalAmount;
    }

    function setLockTime(uint256 _lockTime) external onlyOwner {
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

    function getNextAccessTime(
        address user
    ) external view returns (uint256, uint256) {
        return (nextAccessTime[user], block.timestamp);
    }
}
