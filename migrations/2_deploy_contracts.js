var SimpleStorage = artifacts.require("./ItemManager.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
