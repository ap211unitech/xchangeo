// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ERC20Token is ERC20Capped, ERC20Burnable, Ownable {
    string private _logoIpfsCid;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        string memory tokenLogo,
        uint256 maximumCap
    )
        ERC20(tokenName, tokenSymbol)
        ERC20Capped(maximumCap * (10 ** decimals()))
        Ownable(msg.sender)
    {
        _logoIpfsCid = tokenLogo;
        uint256 initialSupply = maximumCap / 10;
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    /**
     * @dev Returns the logo of the token.
     */
    function logo() public view virtual returns (string memory) {
        return _logoIpfsCid;
    }

    function mint(address account, uint256 amount) public returns (bool) {
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
