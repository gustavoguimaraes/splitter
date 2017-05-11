pragma solidity ^0.4.8;

contract Splitter {
  mapping (address => uint) splitterAddresses;
  address public owner;
  address public alice;
  address public bob;
  address public carol;

  function getBalance(address userAddress) public returns(uint) {
    return splitterAddresses[userAddress];
  }

  function Splitter(address aliceAddress, address bobAddress, address carolAddress) {
    owner = msg.sender;
    alice = aliceAddress;
    bob = bobAddress;
    carol = carolAddress;
  }

  function splitValue(uint _value, address sender) payable returns (bool) {
    if (sender == alice) {
      uint halfValue = _value / 2;
      splitterAddresses[bob] += halfValue;
      splitterAddresses[carol] += halfValue;
    } else {
      uint splitValueInThree = _value / 3;

      splitterAddresses[alice] += splitValueInThree;
      splitterAddresses[bob] += splitValueInThree;
      splitterAddresses[carol] += splitValueInThree;
    }

    return true;
  }

  function killContract()  {
    selfdestruct(msg.sender);
  }

}
