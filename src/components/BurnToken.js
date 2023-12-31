import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'
import styled from 'styled-components';

// Assume you have connected to the Token contract and obtained the contract instance

const BurnToken = ({ provider, token, setIsLoading }) => {
  const [amount, setAmount] = useState('0');
  const [isWaiting, setIsWaiting] = useState(false)
  const [isBurning, setIsBurning] = useState(false);

  const BurnTokenButton = styled.button`
      background-color: #B76E79; /* rose gold */
      color: white;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      transition-duration: 0.4s; /* makes the change smooth */

      &:hover {
          background-color: #008080; /* teal on hover */
          color: black;
      }
  `;

  const handleBurnTokens = async (e) => {
    e.preventDefault()
    setIsBurning(true);

    try {

      const signer = await provider.getSigner()

      // Convert the amount to a BigNumber or uint256 type
      const amountToBurn = ethers.utils.parseUnits(amount.toString(), 'ether');

      // Call the burn function on the Token contract
      const transaction = await token.connect(signer).burn(amountToBurn);

      // Wait for the transaction to be confirmed
      await transaction.wait();

      // Update the token balance and progress bar in your app's state
      // ...

      //setIsBurning(false);
    } catch (error) {
      console.error('Error burning tokens:', error);
      setIsBurning(false);
    }

    setIsLoading(true)
  };

  return (
  <div>
    <form onSubmit={handleBurnTokens} style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
        <Col>
          <Form.Control
            type="number"
            placeholder="Amount to burn"
            onChange={(e) => setAmount(e.target.value)}
          />
        </Col>
        <Col className='text-center'>
          {isWaiting ? (
            <Spinner animation="border" />
          ) : (
            <BurnTokenButton variant="primary" type="submit" style={{ width: '75%' }}>
              Burn Tokens
            </BurnTokenButton>
          )}
        </Col>
      </Form.Group>
    </form>
    {isBurning && <p>Burning tokens...</p>}
    {/* Render the progress bar component based on the token balance and total supply */}
    {/* ... */}
  </div>
);

};

export default BurnToken;
