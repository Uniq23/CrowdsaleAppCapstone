import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

// Components
import Navigation from './Navigation';
import Info from './Info';

import CROWDSALE_ABI from '../abis/Crowdsale.json';
import TOKEN_ABI from '../abis/Token.json';

// Config
import config from '../config.json';

function App() {

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  
  const loadBlockchainData = async () => {
    // Intiantiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Intiantiate contracts
    const token = new ethers.Contract(config[31337].token.address, TOKEN_ABI, provider)
    const crowdsale = new ethers.Contract(config[31337].crowdsale.address, CROWDSALE_ABI, provider)
    setCrowdsale(crowdsale)
    console.log(token)

    // Fetch account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    setIsLoading(false)

  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return (
    <Container>
      <Navigation />
      <hr />
      {account && <Info account={account} accountBalance={accountBalance} />}
      <div>{account}</div>
    </Container>
  );
}

export default App;
