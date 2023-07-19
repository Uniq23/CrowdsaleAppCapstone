import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = () => {
  const [tokensSold, setTokensSold] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  const handleMintTokens = (amount) => {
    // Perform the mint operation
    // ...

    // Update the tokens sold and total supply
    setTokensSold(tokensSold + amount);
    setTotalSupply(totalSupply + amount);
  };

  const handleBurnTokens = (amount) => {        //add tokensOwned here with mint and burning 
    // Perform the burn operation               //also add in minttoken js file setIsMinting to true 
    // ...                                      //also add in burnToken js file setIsBurning to true 
                                                // check the variables for const progress and what is used
    // Update the tokens sold and total supply
    setTokensSold(tokensSold - amount);
    setTotalSupply(totalSupply - amount);
  };

  return (
    <div className='my-3'>
      <ProgressBar now={((tokensSold / totalSupply) * 100)} label={`${(tokensSold / totalSupply) * 100}%`} />
      <p className='text-center my-3'>{tokensSold} / {totalSupply} Tokens sold</p>

      <button onClick={() => handleMintTokens(100)}>Mint Tokens</button>
      <button onClick={() => handleBurnTokens(50)}>Burn Tokens</button>
    </div>
  );
};

export default Progress;
