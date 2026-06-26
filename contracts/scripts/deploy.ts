const hre = require("hardhat");

async function main() {
  const USDC_ADDRESS = "0xf22bede237a07e121b56d91a491eb7bcdfd1f590"; // Injective mainnet USDC
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying BountyCampaign with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "INJ");

  const BountyCampaign = await hre.ethers.getContractFactory("BountyCampaign");
  const bounty = await BountyCampaign.deploy(USDC_ADDRESS, deployer.address, {
    gasPrice: hre.ethers.parseUnits("1", "gwei"),
  });

  await bounty.waitForDeployment();
  console.log("BountyCampaign deployed to:", await bounty.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
