try {
    const dataConfig = require('../config/data.config.js');
    const shortid = require('shortid');
    const Asset = require('../models/asset.model');
    const User = require('../models/user.model');
    var mongoose = require('mongoose');

    //create a new Asset
    // goes to web3 controller first and comes back here(insertAsset)
    exports.createAsset = (req, res, next) => {
        //generate a random string
        // blockchain has owner and tokenID
        //we store tokenID in mongo as well to link with the metadata
        var rndStr = shortid.generate();
        req.app.randomStr = rndStr;
        req.app.price = req.body.area * dataConfig.pricesqft;
        req.app.latlong = Math.floor(Math.random() * (90 - (-90) + 1) + (-90)) + "/" + Math.floor(Math.random() * (180 - (-180) + 1) + (-180))
        next();
    };
    function randomNumber() {
        return Math.floor(Math.random() * 9)+1;
    }
    exports.insertAsset = (req, res) => {
        var tokenID = req.app.tokenID;
        //var user = req.body.userID;
        var assetObj = {
            "tokenID": tokenID,
            "name": req.body.name,
            "address": req.body.address,
            //  "owner": user,
            "picture":randomNumber(),
            "price": req.app.price,
            "area": req.body.area,
            "latlong": req.app.latlong
        };
        //console.log(assetObj);
        const asset = new Asset(assetObj);
        asset.save()
            .then(data => {
                //console.log(data)
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

    //get asset details
    exports.getAssetDetails = (req, res, next) => {
        //console.log(req.params.id)
        var assetID = mongoose.Types.ObjectId(req.params.id)
        //console.log(assetID)
        Asset.find({ _id: assetID })
            .then(r => {
                //console.log(r)
                if (r != null || r != undefined) {
                    req.app.assetD = r;
                    next();
                }
            })
            .catch(err => {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    exports.getUserDetails = (req,res,next)=>{
        var address = req.body.address;
        User.find({address:address})
        .select({username:1,_id:0,email:1,address:1})
        .then(r=>{
           // console.log(r)
            req.app.user=r;
            next();
        })
        .catch(err => {
            res.send({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
    };
    exports.getUserName = (req, res) => {

        var asset = req.app.assetD[0];
        User.find({ address: asset["owner"] })
            .select({ username: 1, _id: 0 })
            .then(r => {
              
                req.app.assetD[0] = null;
                //asset = asset.toObject();
                delete asset.tokenID
                asset.owner = r[0].username;
                //console.log(asset)
                res.send(asset);
            })
            .catch(err => {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    //end of get asset details

    // get all assets
    //https://www.coreycleary.me/why-does-async-await-in-a-foreach-not-actually-await/
    exports.getAllAssets = async (req, res) => {
        var result = [];
        const details = async () => {
            var tokenIDs = req.app.tokenIDs
            for (var token of tokenIDs) {
                const ret = await getDetails(token);
                // console.log(ret)
                if (ret.length > 0) {
                    var filtered = ret.filter(function () { return true });
                    result.push(filtered[0]);
                }

            }
        }
        const getDetails = x => {
            return new Promise((resolve, reject) => {
                Asset.find({ tokenID: x })
                    .select({ "name": 1, "_id": 1, "picture": 1 })
                    .then(data => {
                        resolve(data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
        details().then(r => {
            req.app.tokenIDs = null;
            res.send(result)
        })
            .catch(r => {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    //end of get asset details
} catch (error) {

}