pragma solidity ^0.4.15;

contract Conference { 
  address public organizer; // the address of the owner
  mapping (address => uint) public registrantsPaid; // like an array where address are the index and the uint are simply the value
  uint public numRegistrants;
  uint public quota;

  // so you can log these events
  // event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Deposit(address _from, uint _amount); 
  event Refund(address _to, uint _amount);

  function Conference() { // Constructor: function with same name of the contract
    organizer = msg.sender;
    quota = 500;
    numRegistrants = 0;
  }
  function buyTicket() payable public returns (bool success) { 
    if (numRegistrants >= quota) { return false; } // see footnote
     registrantsPaid[msg.sender] = msg.value;
     numRegistrants++;
     Deposit(msg.sender, msg.value); // payable function because Deposit add some ether to the contract
     return true;
  }
  function changeQuota(uint newquota) public {
    if (msg.sender != organizer) { return; }
    quota = newquota;
  }
  function refundTicket(address recipient, uint amount) public {
    if (msg.sender != organizer) { return; }
    if (registrantsPaid[recipient] == amount) {
      address myAddress = this; // this refer to the address of the contract on the blockchain
      if (myAddress.balance >= amount) {
        recipient.transfer(amount);  // the transfer method is where the contract transfer an amount
        Refund(recipient, amount);
        registrantsPaid[recipient] = 0;
        numRegistrants--;
      }
     }
  }
  function destroy() { // so funds not locked in contract forever
    if (msg.sender == organizer) {
      selfdestruct(organizer); // send funds to organizer else if the gain stay forever on the smart contract
    }
  }
}