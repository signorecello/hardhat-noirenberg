// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000000,
      },
    },
  },
  defaultNetwork: "hardhat",
  paths: {
    noir: "noir2",
  },
  noir: {
    version: "0.34.0",
  },
};

export default config;
