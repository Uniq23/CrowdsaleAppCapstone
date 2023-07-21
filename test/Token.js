const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Token', () => {
  let token, accounts, deployer, receiver, exchange;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy('Dapp University', 'DAPP', '1000000');

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  });

  describe('Checking Token Balance after minting', () => {     //test this section of code
    it('should return the correct token balance', async () => {
      const accountAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const balance = await tokenContract.methods.checkBalance(accountAddress).call();
      console.log("Token balance:", balance);
      
      // Perform assertions on the balance if needed
      expect(balance).to.equal(expectedBalance);
    });

  });

  describe('Deployment', () => {
    const name = 'Dapp University';
    const symbol = 'DAPP';
    const decimals = '18';
    const totalSupply = tokens('1000000');

    it('has correct name', async () => {
      expect(await token.name()).to.equal(name);
    });

    it('has correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it('has correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it('has correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it('assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });

  });


  describe('Sending Tokens', () => {
    let amount, transaction, result;

    describe('Success', () => {

      beforeEach(async () => {
        amount = tokens(100);
        transaction = await token.connect(deployer).transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it('emits a Transfer event', async () => {
        const event = result.events[0];
        expect(event.event).to.equal('Transfer');

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });

    });

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        const invalidAmount = tokens(100000000);
        await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted;
      });

      it('rejects invalid recipient', async () => {
        const amount = tokens(100);
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
      });

    });

  });

  describe('Approving Tokens', () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe('Success', () => {
      it('allocates an allowance for delegated token spending', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount);
      });

      it('emits an Approval event', async () => {
        const event = result.events[0]; 
        expect(event.event).to.equal('Approval');

        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(amount);
      });

    });

    describe('Failure', () => {
      it('rejects invalid spenders', async () => {
        await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
      });
    });

  });

  describe('Delegated Token Transfers', () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'));
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
      });

      it('resets the allowance', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0);
      });

      it('emits a Transfer event', async () => {
        const event = result.events[0];
        expect(event.event).to.equal('Transfer');

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });

    });

    describe('Failure', async () => {
      // Attempt to transfer too many tokens
      const invalidAmount = tokens(100000000); // 100 Million, greater than total supply
      await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted;
    });

  });

  describe('Burning Tokens', () => {
  let amount, transaction, result;
  const decimals = '18';

  beforeEach(async () => {
    const burnAmount = ethers.utils.parseUnits('1000000', decimals);
    amount = burnAmount;
    transaction = await token.connect(deployer).burn(amount);
    result = await transaction.wait();
  });

  describe('Success', () => {
    it('burns token balances', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(0);
    });

    it('emits a Burn event', async () => {
      const transferEvent = result.events[0];
      expect(transferEvent.event).to.equal('Transfer');
      const burnEvent = result.events[1];
      expect(burnEvent.event).to.equal('Burn');

      const transferArgs = transferEvent.args;
      expect(transferArgs.from).to.equal(deployer.address);
      expect(transferArgs.to).to.equal(ethers.constants.AddressZero);
      expect(transferArgs.value).to.equal(amount);

      const burnArgs = burnEvent.args;
      expect(burnArgs.owner).to.equal(deployer.address);
      expect(burnArgs.value).to.equal(amount);
    });

  });

  describe('Failure', () => {
    it('rejects invalid burn amount', async () => {
      const invalidAmount = tokens('100000000');
      await expect(token.connect(deployer).burn(invalidAmount)).to.be.reverted;
    });

  });

  describe('Mint Tokens', () => {
  let amount, transaction, result;
  const decimals = '18';

  beforeEach(async () => {
    amount = tokens(100);
    transaction = await token.mint(amount, {from: owner});
    result = await transaction.wait();
  });

    describe('Success', async () => {

      it('mints tokens', async () => {
        // SUCCESS
        expect(await token.balanceOf(owner)).to.equal(amount);
        expect(await token.totalSupply()).to.equal(amount);
      });

      it('emits a Mint event', async () => {
        //const log = result.events[0];
        const transferEvent = result.events[0];
        expect(transferEvent.event).to.equal('Transfer');
        const mintEvent = result.events[1];
        expect(mintEvent.event).to.equal('Mint');
        console.log('amount')

        const transferArgs = transferEvent.args;
        expect(transferArgs.from).to.equal(deployer.address);
        expect(transferArgs.to).to.equal(ethers.constants.AddressZero);
        expect(transferArgs.value).to.equal(amount);

        const mintArgs = mintEvent.args;
        expect(mintEvent.args.owner).to.equal(owner);
        expect(mintEvent.args.value).to.equal(amount);
        expect(mintEvent.args.minter).to.equal(owner);
      });

    });

    describe('Failure', async () => {
        
      it('rejects a double mint', async () => {
        // FAILURE: cannot mint same tokens twice
        await token.mint(amount, { from: owner }).should.be.rejectedWith(EVM_REVERT);
      });

    });

  });

