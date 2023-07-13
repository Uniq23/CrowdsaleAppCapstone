import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'

// Assume you have connected to the Token contract and obtained the contract instance

const MintTokensForm = ({ tokenContract }) => {
  const [amount, setAmount] = useState('0');    //added the 0 value was orignally left empty
  const [isMinting, setIsMinting] = useState(false);

  const handleMintTokens = async (e) => {
    e.preventDefault();

    try {
      setIsMinting(true);

      // Convert the amount to a BigNumber or uint256 type
      const amountToMint = ethers.utils.parseUnits(amount.toString(), 'ether');

      // Call the mint function on the Token contract
      const tx = await tokenContract.mint(amountToMint);

      // Wait for the transaction to be confirmed
      await tx.wait();

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

export default MintTokensForm;
