import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import splitter_artifacts from '../../build/contracts/Splitter.json'

var Splitter = contract(splitter_artifacts)

window.App = {
  start: function () {
    Splitter.setProvider(web3.currentProvider)

    this.fetchAllUsersBalances()
  },

  fetchAllUsersBalances: function () {
    const userArray = ['alice', 'bob', 'carol']
    userArray.forEach((user) => {
      this.fetchFuncForUser(this.getUserBalance, user)
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  splitValue: function () {
    const self = this

    const sender = document.getElementById('sender').value
    const amount = parseInt(document.getElementById('amount').value)

    const sendEtherToSplit = (address, user) => {
      Splitter.deployed()
        .then(deployer => deployer.splitValue.sendTransaction({ from: address, value: web3.toWei(amount, "ether") }))
        .then((txHash) => {
          self.setStatus('Transaction Posted ' + txHash)
          self.fetchAllUsersBalances()
        })
        .catch((e) => {
          self.setStatus('Something went wrong. See logs')
          console.log(e)
        })
    }
    this.fetchFuncForUser(sendEtherToSplit, sender)
  },

  getUserBalance: (address, user) => {
    const self = this

    Splitter.deployed()
      .then(deployer => deployer.getBalance.call(address))
      .then((result) => {
        const balanceElement = document.getElementById(user)
        balanceElement.innerHTML = web3.fromWei(result, 'ether').toString(10)
      })
      .catch((e) => {
        console.log(e)
        self.setStatus('Something went wrong while getting ' + user + ' balance')
      })
  },

  fetchFuncForUser: (func, user) => {
    Splitter.deployed()
      .then(deployer => deployer[user].call())
      .then(userAddress => func(userAddress, user))
  },

  killContract: function () {
    const self = this
    const sender = document.getElementById('sender').value

    const killContractAsUser = (userAddress) => {
      Splitter.deployed()
        .then(deployer => deployer.killContract.sendTransaction({ from: userAddress }))
        .then((result) => {
          console.log(result)
          self.setStatus('Contract Destroyed')
        })
        .catch((e) => {
          console.log(e)
          self.setStatus('Something went wrong. See logs')
        })
    }

    this.fetchFuncForUser(killContractAsUser, sender)
  }

}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source. http://truffleframework.com/tutorials/truffle-and-metamask')
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  App.start()
})
