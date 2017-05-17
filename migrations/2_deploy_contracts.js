var SafeMath = artifacts.require("./SafeMath.sol");
var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer, network, accounts) {
  aliceAccount = accounts[0];
  bobAccount = accounts[1];
  carolAccount = accounts[2];

  deployer.deploy(SafeMath)
  deployer.link(SafeMath, Splitter)
  deployer.deploy(Splitter, aliceAccount, bobAccount, carolAccount);
};
