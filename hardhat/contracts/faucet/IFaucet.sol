// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IERC20Faucet {
    /// @notice Thrown when an unauthorized sender attempts to request token from faucet
    /// @param tokenAddress The address of the ERC20 token
    /// @param sender The address of the sender attempting the request
    /// @param description A message describing the reason for the error
    error Faucet__InvalidSender(
        address tokenAddress,
        address sender,
        string description
    );

    /// @notice Thrown when the faucet does not have enough funds to fulfill the request
    /// @param tokenAddress The address of the ERC20 token
    /// @param requestedAmount Current amount that can be sent to the user
    /// @param availableBalance The current available balance in the faucet
    /// @param description A message describing the reason for the error
    error Faucet__InsufficientFunds(
        address tokenAddress,
        uint256 requestedAmount,
        uint256 availableBalance,
        string description
    );

    /// @notice Thrown when a user requests tokens before the minimum wait time has elapsed
    /// @param tokenAddress The address of the ERC20 token
    /// @param lastRequestTime The timestamp of the user's last request
    /// @param minWaitTime The required minimum waiting time between requests
    /// @param currentTime The current timestamp when the request is made
    /// @param description A message describing the reason for the error
    error Faucet__InsufficientTimeElapsed(
        address tokenAddress,
        uint256 lastRequestTime,
        uint256 minWaitTime,
        uint256 currentTime,
        string description
    );

    /// @notice Emitted when any user requests ERC20 token from Faucet
    /// @param from The faucet account address
    /// @param to The user account address
    /// @param amount Allowed transferrable amount to each request
    /// @param timestamp Timestamp at which tx went through
    event Faucet__ReceivedFunds(
        address indexed from,
        address indexed to,
        uint256 indexed amount,
        uint256 timestamp
    );

    /// @notice Emitted when when owner withdraw all tokens from faucet
    /// @param from The faucet account address
    /// @param to The owner account address
    /// @param amount Faucet balance for given ERC20 token, which now sent to owner account
    event Faucet__Withdraw(
        address indexed from,
        address indexed to,
        uint256 indexed amount
    );

    /// @notice Allows users to request tokens from the faucet
    /// @dev Users can request tokens if they meet the eligibility criteria, such as lock time restrictions.
    /// @return success A boolean indicating whether the request was successful
    function requestTokens() external returns (bool);

    /// @notice Allows the owner to withdraw all ERC20 tokens from the faucet
    /// @dev This function can only be called by the contract owner to retrieve any remaining funds. It empties the faucet balance for provided ERC20 token.
    /// @return success A boolean indicating whether the withdrawal was successful
    function withdraw() external returns (bool);

    /// @notice Sets the maximum amount of tokens a user can withdraw per request
    /// @dev Only the contract owner can call this function to update the withdrawal amount.
    /// @param withdrawalAmount The new withdrawal amount to be set
    function setWithdrawalAmount(uint256 withdrawalAmount) external;

    /// @notice Sets the lock time users must wait between consecutive requests
    /// @dev This function ensures that users cannot request tokens too frequently.
    /// @param lockTime The new lock time (in seconds) to be set
    function setLockTime(uint256 lockTime) external;

    /// @notice Returns the current balance of the faucet's ERC20 token holdings
    /// @dev This function allows users to check the available balance in the faucet.
    /// @return balance The total balance of the faucet in the configured ERC20 token
    function getBalance() external view returns (uint256);

    /// @notice Returns the timestamp when a user can request tokens again
    /// @dev Users must wait until the returned timestamp before making another request.
    /// @param user The address of the user requesting the next access time
    /// @return nextAccessTime The timestamp when the user can request tokens again
    function getNextAccessTime(address user) external view returns (uint256);
}
