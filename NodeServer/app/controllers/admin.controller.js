try {
    const dataConfig = require('../config/data.config.js');
    const shortid = require('shortid');
    const Asset = require('../models/asset.model');

    //create a new Asset
    // goes to web3 controller first and comes back here(insertAsset)
    exports.createAsset = (req, res, next) => {
        //generate a random string
        var rndStr = shortid.generate();
        req.app.randomStr = rndStr;
        req.app.price = req.body.area * dataConfig.pricesqft;
        next();
    };

    exports.insertAsset = (req, res) => {
        var tokenID = req.app.tokenID;
        var user = req.app.userID;
        var assetObj = {
            "tokenID": tokenID,
            "name": req.body.name,
            "address": req.body.address,
            "owner": user,
            "price": req.app.price,
            "area": req.body.area,
            "latlong": req.body.latlong
        };
        const asset = new Asset(assetObj);
        asset.save()
            .then(data => {
                res.send({ statusCode: 200, result: dataConfig.AssetRegistration });
            })
            .catch(err => {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };

    //end of create asset
} catch (error) {

}