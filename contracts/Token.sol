// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'hardhat/console.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Track Balances
    mapping(address => uint256) public balanceOf;
    // Send Tokens
    mapping(address => mapping(address => uint256)) public allowance;
    event Transfer(address indexed from, 
      address indexed to, 
      uint256 value
    );

    event Approval(address indexed owner,
      address indexed spender,
      uint256 value
    );

    event Burn(address indexed owner,
      uint256 value
    );

    constructor(string memory _name, 
        string memory _symbol, 
        uint256 _totalSupply) {

        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) 
        public 
        returns (bool success) 

    {
        require(balanceOf[msg.sender] >= _value);

        _transfer(msg.sender, _to,_value);

        return true;

    }

    function _transfer(address _from, address _to, uint256 _value)
        internal 
    {
        require(_to != address(0));
        // deduct tokens from spender
        balanceOf[_from] = balanceOf[_from] - _value;
        //credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        // Emit Event 
        emit Transfer(_from, _to,_value);
    }


    function approve(address _spender, uint256 _value) 
        public 
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;

        // Emit Event
        emit Approval(msg.sender, _spender, _value);

        return true;

    }    

    function transferFrom(address _from, address _to, uint256 _value) 
        public 
        returns (bool success) 
    {
        //check approval and then actually spend tokens
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);  //= to or less than allowance

        //Reset the allowance  *incase you have more to spend
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        _transfer(_from, _to, _value);

        return true;
    }

    function burn(uint256 amount) //7/6/23 fininsh write tests
        public
        returns (bool success)
    {
        //Allows specified amount of tokens burned from msg.sender
        //require(amount <= 1000000 * (10 ** decimals), "Exceeded maximum burn amount");
        require(amount <= 1_000_000 * 10 ** decimals, "Exceeded maximum burn amount");
     
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
     
        emit Transfer(msg.sender, address(0), amount);

        emit Burn(msg.sender, amount);

        return true;
    }

    function mint(uint256 amount) 
        public 
        returns (bool) 
  
    {
        require(msg.sender == owner && msg.sender == minter);
        _mint(msg.sender, amount);

        totalSupply += amount;

        return true;
    }

}
