//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Crowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;
    uint256 public crowdsaleDeadLine;

    mapping(address => bool) public whitelist;

    event Buy(uint256 amount, address buyer, uint256 bonusAmount);
    event Finalize(uint256 tokensSold, uint256 ethRaised);
    event Whitelisted(address indexed _address);

    constructor(
        Token _token,
        uint256 _price,
        uint256 _maxTokens
    ) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender] == true, "Caller is not whitelisted");
        _;
    }

    // Buy tokens directly by sending Ether
    receive() external payable {
        uint256 amount = msg.value / price;

        if (whitelist[msg.sender] == true) {
            buyTokensWhiteList(amount * 1e18);
        }   else {
            buyTokens(amount * 1e18);

        }

    }

    function buyTokens(uint256 _amount) public payable {
        require(msg.value == (_amount / 1e18) * price);
        require(token.balanceOf(address(this)) >= _amount);
        require(token.transfer(msg.sender, _amount));

        tokensSold += _amount;

        emit Buy(_amount, msg.sender, 0);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    // Finalize Sale
    function finalize() public onlyOwner {
        require(token.transfer(owner, token.balanceOf(address(this))));

        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value}("");
        require(sent);

        emit Finalize(tokensSold, value);
    }

    function addToWhitelist(address _address) public onlyOwner {

        require(whitelist[_address] == false , 'Already Whitelisted');
        whitelist[_address] = true;

        emit Whitelisted(_address);
    }

    function removeFromWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
    }

    function buyTokensWhiteList(uint256 _amount) public payable onlyWhitelisted {
        //require(block.timestamp < crowdsaleDeadLine, 'Crowdsale ended');
        require(msg.value == (_amount / 1e18) * price);
        require(token.balanceOf(address(this)) >= _amount);
        require(token.transfer(msg.sender, _amount));
        require(whitelist[msg.sender]);

        // Calculate and apply the early-bird bonus
        uint256 bonusAmount = 0;  // Initialize bonusAmount to zero

        // Apply bonus if the purchase amount is more than 100 tokens
        if (_amount > 100 * 1e18) {
            bonusAmount = calculateBonus(_amount);
            require(token.balanceOf(address(this)) >= bonusAmount);
            require(token.transfer(msg.sender, bonusAmount));  // Transfer the bonus tokens
    }

        uint256 totalAmount = _amount + bonusAmount;

        tokensSold += totalAmount;

        emit Buy(totalAmount, msg.sender, bonusAmount);    //TODO now copy abis artifacts crowdsale to other abi's then restart project
    }

    // Function to calculate bonus amount based on the token amount
    function calculateBonus(uint256 _amount) internal pure returns (uint256) {
        require(_amount > 99, "buy at least 100 tokens receive 25% bonus");

        return (_amount * 25) / 100 ;

    }

}

