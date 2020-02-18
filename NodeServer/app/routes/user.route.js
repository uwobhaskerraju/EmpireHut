module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const checkrequest=require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');

    app.post('/user/balance',checkrequest.CheckToken,web3.getBalance);

    app.post('/user/udetails',checkrequest.CheckToken,user.getUserDetails,web3.getUserDetails);

    app.post('/user/admin',web3.getOwner);

    app.post('/user/purchase',checkrequest.CheckToken,user.getAssetToken,web3.transferTo,web3.transferAsset);

    //getting all assets that are not hidden
    app.get('/user/assets',checkrequest.CheckToken,web3.getTokensOfUser,user.getAllAssets);

    app.get('/user/asset/:id',checkrequest.CheckToken,user.getAssetDetails,web3.getAssetDetails,user.getUserName);

    app.post('/user/proposal',checkrequest.CheckToken,user.addNotifications);



    //test
    app.get('/balance',web3.blocks);
}