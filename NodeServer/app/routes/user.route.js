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
    app.get('/user/assets/:id', checkrequest.CheckToken, web3.regularOwnedTokensOfUser, web3.getAllUserTokens, user.getAllAssets);

    app.get('/user/asset/:id', checkrequest.CheckToken, user.getAssetDetails, web3.getAssetDetails, user.getUserName);

    app.post('/user/proposal', checkrequest.CheckToken, user.addNotifications, web3.RegularTransfer);

    app.get('/user/proposals/:id', checkrequest.CheckToken, user.getAllUserProposals, user.getAllProposalUsers);

    app.post('/user/proposal/approve', checkrequest.CheckToken, user.approveProposal, web3.customTransferTo, user.toggleNotification, web3.transferAsset);

    app.post('/user/proposal/reject', checkrequest.CheckToken, user.rejectProposal, web3.RejectTransfer);

    //,,user.getUserAssets
    app.get('/user/personal/:id', checkrequest.CheckToken, web3.regularOwnedTokensOfUser, user.getUserAssets);

    app.post('/user/asset/toggle', checkrequest.CheckToken, user.toggleAsset)

    app.post('/user/search/assets/:id', checkrequest.CheckToken, web3.regularOwnedTokensOfUser, user.getSearchedAssets);

    app.post('/user/trans', checkrequest.CheckToken, web3.getTransactions, user.getUserNameFrmAddress);

    app.get('/user/assettrans/:id',checkrequest.CheckToken,user.getAssetDetails,web3.getAssetTransactions,user.getUserNameFrmAddress);

    app.get('/user/count/:id',checkrequest.CheckToken,web3.getUserTokenCount)
    
    //test
    app.get('/balance', web3.testblocks);

    app.get('/testGas', web3.testEvents);

    app.get('/logs', web3.testLogs);

}