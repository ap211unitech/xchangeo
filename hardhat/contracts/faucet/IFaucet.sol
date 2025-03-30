// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IERC20Faucet {
    error Faucet__InvalidSender(
        address tokenAddress,
        address sender,
        string description
    );

    error Faucet__InsufficientFunds(
        address tokenAddress,
        uint256 requestedAmount,
        uint256 availableBalance,
        string description
    );

    error Faucet__InsufficientTimeElapsed(
        address tokenAddress,
        uint256 lastRequestTime,
        uint256 minWaitTime,
        uint256 currentTime,
        string description
    );

    // Emit when owner withdraw all tokens from faucet
    event Faucet__ReceivedFunds(
        address indexed from,
        address indexed to,
        uint256 indexed amount,
        uint256 timestamp
    );

    // Emit when owner withdraw all tokens from faucet
    event Faucet__Withdraw(
        address indexed from,
        address indexed to,
        uint256 indexed amount
    );

    // Request tokens from faucet
    function requestTokens() external returns (bool);

    // Withdraw ERC20 tokens back to owner
    function withdraw() external returns (bool);

    // Set Withdrawal Amount for each request
    function setWithdrawalAmount(uint256 withdrawalAmount) external;

    // Set Lock time for each request
    function setLockTime(uint256 lockTime) external;

    // Get Balance of Faucet
    function getBalance() external view returns (uint256);

    // Get next access time
    function getNextAccessTime(address user) external view returns (uint256);
}
