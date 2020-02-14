module.exports = (app) => {
    const user = require('../controllers/open.controller.js');
    const checkrequest=require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');

    app.post('/user/balance',web3.getBalance);

    //app.post('/user/bal',web3.getBalance);

    //app.post('/user/trans',web3.transferTo);
}