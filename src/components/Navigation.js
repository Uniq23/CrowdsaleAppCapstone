import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { Button } from 'react-bootstrap';

import logo from '../logo.png';

const Navigation = ({ crowdsale, account, setAccount, setIsWhitelisted, accountBalance, setAccountBalance, token }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    const whitelist = await crowdsale.whitelist(account)
    setIsWhitelisted(whitelist);
    console.log(whitelist)
    // Fetch account balance;
    const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18);
    setAccountBalance(accountBalance);
  };

  const StyledConnectButton = styled(Button)`
    background-color: teal;
    color: white;
    border-color: teal;
    border-radius: 10px; /*
    
    &:hover {
      background-color: #8B6508; gold;
      border-color: gold;
    }
  `;

  return (
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">BITCOIN 2.0 CROWDSALE</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">

        {account ? (
          <Navbar.Text>
            {`${account.slice(0, 6)}...${account.slice(34, 42)}`}
          </Navbar.Text>
        ) : (
          <StyledConnectButton variant="primary" onClick={connectHandler}>Connect Wallet</StyledConnectButton>
        )}         
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
