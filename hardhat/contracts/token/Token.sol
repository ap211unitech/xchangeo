// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ERC20Token is ERC20Capped, ERC20Burnable, Ownable {
    event ERC20TokenCreated(address indexed token, string name, string symbol);

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 maximumCap
    )
        ERC20(tokenName, tokenSymbol)
        ERC20Capped(maximumCap * (10 ** decimals()))
        Ownable(msg.sender)
    {
        uint256 initialSupply = maximumCap / 10;
        _mint(msg.sender, initialSupply * (10 ** decimals()));
        emit ERC20TokenCreated(address(this), tokenName, tokenSymbol);
    }

    function mint(
        address account,
        uint256 amount
    ) public onlyOwner returns (bool) {
        _mint(account, amount);
        return true;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Capped) {
        super._update(from, to, amount);
    }
}
