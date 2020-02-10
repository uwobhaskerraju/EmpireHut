module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const checkrequest=require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');
    
    //register user
    app.post('/user/register',checkrequest.CheckRegistration,user.registerUser);

    //validate user login
    app.post('/user/login',checkrequest.CheckLogin,user.validateLogin);

    app.post('/user/reg',web3.registerUser);

    app.post('/user/bal',web3.getBalance);

    app.post('/user/trans',web3.transferTo);

  
}