const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

const ether = tokens;

describe('Crowdsale', () => {
  let token, crowdsale;
  let deployer, accounts, user1, user2;
  let transaction, result;

  beforeEach(async () => {
    const Crowdsale = await ethers.getContractFactory('Crowdsale');
    const Token = await ethers.getContractFactory('Token');

    token = await Token.deploy('Bitcoin 2.0', 'BC2', '1000000');

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];

    crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000');

    let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000));
    await transaction.wait();
  });

  describe('Deployment', () => {
    it('sends tokens to the Crowdsale contract', async () => {
      expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000));
    });

    it('returns the price', async () => {
      expect(await crowdsale.price()).to.equal(ether(1));
    });

    it('returns token address', async () => {
      expect(await crowdsale.token()).to.equal(token.address);
    });
  });

  describe('Buying Tokens', () => {
    let transaction, result;
    let amount = tokens(10);

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) });
        result = await transaction.wait();
      });

      it('transfers tokens', async () => {
        expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990));
        expect(await token.balanceOf(user1.address)).to.equal(amount);
      });

      it('updates tokensSold', async () => {
        expect(await crowdsale.tokensSold()).to.equal(amount);
      });

      it('emits a buy event', async () => {
        await expect(transaction).to.emit(crowdsale, "Buy").withArgs(amount, user1.address, 0);
      });
    });

    describe('Failure', () => {
      it('rejects insufficient ETH', async () => {
        await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted;
      });
    });
  });

  describe('Sending ETH', () => {
    let transaction, result;
    let amount = ether(10);

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount });
        result = await transaction.wait();
      });

      it('updates contract ether balance', async () => {
        expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount);
      });

      it('updates user token balance', async () => {
        expect(await token.balanceOf(user1.address)).to.equal(amount);
      });
    });
  });

  describe('Updating Price', () => {
    let transaction, result;
    let price = ether(2);

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await crowdsale.connect(deployer).setPrice(ether(2));
        result = await transaction.wait();
      });

      it('updates the price', async () => {
        expect(await crowdsale.price()).to.equal(ether(2));
      });
    });

    describe('Failure', () => {
      it('prevents non-owner from updating the price', async () => {
        await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted;
      });
    });
  });

  describe('Finalizing Sale', () => {
    let transaction, result;
    let amount = tokens(10);
    let value = ether(10);

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value });
        result = await transaction.wait();

        transaction = await crowdsale.connect(deployer).finalize();
        result = await transaction.wait();
      });

      it('transfers remaining tokens to the owner', async () => {
        expect(await token.balanceOf(crowdsale.address)).to.equal(0);
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990));
      });

      it('transfers ETH balance to the owner', async () => {
        expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0);
      });

      it('emits Finalize event', async () => {
        await expect(transaction).to.emit(crowdsale, "Finalize").withArgs(amount, value);
      });
    });

    describe('Failure', () => {
      it('prevents non-owner from finalizing', async () => {
        await expect(crowdsale.connect(user1).finalize()).to.be.reverted;
      });
    });
  });

  describe('Adding to Whitelist', () => {
    let transaction, result;

    beforeEach(async () => {
      transaction = await crowdsale.connect(deployer).addToWhitelist(user1.address);
      result = await transaction.wait();
    });

    describe('Success', () => {
      it('updates whitelist', async () => {
        //adds whitelisted addresses
        expect(await crowdsale.whitelist(user1.address)).to.equal(true);
      });

      it('emits WhitelistUpdated event', async () => {
        await expect(transaction).to.emit(crowdsale, "Whitelisted").withArgs(user1.address);
      });
    });

    describe('Failure', () => {
      it('reverts when the user is already whitelisted', async () => {
        await expect(crowdsale.connect(deployer).addToWhitelist(user1.address)).to.be.revertedWith('Already Whitelisted');
      });

      it('requires msg.sender to be owner' , async  () => {
        await expect(crowdsale.connect(user2).addToWhitelist(user1.address)).to.be.revertedWith('Caller is not the owner');
      })
    });
  });

  describe('Whitelisted Buying Tokens', () => {
  let transaction, result;
  let amount = tokens(100);

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await crowdsale.connect(deployer).addToWhitelist(user1.address);
        await transaction.wait();

        transaction = await crowdsale.connect(user1).buyTokensWhiteList(amount, { value: ether(100) });
        result = await transaction.wait();
      });

      it('transfers tokens', async () => {
        // The crowdsale should transfer the purchased amount + bonus to user1
        expect(await token.balanceOf(user1.address)).to.equal(tokens(100));
        // The remaining balance should be the original total - the amount purchased - bonus
        expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999900));
      });

      it('updates tokensSold', async () => {
        expect(await crowdsale.tokensSold()).to.equal(amount);
      });

      it('emits a buy event', async () => {
        await expect(transaction).to.emit(crowdsale, "Buy").withArgs(amount, user1.address, 0);
      });
    });

    describe('Failure', () => {
      it('rejects non-whitelisted users', async () => {
        await expect(crowdsale.connect(user2).buyTokensWhiteList(tokens(10), { value: 0 })).to.be.reverted;
      });

      it('rejects insufficient ETH', async () => {
        await expect(crowdsale.connect(user1).buyTokensWhiteList(tokens(10), { value: 0 })).to.be.reverted;
      });
    });
  });
});


