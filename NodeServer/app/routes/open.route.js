module.exports = (app) => {
    const open = require('../controllers/open.controller.js');
    const checkrequest = require('../middleware/appmiddleware.js');
    const web3 = require('../controllers/web3.controller.js');

    //register user
    app.post('/open/register', checkrequest.CheckRegistration, web3.registerUser, open.registerUser);

    //validate user login
    app.post('/open/login', checkrequest.CheckLogin, open.validateLogin);

    // validate Token
    app.get('/open/val', checkrequest.DecodeToken);

    app.get('/open/token', checkrequest.returnToken);

    //test
    app.get('/contracts', web3.testEvents);


}