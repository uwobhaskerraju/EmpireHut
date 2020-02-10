module.exports = (app) => {
    const admin = require('../controllers/admin.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');
    
    
    app.post('/admin/create',admin.createAsset,web3.createAsset);
    

}