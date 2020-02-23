module.exports = (app) => {
    const admin = require('../controllers/admin.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');

    app.post('/admin/udetails', checkrequest.CheckToken, admin.getUserDetails, web3.getUserDetails);

    app.post('/admin/create', checkrequest.CheckToken, admin.createAsset, web3.insertAssetweb3, admin.insertAsset);

    app.get('/admin/count', checkrequest.CheckToken, web3.getTokenCount);

    app.get('/admin/assets', checkrequest.CheckToken, web3.getAllTokens, admin.getAllAssets);

    app.get('/admin/asset/:id', checkrequest.CheckToken, admin.getAssetDetails, web3.getAssetDetails, admin.getUserName);

    app.get('/admin/users', checkrequest.CheckToken, admin.getAllUsers);

    app.get('/admin/userdetails/:id', checkrequest.CheckToken,admin.getAllUserDetails,web3.getUserAssetCount,admin.getuserAssets);

    app.post('/admin/trans',checkrequest.CheckToken,web3.getTransactions,admin.getUserNameFrmAddress);

    app.get('/admin/assettrans/:id',checkrequest.CheckToken,admin.getAssetDetails,web3.getAssetTransactions,admin.getUserNameFrmAddress);

    app.get('/admin/search/assets/:id',checkrequest.CheckToken,admin.getSearchedAssets);

    app.post('/admin/asset/toggle',admin.toggleAsset);

}