import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';
import styled from 'styled-components';
import headerImage from '../images/header.png';

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
  const [isWhitelisted, setIsWhitelisted] = useState(null)

  const [price, setPrice] = useState(0)
  const [maxTokens, setMaxTokens] = useState(0)
  const [tokensSold, setTokensSold] = useState(0)
  const [tokensOwned, setTokensOwned] = useState(0)   //TODO NOT SURE IF IT WILL WORK
  const [totalSupply, setTotalSupply] = useState(0)
  const [tokensMinted, setTokensMinted] = useState(0)

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

  const HeaderImage = styled.img`    
    display: block;
    margin: 0 auto;
    width: 100%;
    max-height: 450px;
   
`;

  const Container = styled.div`
    width: 80%;
    margin: 75px auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  `;

  const StoryTitle = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #333;
  `;

  const StoryParagraph = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 15px;
    text-align: justify;
  `;


  useEffect(() => {
    loadBlockchainData()
  
  }, [isLoading])

  //const BitcoinStory = () => {

  return (
    <Container>
      <h1 className='my-4 text-center' style={{ color: 'pink' }}>Introducing <span style={{ color: 'purple' }}>Bitcoin</span> <span style={{ color: 'rose', fontWeight: 'bold' }}>2.0</span>!</h1>
      <HeaderImage src={headerImage} alt="Header" />
      
      <Navigation account={account} setAccount={setAccount} accountBalance={accountBalance} setAccountBalance={setAccountBalance} token={token} setIsWhitelisted={setIsWhitelisted} crowdsale={crowdsale}/>
      

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
          <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} isWhitelisted={isWhitelisted} />
          <MintToken provider={provider} token={token} setIsLoading={setIsLoading} />
          <BurnToken provider={provider} token={token} setIsLoading={setIsLoading} />
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} label={'Tokens sold'} />
          <Progress maxTokens={totalSupply} tokensSold={accountBalance} tokensSold={tokensMinted} label={'Tokens Owned / Tokens Minted'} />
        </>
      )}

      <Container>
        <StoryTitle>Bitcoin 2.0: A Phoenix Rises from the Digital Ashes</StoryTitle>
        <StoryParagraph>In a world where Ethereum has long been the leading force in decentralized apps and smart contracts, a new challenger arose: Bitcoin 2.0.
                        In 2025, a group of unknown developers, rumored to be led by the elusive and pseudonymous Satoshi Nakamoto, announced a major upgrade to 
                        the original Bitcoin protocol. Termed "Bitcoin 2.0", the revamped protocol sent shockwaves throughout the crypto community. While many had 
                        believed the narrative that Bitcoin would forever remain a 'store of value' or 'digital gold', Bitcoin 2.0 sought to change that perception of the world!</StoryParagraph>    
            {/* ... */}
      </Container>

      <Container>
        <StoryParagraph>The announcement came via a whitepaper, titled “Bitcoin 2.0: Reshaping the Digital Future,” published on a newly created domain. 
                        True to the roots of the original Bitcoin whitepaper, it was concise, clear, and profound. This new protocol promised not just to
                        be a store of value, but a complete decentralized finance (DeFi) platform that could host decentralized applications, provide instant 
                        peer-to-peer transactions, and even offer scalability solutions that surpassed Ethereum's capabilities.</StoryParagraph>    
            {/* ... */}
      </Container>
      
      <hr />

      {account && (
        <Info account={account} accountBalance={accountBalance} />
      )}
    </Container>
  );
}

export default App;
