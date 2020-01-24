module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const checkrequest=require('../middleware/appmiddleware.js');
    
    //register user
    app.post('/user/register',checkrequest.CheckRegistration,user.registerUser);

    //validate user login
    app.post('/user/login',checkrequest.CheckLogin,user.validateLogin);
}