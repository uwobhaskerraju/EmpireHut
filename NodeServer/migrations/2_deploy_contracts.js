const EMPToken = artifacts.require("EMPToken");
const AssetToken = artifacts.require("AssetToken")

module.exports = function (deployer) {
    
    deployer.deploy(EMPToken)
    .then(function(){
        
        return deployer.deploy(AssetToken);
    })
    .catch(function(){
        console.log("in deployment catch")
    });

    
};