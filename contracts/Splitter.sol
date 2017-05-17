pragma solidity ^0.4.8;

import "./SafeMath.sol";

contract Splitter {
  using SafeMath for uint;

  mapping (address => uint) balances;
  address public alice;
  address public bob;
  address public carol;

  function getBalance(address userAddress) public returns(uint) {
    return balances[userAddress];
  }

  function Splitter(address aliceAddress, address bobAddress, address carolAddress) {
    alice = aliceAddress;
    bob = bobAddress;
    carol = carolAddress;
  }

  function splitValue() payable returns (bool) {
    uint value = msg.value;

    if (msg.sender == alice) {
      uint halfValue = value.div(2);
      balances[bob] = balances[bob].add(halfValue);
      balances[carol] = balances[carol].add(halfValue);
    } else {
      uint splitValueInThree = value.div(3);

      balances[alice] = balances[alice].add(splitValueInThree);
      balances[bob] = balances[bob].add(splitValueInThree);
      balances[carol] = balances[carol].add(splitValueInThree);
    }

    return true;
  }

  function () {
    throw;
  }

  function killContract()  {
    selfdestruct(msg.sender);
  }

}
