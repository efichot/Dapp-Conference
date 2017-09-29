 import "../stylesheets/app.css";
 import { default as Web3} from 'web3';
 import { default as contract } from 'truffle-contract'

 import conference_artifacts from '../../build/contracts/Conference.json'

 var Conference = contract(conference_artifacts);
 
 window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
   if (typeof web3 !== 'undefined') {
     console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
     window.web3 = new Web3(web3.currentProvider);
   } else {
     console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
     window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
   }

   var accounts = web3.eth.accounts; // all the address users in my testrpc blockchain but useless if you select user by metamask so the accounts array = [currentUser]
    console.log(accounts);

   Conference.setProvider(web3.currentProvider); //set provider

   Conference.new({ from: accounts[0], gas: 3141592 }).then((conference) => {  // my Conference address ( my contract address )
     //console.log('ee');
     console.log(conference.address); // address from the contract
     const ticketPrice = web3.toWei(0.05,'ether');
     const initialBalance = web3.eth.getBalance(conference.address).toNumber();
     console.log('initial balance is ==>  ' + initialBalance); // initial balance of smart contract
     conference.buyTicket({ from: accounts[1], value: ticketPrice }).then(() => {
        let balance = web3.eth.getBalance(conference.address).toNumber();
        console.log('balance after a user buy a ticket ==>  ' + balance); // balance after user buy a ticket
        conference.refundTicket(accounts[1], ticketPrice, { from: accounts[0] }).then(() => {
          balance = web3.eth.getBalance(conference.address).toNumber();
          console.log('balance after refund a user ==>  ' + balance); // balance after refund a user
        })
      });
   }, (err) => {
    console.log('Some trouble to deploy the contract: ' + err);
   });
 });