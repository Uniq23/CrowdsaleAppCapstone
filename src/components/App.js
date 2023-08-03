import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Buy from './Buy';
import Progress from './Progress';
import Info from './Info';
import Loading from './Loading';
import MintToken from './MintToken';
import BurnToken from './BurnToken';

// Artifacts
import CROWDSALE_ABI from '../abis/Crowdsale.json'
import TOKEN_ABI from '../abis/Token.json'

// Config
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [crowdsale, setCrowdsale] = useState(null)
  const [token, setToken] = useState(null)

  const [account, setAccount] = useState(null)
  const [accountBalance, setAccountBalance] = useState(0)

  const [price, setPrice] = useState(0)
  const [maxTokens, setMaxTokens] = useState(0)
  const [tokensSold, setTokensSold] = useState(0)
  const [tokensOwned, setTokensOwned] = useState(0)   //TODO NOT SURE IF IT WILL WORK
  const [totalSupply, setTotalSupply] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Intiantiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Fetch Chain ID
    const { chainId } = await provider.getNetwork()

    // Intiantiate contracts
    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    setToken(token)
    const crowdsale = new ethers.Contract(config[chainId].crowdsale.address, CROWDSALE_ABI, provider)
    setCrowdsale(crowdsale)

    // Fetch price
    const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
    setPrice(price)

    // Fetch max tokens
    const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
    setMaxTokens(maxTokens)

    // Fetch tokens sold
    const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18)
    setTokensSold(tokensSold)

    const totalSupply = ethers.utils.formatUnits(await token.totalSupply(), 18)
    setTotalSupply(totalSupply)

    setIsLoading(false)
  }

  useEffect(() => {
    loadBlockchainData()
  
  }, [isLoading])

  return (
    <Container>
      <h1 className='my-4 text-center'>Introducing Pooh Bear Token!</h1>
      <Navigation account={account} setAccount={setAccount} accountBalance={accountBalance} setAccountBalance={setAccountBalance} token={token}/>

      

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
          <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
          <MintToken provider={provider} token={token} setIsLoading={setIsLoading} />
          <BurnToken provider={provider} token={token} setIsLoading={setIsLoading} />
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} label={'Tokens sold'} />
          <Progress maxTokens={totalSupply} tokensSold={accountBalance} label={'Tokens Owned'} />
        </>
      )}

      <hr />

      {account && (
        <Info account={account} accountBalance={accountBalance} />
      )}
    </Container>
  );
}

export default App;
