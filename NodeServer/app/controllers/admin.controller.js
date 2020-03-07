try {
    const dataConfig = require('../config/data.config.js');
    const shortid = require('shortid');
    const Asset = require('../models/asset.model');
    const User = require('../models/user.model');
    var mongoose = require('mongoose');
    var dice = require('dice-coefficient')
    const Notification = require('../models/notification.model');

    exports.revertTransactions = (req, res, next) => {
        Notification.find({ deal: false, active: true })
            .select({ _id: 1, proposalAddr: 1, proposedAmount: 1, datetime: 1 })
            .then(nots => {
                console.log(nots.length)
                var fnlRes = [];
                if (nots.length > 0) {
                    for (var not of nots) {
                        // // To calculate the time difference of two dates 
                        // var Difference_In_Time = (new Date()).getTime() - (new Date(not["datetime"])).getTime();
                        // // console.log(Difference_In_Time)
                        // // To calculate the no. of days between two dates 
                        // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                        // console.log(Difference_In_Days)
                        // if (Math.floor(Difference_In_Days) >= 1) {
                        fnlRes.push({ _to: not["proposalAddr"], _value: not["proposedAmount"], _id: not["_id"], done: false })
                        // }
                    }
                    if (fnlRes.length > 0) {
                        req.app.result = fnlRes;
                        console.log(fnlRes.length);
                        next();
                        //  res.json({ statusCode: 200, result: "done" })
                    }
                    else {
                        res.json({ statusCode: 200, result: "No Notifications" })
                    }

                }
                else {
                    res.json({ statusCode: 200, result: "No Notifications" })
                }
                //res.json(fnlRes);
            })
            .catch(err => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    }

    exports.revertTransUpdate = (req, res) => {
        console.log("revert ")
        const updateNotification = (not) => {
            return new Promise((resolve, reject) => {
                Notification.updateOne({ _id: mongoose.Types.ObjectId(not["_id"]) }, { $set: { active: false, deal: false } })
                    .then(r => {
                        resolve(true);
                    })
                    .catch(err => {
                        reject(err)
                    });
            });
        }
        const noti = async () => {
            for (var not of req.app.result) {
                console.log(not)
                if (not["done"]) {
                    await updateNotification(not);
                }
            }
            return true;
        }

        noti().then(r => {
            if (r) {
                res.json({ statusCode: 200, result: "done" })
            }
        })
            .catch(err => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    }

    //create a new Asset
    // goes to web3 controller first and comes back here(insertAsset)
    exports.createAsset = (req, res, next) => {
        //generate a random string
        // blockchain has owner and tokenID
        //we store tokenID in mongo as well to link with the metadata

        Asset.find({ address: req.body.address })
            .then(r => {
                console.log(r)
                if (r.length == 0) {
                    var rndStr = shortid.generate();
                    req.app.randomStr = rndStr;
                    req.app.price = req.body.area * dataConfig.pricesqft;
                    req.app.latlong = Math.floor(Math.random() * (90 - (-90) + 1) + (-90)) + "/" + Math.floor(Math.random() * (180 - (-180) + 1) + (-180))
                    next();
                }
                else {
                    res.json({ statusCode: 500, result: "Address already exists" })
                }
            })
            .catch(err => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });

    };
    function randomNumber() {
        return Math.floor(Math.random() * 9) + 1;
    }
    exports.insertAsset = (req, res) => {
        var tokenID = req.app.tokenID;
        //var user = req.body.userID;
        var assetObj = {
            "tokenID": tokenID,
            "name": req.body.name,
            "address": req.body.address,
            //  "owner": user,
            "picture": randomNumber() + ".jpg",
            "price": req.app.price,
            "area": req.body.area,
            "latlong": req.app.latlong
        };
        //console.log(assetObj);
        const asset = new Asset(assetObj);
        asset.save()
            .then(data => {
                //console.log(data)
                res.json({ statusCode: 200, result: dataConfig.AssetRegistration });
            })
            .catch(err => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    //end of create asset

    //get asset details
    exports.getAssetDetails = (req, res, next) => {
        //console.log(req.params.id)
        console.log("getAssetDetails")
        var assetID = mongoose.Types.ObjectId(req.params.id)
        //console.log(assetID)
        Asset.find({ _id: assetID })
            .then(r => {
                //console.log(r)
                if (r != null || r != undefined) {
                    req.app.assetD = r;
                    console.log("next")
                    next();
                }
            })
            .catch(err => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    exports.getUserDetails = (req, res, next) => {
        var address = req.body.address;
        User.find({ address: address })
            .select({ username: 1, _id: 0, email: 1, address: 1 })
            .then(r => {
                // console.log(r)
                req.app.user = r;
                next();
            })
            .catch(err => {
                res.json({
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
                res.json({ statusCode: 200, result: asset });
            })
            .catch(err => {
                res.json({
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
                    .select({ "name": 1, "_id": 1, "picture": 1, hidden: 1 })
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
            res.json({ statusCode: 200, result: result })
        })
            .catch(r => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    //end of get asset details

    exports.getAllUsers = (req, res) => {
        User.find({ $and: [{ usertype: { $ne: "admin" } }, { active: true }] })
            .select({ username: 1, email: 1, _id: 1 })
            .then(r => {
                res.json({ statusCode: 200, result: r });
            })
            .catch(r => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };

    exports.getUserNameFrmAddress = async (req, res) => {
        console.log("getUserNameFrmAddress")
        var fnlRes = [];
        var getData = (ad) => {
            return new Promise((resolve, reject) => {
                try {
                    // console.log(ad)
                    regex = ad.map(function (e) { return new RegExp(e, "i"); });
                    User.find({ address: { $in: regex } })
                        //User.find({ address: ad1 })
                        .select({ username: 1, _id: 0, address: 1 })
                        .then(r => {
                            // console.log(r)
                            resolve(r);
                        })
                        .catch(r => {
                            reject(r);
                        });
                } catch (error) {
                    reject(error);
                }

            });
        }
        var details = async () => {

            var result = req.app.result;
            // console.log(result)
            //var reldup = result;
            req.app.result = null;
            var ret = [];
            for (var value of result) {
                var ad = []
                var ad1 = value["from"]
                var ad2 = value["to"]
                if (String(ad1).includes('0x')) {
                    ad.push(String(ad1).toLowerCase())
                }
                if (String(ad2).includes('0x')) {
                    ad.push(String(ad2).toLowerCase())
                }
                //console.log(ad1 + " " + ad2)
                if (ad.length > 0) {
                    var ret = await getData(ad);
                    for (var x of ret) {
                        if (String(x["address"]).toLowerCase() == value["from"].toLowerCase()) {
                            value["from"] = x["username"]
                        }
                        if (String(x["address"]).toLowerCase() == value["to"].toLowerCase()) {
                            value["to"] = x["username"]
                        }
                    }
                }

            }
            return result.reverse();
            //console.log(result)
        }

        details().then(r => {
            //console.log(r)
            res.json({ statusCode: 200, result: r })
        })
            .catch(r => {
                console.log(r)
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })

            });
    }
    exports.getAllUserDetails = (req, res, next) => {
        User.find({ $and: [{ usertype: { $ne: "admin" } }, { active: true }, { _id: req.params.id }] })
            .select({ username: 1, email: 1, _id: 1, address: 1 })
            .then(r => {
                //res.json({ statusCode: 200, result: r });
                if (r.length > 0) {
                    req.app.details = r;
                    next();
                }
                else {
                    res.json({ statusCode: 300, result: "Found Nothing" })
                }

            })
            .catch(r => {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };

    exports.getSearchedAssets = (req, res) => {
        var threshold = 0.25
        var q = req.params.id
        Asset.find()
            .select({ "name": 1, "_id": 1, "picture": 1 })
            .then(data => {
                var fnlJson = []
                //console.log(data)
                data.forEach(d => {
                    //console.log(Object.keys(d.toObject()))
                    Object.keys(d.toObject()).forEach(function (key) {
                        // console.table('Key : ' + key + ', Value : ' + d[key])
                        if (dice(String(d[key]).toLowerCase(), String(q).toLowerCase()) >= threshold) {
                            fnlJson.push(d)
                        }
                    })
                    //return false
                    //console.log("next loop")
                })
                fnlJson = [...new Set(fnlJson)];
                //console.log("ou loop")
                res.json({ statusCode: 200, result: fnlJson })
            })
            .catch(r => {
                console.log(r)
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };

    exports.toggleAsset = (req, res) => {
        var assetID = req.body.id
        var state = req.body.state
        state = (state == 1) ? "true" : "false";
        console.log(state)
        Asset.updateOne({ _id: mongoose.Types.ObjectId(assetID) }, { $set: { hidden: state } })
            .then(r => {
                res.json({ statusCode: 200, result: true });
            })
            .catch(r => {
                res.json({ statusCode: 500, result: false });
            })
    }

    exports.getuserAssets = (req, res) => {
        //res.json(req.app.details)
        var details = req.app.details;
        Asset.find({ tokenID: { $in: details.tokenIds } })
            .select({ name: 1, _id: 1 })
            .then(r => {
                //details = details.toObject();
                delete details.tokenIds
                details.assets = r;
                res.json({ statusCode: 200, result: details })

            })
            .catch(r => {
                console.log(r)
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    }

    exports.someTest = (req, res) => {
        //console.log(Date.now())
        res.json(Date.now())
    }
} catch (error) {

}
