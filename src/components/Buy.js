import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'
import styled from 'styled-components';

const Buy = ({ provider, price, crowdsale, setIsLoading }) => {
    const [amount, setAmount] = useState('0')
    const [isWaiting, setIsWaiting] = useState(false)

    const BuyButton = styled.button`
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

    const buyHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true);

        try {
            const signer = await provider.getSigner()

            // We need to calculate the required ETH in order to buy the tokens...
            const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

            const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value })
            await transaction.wait()
        } catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    return (
        <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
            <Form.Group as={Row}>
                <Col>
                    <Form.Control type="number" placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)} />
                </Col>
                <Col className='text-center'>
                    {isWaiting ? (
                        <Spinner animation="border" />
                    ) : (
                        <BuyButton type="submit" style={{ width: '75%' }}>
                            Buy Tokens
                        </BuyButton>
                    )}
                </Col>
            </Form.Group>
        </Form>
    );
}

export default Buy;
