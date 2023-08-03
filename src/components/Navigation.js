import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import { ethers } from 'ethers';
//import { useSelector } from 'react';

import { Button } from 'react-bootstrap'; // Added import for Button component

import logo from '../logo.png';

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }
  
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
          {account.slice(0,6)} + '...' + {account.slice(-4)}
        </Navbar.Text>
        <Button variant="primary" onClick={connectHandler}>Connect Wallet</Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
