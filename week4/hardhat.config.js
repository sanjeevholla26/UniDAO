/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.1",
   networks: {
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [PRIVATE_KEY]
      },
      sepolia: {
         url: API_URL,
         accounts: [PRIVATE_KEY]
         // Add any other configuration options specific to the "sepolia" network
      }
   },
   defaultNetwork: "hardhat" // Set the default network to "hardhat"
}
