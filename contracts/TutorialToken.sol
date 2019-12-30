pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TutorialToken is ERC20 {
    string public name = "JJCoin";
    string public symbol = "JJ";
    uint8 public decimals = 0;
    uint public INITIAL_SUPPLY = 20000;

    constructor () public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
