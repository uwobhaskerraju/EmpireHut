module.exports = (app) => {
    const user = require('../controllers/open.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');

    //register user
    app.post('/open/register', checkrequest.CheckRegistration, web3.registerUser, user.registerUser);

    //validate user login
    app.post('/open/login', checkrequest.CheckLogin, user.validateLogin);

    // validate Token
    app.get('/open/val',checkrequest.DecodeToken);



}