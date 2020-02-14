module.exports = (app) => {
    const admin = require('../controllers/admin.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');
    
    
    app.post('/admin/create',admin.createAsset,web3.insertAssetweb3,admin.insertAsset);
    
    app.post('/admin/count',web3.getTokenCount);

    app.get('/admin/assets',web3.getTokensOfUser,admin.getAllAssets);

    app.get('/admin/asset/:id',admin.getAssetDetails,web3.getAssetDetails,admin.getUserName);

}