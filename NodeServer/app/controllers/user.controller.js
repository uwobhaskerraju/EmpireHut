const Asset = require('../models/asset.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const dataConfig = require('../config/data.config.js');
var mongoose = require('mongoose');

exports.getUserDetails = (req, res, next) => {
    // console.log("asdsd")
    var address = req.body.address;
    User.find({ address: address })
        .select({ username: 1, _id: 0, email: 1, address: 1 })
        .then(r => {
            // console.log(r)
            req.app.user = r;
            next();
        })
        .catch(err => {
            res.send({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};

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
            Asset.find({ tokenID: x, hidden: false })
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
        res.send({ statusCode: 200, result: result })
    })
        .catch(r => {
            res.send({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};
function generateKeyValueFromBody(body) {
    const entries = Object.keys(body)
    const inserts = {}
    for (let i = 0; i < entries.length; i++) {
        inserts[entries[i]] = Object.values(body)[i]
    }
    return inserts;
}
exports.addNotifications = (req, res) => {

    var obj = new Notification(generateKeyValueFromBody(req.body));

    obj.save()
        .then(r => {
            if (r != null || r != undefined) {
                res.send({ statusCode: 200, result: dataConfig.Proposal });
            }
            else {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
        })
        .catch(r => {
            res.send({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}
//get asset token

exports.getAssetToken = (req, res, next) => {
    var assetID = req.body.assetID;//mongoID
    Asset.find({ _id: assetID })
        .select({ tokenID: 1, _id: 0 })
        .then(r => {
            if (r != null || r != undefined) {
                req.app.tokenID = r[0]["tokenID"];
                console.log("mext")
                next();
                //res.send(r[0]);
            }
            else {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
        })
        .catch(err => {
            console.log(err.message)
            res.send({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};

//end of asset token


//get asset details
exports.getAssetDetails = (req, res, next) => {
    //console.log(req.params.id)
    var assetID = mongoose.Types.ObjectId(req.params.id)
    // console.log(assetID)
    Asset.find({ _id: assetID, hidden: false })
        .then(r => {
            //console.log(r)
            if (r != null || r != undefined) {
                req.app.assetD = r;
                next();
            }
            else {
                res.send({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
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
        .select({ username: 1, _id: 0, address: 1 })
        .then(r => {
            req.app.assetD[0] = null;
            //asset = asset.toObject();
            delete asset.tokenID
            asset.owner = r[0].username;
            asset.ownerAdd = r[0].address;
            //console.log(asset)
            res.send({ statusCode: 200, result: asset });
        })
        .catch(err => {
            res.send({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};