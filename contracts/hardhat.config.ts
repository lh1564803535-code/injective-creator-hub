import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    injective: {
      url: "https://k8s.global.mainnet.lcd.injective.network",
      chainId: 2525,
    },
  },
};

export default config;
