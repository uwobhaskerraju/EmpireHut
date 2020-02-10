try {
    const dataConfig = require('../config/data.config.js');
    const shortid = require('shortid');


    //create a new Asset
    exports.createAsset = (req, res,next) => {
        //generate a random string
        var rndStr=shortid.generate();
        req.app.randomStr=rndStr;
        //res.send("asdsd");
        next();
    };
} catch (error) {

}