module.exports = (app) => {
    const user = require('../controllers/open.controller.js');
    const checkrequest=require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');
    
    //register user
    app.post('/open/register',checkrequest.CheckRegistration,web3.registerUser,user.registerUser);

    //validate user login
    app.post('/open/login',checkrequest.CheckLogin,user.validateLogin);

    //app.post('/user/reg',web3.registerUser);

    app.post('/user/bal',web3.getBalance);

    app.post('/user/trans',web3.transferTo);

  
}