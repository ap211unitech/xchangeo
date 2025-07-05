// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract LpToken is ERC20Burnable, Ownable {
    constructor(
        string memory tokenName,
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) Ownable(msg.sender) {}

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
    ) internal virtual override(ERC20) {
        super._update(from, to, amount);
    }
}
