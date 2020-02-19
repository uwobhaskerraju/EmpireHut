module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');

    app.post('/user/balance', checkrequest.CheckToken, web3.getBalance);

    app.post('/user/udetails', checkrequest.CheckToken, user.getUserDetails, web3.getUserDetails);

    app.post('/user/admin', checkrequest.CheckToken, web3.getOwner);

    app.post('/user/purchase', checkrequest.CheckToken, user.getAssetToken, web3.transferTo, web3.transferAsset);

    //getting all assets that are not hidden
    //web3.getTokensOfUser,
    app.get('/user/assets', checkrequest.CheckToken, web3.getAllTokens, user.getAllAssets);

    app.get('/user/asset/:id', checkrequest.CheckToken, user.getAssetDetails, web3.getAssetDetails, user.getUserName);

    app.post('/user/proposal', checkrequest.CheckToken, user.addNotifications, web3.RegularTransfer);

    app.get('/user/proposals/:id', checkrequest.CheckToken, user.getAllUserProposals, user.getAllProposalUsers);

    app.post('/user/proposal/approve', checkrequest.CheckToken, user.approveProposal, web3.transferTo, user.toggleNotification, web3.transferAsset);




    //test
    app.get('/balance', web3.testblocks);

    app.get('/testGas', web3.testGas);
}