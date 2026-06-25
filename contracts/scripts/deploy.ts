import { ethers } from "hardhat";

async function main() {
  const USDC_ADDRESS = "0xf22bede237a07e121b56d91a491eb7bcdfd1f590"; // Injective mainnet USDC
  const [deployer] = await ethers.getSigners();

  console.log("Deploying BountyCampaign with account:", deployer.address);

  const BountyCampaign = await ethers.getContractFactory("BountyCampaign");
  const bounty = await BountyCampaign.deploy(USDC_ADDRESS, deployer.address);

  await bounty.waitForDeployment();
  console.log("BountyCampaign deployed to:", await bounty.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
