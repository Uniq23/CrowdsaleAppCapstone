import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';

function App() {
  
  const loadBlockchainData = async () => {
    // Intiantiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    console.log(provider)

    // Fetch account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
  }

  useEffect(() => {
      loadBlockchainData()
  });

  return (
    <Container>
      <Navigation />
    </Container>
  );
}

export default App;
