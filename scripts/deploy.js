// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = 'Dapp University'
  const SYMBOL = 'DAPP'
  const MAX_SUPPLY = '1000000'
  const PRICE = ethers.utils.parseUnits('0.025', 'ether')

  // Deploy Token
  const Token = await hre.ethers.getContractFactory("Token")
  const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  await token.deployed()

  console.log(`Token deployed to: ${token.address}\n`)

  // Deploy Crowdsale
  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale")
  const crowdsale = await Crowdsale.deploy(token.address, PRICE, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await crowdsale.deployed();

  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

  const transaction = await token.transfer(crowdsale.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await transaction.wait()

  console.log(`Tokens transferred to Crowdsale\n`)

  //assigns addresses to user1 and user2 for whitelisted buy tokens
  const [deployer, user1, user2] = await ethers.getSigners()
  const addToWhitelistTx = await crowdsale.connect(deployer).addToWhitelist(user1.address);
  await addToWhitelistTx.wait();
  console.log('User assigned to Whitelist')

  // const [deployer, user1, user2] = await ethers.getSigners()
  // await crowdsale.connect(deployer).addToWhitelist(user1.address)
  // await transaction.wait();

  //const signers = await ethers.getSigners();
  // const [deployer, user1, user2] = await ethers.getSigners()
  // const user1 = signers[1];
  // await crowdsale.connect(user1).addToWhitelist(user1.address);
  // await transaction.wait();
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
