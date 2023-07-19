import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'

// Assume you have connected to the Token contract and obtained the contract instance

const MintToken = ({ provider, token, setIsLoading }) => {
  const [amount, setAmount] = useState('0');    //added the 0 value was orignally left empty
  const [isMinting, setIsMinting] = useState(false);

  const handleMintTokens = async (e) => {
    e.preventDefault()
    setIsMinting(true);

    try {
      //setIsMinting(true);

      // Check if the connected wallet address is the contract owner
      const signer = await provider.getSigner()
      const connectedAddress = await signer.getAddress();
      const contractOwner = await token.owner();
      if (connectedAddress !== contractOwner) {
      throw new Error('Only the contract owner can mint tokens.');
    }

      // Convert the amount to a BigNumber or uint256 type
      const amountToMint = ethers.utils.parseUnits(amount.toString(), 'ether');

      // Call the mint function on the Token contract
      const transaction = await token.connect(signer).mint(amountToMint);

      // Wait for the transaction to be confirmed
      await transaction.wait();

      // Update the token balance and progress bar in your app's state
      // ...

      setIsMinting(false);
    } catch (error) {
      console.error('Error minting tokens:', error);
      setIsMinting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleMintTokens}>
        <input
          type="number"
          placeholder="Amount to mint"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" disabled={isMinting}>
          Mint Tokens
        </button>
      </form>
      {isMinting && <p>Minting tokens...</p>}
      {/* Render the progress bar component based on the token balance and total supply */}
      {/* ... */}
    </div>
  );
};

export default MintToken;
