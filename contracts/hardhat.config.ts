import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    injective: {
      url: "https://k8s.global.mainnet.lcd.injective.network",
      chainId: 2525,
      accounts: [PRIVATE_KEY],
    },
    "injective-testnet": {
      url: "https://k8s.testnet.json-rpc.injective.network/",
      chainId: 1439,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      injective: "empty",
    },
    customChains: [
      {
        network: "injective",
        chainId: 2525,
        urls: {
          apiURL: "https://explorer.injective.network/api",
          browserURL: "https://explorer.injective.network",
        },
      },
    ],
  },
};

export default config;
