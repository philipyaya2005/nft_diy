// SPDX-License-Identifier: None
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Lottery {
    address public owner;
    address payable[] public players;

    constructor() {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > 0.1 ether);

        // address of player entering lottery
        players.push(payable(msg.sender));
    }

    function pickWinnder() public payable onlyOwner {
        uint index = getRandom() % players.length;
        players[index].transfer(address(this).balance);

        // reset the state of contract
        players = new address payable[](0);
    }

    function getRandom() private view returns(uint) {
        // generate pseudo random number
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
