# buildstation ctf challenge

## Hint
The source code of the deployed Vault contract is below:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error VaultIsLocked();
error NotManager();

contract Vault {
    bool public locked;
    bytes32 private password;
    IERC20 private dai = IERC20(0x6aF2dfBE6036790C2886360a09d5088211Caa87a);
    address public manager;

    constructor(bytes32 _password) {
        locked = true;
        password = _password;
        manager = msg.sender;
    }

    function unlock(bytes32 _password) public {
        if (password == _password) {
            locked = false;
        }
    }

    function sendAllMoney(address _manager) public {
        if(locked == true) {
            revert VaultIsLocked();
        } 
        if (_manager != manager) {
            revert NotManager();
        }
        dai.transfer(msg.sender, dai.balanceOf(address(this)));
    }

    receive() external payable {
        manager = msg.sender;
    }
}
```
