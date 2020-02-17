module.exports = (app) => {
    const admin = require('../controllers/admin.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');
    
    app.post('/admin/udetails',checkrequest.CheckToken,admin.getUserDetails,web3.getUserDetails);
    
    app.post('/admin/create',checkrequest.CheckToken,admin.createAsset,web3.insertAssetweb3,admin.insertAsset);
    
    app.get('/admin/count',checkrequest.CheckToken,web3.getTokenCount);

    app.get('/admin/assets',checkrequest.CheckToken,web3.getTokensOfUser,admin.getAllAssets);

    app.get('/admin/asset/:id',checkrequest.CheckToken,admin.getAssetDetails,web3.getAssetDetails,admin.getUserName);

    
}