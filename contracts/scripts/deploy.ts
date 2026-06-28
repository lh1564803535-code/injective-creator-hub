const hre = require("hardhat");

async function main() {
  const USDC_ADDRESS = "0xf22bede237a07e121b56d91a491eb7bcdfd1f590"; // Injective testnet USDC
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying BountyCampaign with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "INJ");

  const BountyCampaign = await hre.ethers.getContractFactory("BountyCampaign");
  const bounty = await BountyCampaign.deploy(USDC_ADDRESS, deployer.address, {
    gasPrice: hre.ethers.parseUnits("500", "gwei"), // Higher gas price for faster inclusion
    gasLimit: 5000000, // Explicit gas limit
  });

  console.log("Deployment transaction sent. Waiting for receipt...");
  console.log("Transaction hash:", bounty.deploymentTransaction()?.hash);

  // Don't wait for deployment - just get the address
  const address = await bounty.getAddress();
  console.log("BountyCampaign deployed to:", address);
  console.log("Save this address to .env.local as NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
