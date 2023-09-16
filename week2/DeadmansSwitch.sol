// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeadmansSwitch {
    address public owner;
    address public beneficiary;
    uint256 public lastCheckedBlock;
    uint256 public blockTimeout; // Number of blocks after which the funds can be transferred

    constructor(address _beneficiary, uint256 _blockTimeout) {
        owner = msg.sender;
        beneficiary = _beneficiary;
        blockTimeout = _blockTimeout;
        lastCheckedBlock = block.number;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _; // In the place of the placeholder the function which uses this modifier will be executed
    }

    function stillAlive() external onlyOwner {
        lastCheckedBlock = block.number;
    }

    function checkStatus() external {
        uint256 balance_eth = address(this).balance;
        require(block.number >= lastCheckedBlock + blockTimeout, "Timeout not reached yet");
        require(balance_eth > 0, "No balance to send.");

        (bool success, ) = payable(beneficiary).call{value: balance_eth}("");
        require(success, "Transfer failed");
    }

    // Fallback function to receive funds
    receive() external payable {}
}
