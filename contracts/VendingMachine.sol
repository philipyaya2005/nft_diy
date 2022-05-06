// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract VendingMachine {
    address public owner;
    mapping (address => uint) public snackBalances;

    constructor (uint _initialSnacks) {
        // owner should be contract creator
        owner = msg.sender;

        // initialize snack balances 100
        snackBalances[address(this)] = _initialSnacks;
    }

    function getVendingMachineBalance() public view returns (uint) {
        return snackBalances[address(this)];
    }

    function restockSnacks(uint amount) public {
        require(msg.sender == owner, "Only the owner can restock");
        snackBalances[address(this)] += amount;
    }

    function purchaseSnack(uint amount) public payable {
        console.log("Sender's wallet eth value %s", msg.value);

        require(msg.value >=  amount * 2 ether, "You must pay at least 2 ether per snack");
        require(snackBalances[address(this)] >= amount, "Not enough snacks in stock to fullfill purchase request");

        snackBalances[address(this)] -= amount;
        snackBalances[msg.sender] += amount;
    }
}
