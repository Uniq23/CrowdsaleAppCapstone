import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from '../logo.png';

const Navigation = ({ account }) => {

  const [Account, setAccount] = useState(null);

  // connectWallet function
  const connectWallet = async () => {
    if (window.ethereum) { // check if MetaMask is installed
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts', params: [] }); // request access to accounts
        const account = accounts[0];
        setAccount(account);
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">POOH BEAR CROWDSALE</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {Account 
            ? Account 
            : <Button onClick={connectWallet}>Connect Wallet</Button>}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
