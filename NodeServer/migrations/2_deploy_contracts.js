const EMPToken = artifacts.require("EMPToken");

module.exports = function (deployer) {
  
    return deployer.deploy(EMPToken);
};