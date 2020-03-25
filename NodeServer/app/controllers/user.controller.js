const Asset = require('../models/asset.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const Ticket = require('../models/ticket.model');
const TicketResp = require('../models/ticketresponse.model');
const dataConfig = require('../config/data.config.js');
var mongoose = require('mongoose');
var dice = require('dice-coefficient')
const logger = require('../../logger');
const common = require('../config/common');
var path = require('path');

exports.getUserDetails = (req, res, next) => {
    logger.info(common.debugLine(''))
    try {

        //console.log("getUserDetails")
        var address = String(req.body.address).trim();
        //console.log(address)
        User.find({ address: address })
            .select({ username: 1, _id: 0, email: 1, address: 1, homephone: 1, homeaddress: 1, homepostalcode: 1 })
            .then(r => {
                //console.log(r)
                req.app.locals.user = r;
                next();
            })
            .catch(err => {
                logger.error(common.debugLine(err));
                logger.error(common.debugLine(common.generateReq(req)));
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    } catch (error) {
        logger.error(common.debugLine(error));
        logger.error(common.debugLine(common.generateReq(req)));
        res.json({
            statusCode: 500,
            result: dataConfig.GlobalErrMsg
        })
    }
};

exports.createTicket = (req, res, next) => {
    logger.info(common.debugLine(''))

    var ticketJsn = {
        "subject": req.body.subject,
        //"description":req.body.desc,
        "owner": req.body.address,
        "filePath": String(req.body.address).toString().concat('_', req.body.date, '_', req.file.originalname)
    }
    //console.log(ticketJsn)
    var ticketObj = new Ticket(ticketJsn)
    console.log(ticketObj)
    ticketObj.save()
        .then(r => {
            ticketObj = null
            //res.json({statusCode:200,result:true})
            User.find({ address: req.body.address })
                .select({ username: 1 })
                .then(rr => {
                    req.app.locals.user = rr[0]["username"]
                    req.app.locals.tickid = r["_id"]
                    next()
                })
                .catch(err => {
                    logger.error(common.debugLine(err));
                    logger.error(common.debugLine(common.generateReq(req)));
                    res.json({
                        statusCode: 500,
                        result: dataConfig.GlobalErrMsg
                    })
                });
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });

}

exports.createTicketReponse = (req, res) => {
    logger.info(common.debugLine(''))
    let tickJsn = {
        "ticketID": req.app.locals.tickid,
        "name": req.app.locals.user,
        "comment": req.body.desc,
        "owner": req.body.address
    }
    var tickReObj = new TicketResp(tickJsn)
    tickReObj.save()
        .then(r => {
            if (r["_id"]) {
                res.json({
                    statusCode: 200,
                    result: true
                })
            }
            else {
                res.json({
                    statusCode: 300,
                    result: false
                })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.getTickets = (req, res) => {
    logger.info(common.debugLine(''))
    var address = req.params.id
    Ticket.find({ owner: address })
        .sort({ createdAt: 1, resolved: 1 })
        .then(r => {
            // console.log(r)
            if (r.length > 0) {
                res.json({ statusCode: 200, result: r })
            }
            else {
                res.json({ statusCode: 300, result: false })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.getTicketDetails = (req, res, next) => {
    logger.info(common.debugLine(''))
    Ticket.find({ _id: mongoose.Types.ObjectId(req.body.ticketID), owner: req.body.address })
        .select({ owner: 0, _id: 0 })
        .then(r => {
            if (r.length > 0) {
                var clone = JSON.parse(JSON.stringify(Object.create(r[0])))
                var createdAt = (new Date(clone["createdAt"])).toDateString();
                var updatedAt = (new Date(clone["updatedAt"])).toDateString();
                //console.log(clone['createdAt'])
                // clone.updatedAt = updatedAt
                clone["filePath"] = String(r[0]["filePath"]).split('___')[String(r[0]["filePath"]).split('___').length - 1]
                clone["createdAt"] = createdAt
                clone["updatedAt"] = updatedAt
                req.app.locals.ticket = clone
                next();
            }
            else {
                res.json({ statusCode: 300, result: false })
            }

        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.getTicketResponses = (req, res) => {
    TicketResp.find({ ticketID: mongoose.Types.ObjectId(req.params.id) })
        .select({ name: 1, comment: 1, createdAt: 1, _id: 0 })
        .then(r => {
            // console.log(r)
            var clone = [];
            for (var i = 0; i < r.length; i++) {
                clone.push(JSON.parse(JSON.stringify(Object.create(r[i]))))
            }
            for (var i = 0; i < clone.length; i++) {
                clone[i]["createdAt"] = (new Date(clone[i]["createdAt"])).toDateString();
            }
            //console.log(clone)
            res.json({ statusCode: 200, response: clone, ticket: req.app.locals.ticket })
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.updateAssetDetails = (req, res) => {
    logger.info(common.debugLine(''))
    Asset.updateOne({ _id: mongoose.Types.ObjectId(req.body.assetID) }, { $set: { price: req.body.amount } })
        .then(r => {
            if (r["nModified"] > 0) {
                res.json({
                    statusCode: 200,
                    result: true
                })
            }
            else {
                res.json({
                    statusCode: 300,
                    result: "something went wrong"
                })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.resolveTicket = (req, res) => {
    logger.info(common.debugLine(''))
    var state = req.body.state
    state = (state == 1) ? "true" : "false";
    Ticket.updateOne({ _id: mongoose.Types.ObjectId(req.body.ticketID) }, { $set: { resolved: state } })
        .then(r => {
            res.json({ statusCode: 200, result: true });
        })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({ statusCode: 500, result: false });
        })
}

exports.createComment = (req, res) => {
    logger.info(common.debugLine(''))
    let tickJsn = {
        "ticketID": req.body.ticketID,
        "name": req.body.username,
        "comment": req.body.comment,
        "owner": req.body.address
    }
    let tickObj = new TicketResp(tickJsn);
    tickObj.save()
        .then(r => {
            //console.log(r)
            if (r["_id"]) {
                Ticket.updateOne({ _id: mongoose.Types.ObjectId(req.body.ticketID) }, { $set: { resolved: false } })
                    .then(rr => {
                        res.json({ statusCode: 200, result: true })
                    })
                    .catch(err => {
                        logger.error(common.debugLine(err));
                        logger.error(common.debugLine(common.generateReq(req)));
                        res.json({
                            statusCode: 500,
                            result: dataConfig.GlobalErrMsg
                        })
                    });

            }
            else {
                res.json({ statusCode: 300, result: false })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}
exports.updateUserDetails = (req, res) => {
    logger.info(common.debugLine(''))
    User.updateOne({ address: req.body.address }, { $set: { homephone: req.body.phone, homeaddress: req.body.homeaddress, homepostalcode: req.body.postal } })
        .then(r => {
            // console.log(r)
            if (r["nModified"] > 0) {
                res.json({
                    statusCode: 200,
                    result: true
                })
            }
            else {
                res.json({
                    statusCode: 300,
                    result: "something went wrong"
                })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.getAllUserDetails = (req, res, next) => {
    logger.info(common.debugLine(''))
    User.find({ $and: [{ usertype: { $ne: "admin" } }, { active: true }, { address: req.params.id }] })
        .select({ username: 1, email: 1, _id: 1, address: 1, homeaddress: 1, homepostalcode: 1, homePhone: 1 })
        .then(r => {
            //res.json({ statusCode: 200, result: r });
            if (r.length > 0) {
                req.app.locals.details = r;
                next();
            }
            else {
                res.json({ statusCode: 300, result: "Found Nothing" })
            }

        })
        .catch(r => {
            logger.error(common.debugLine(r))
            logger.error(common.debugLine(common.generateReq(req)))
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};
exports.getuserAssets = (req, res) => {
    logger.info(common.debugLine(''))
    var details = req.app.locals.details;
    Asset.find({ tokenID: { $in: details.tokenIds } })
        .select({ name: 1, _id: 1 })
        .then(r => {
            //details = details.toObject();
            delete details.tokenIds
            details.assets = r;
            res.json({ statusCode: 200, result: details })

        })
        .catch(r => {
            logger.error(common.debugLine(r))
            logger.error(common.debugLine(common.generateReq(req)))
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.getAllAssets = async (req, res) => {
    logger.info(common.debugLine(''))
    var result = [];
    const details = async () => {
        var tokenIDs = req.app.locals.tokenIDs
        for (var token of tokenIDs) {
            const ret = await getDetails(token);
            // //console.log(ret)
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
        req.app.locals.tokenIDs = null;
        res.json({ statusCode: 200, result: result })
    })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
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
exports.addNotifications = (req, res, next) => {
    logger.info(common.debugLine(''))
    // proposal request data is stored on mongoDB only since, it is temporary...
    // the only thing that goes into blockchain is the amount for token(EMP) tracking
    var obj = new Notification(generateKeyValueFromBody(req.body));

    obj.save()
        .then(r => {
            if (r != null || r != undefined) {
                req.app.locals.transferType = "Purchase Proposal Request"
                req.body.to = req.body.proposalAddr;
                req.body.proposalAddr = null;
                req.body.amount = req.body.proposedAmount
                req.body.proposedAmount = null;
                next();
                //res.json({ statusCode: 200, result: dataConfig.Proposal });
            }
            else {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
        })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}
//get asset token

exports.getAssetToken = (req, res, next) => {
    logger.info(common.debugLine(''))
    var assetID = req.body.assetID;//mongoID
    Asset.find({ _id: assetID })
        .select({ tokenID: 1, _id: 0 })
        .then(r => {
            if (r != null || r != undefined) {
                req.app.locals.tokenID = r[0]["tokenID"];
                req.app.locals.transferType = "Property Purchase"
                //console.log(req.app.locals)
                next();
                //res.json(r[0]);
            }
            else {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};

//end of asset token
exports.getUserNameFrmAddress = async (req, res) => {
    logger.info(common.debugLine(''))
    var fnlRes = [];
    var getData = (ad) => {
        return new Promise((resolve, reject) => {
            try {
                // //console.log(ad)
                regex = ad.map(function (e) { return new RegExp(e, "i"); });
                User.find({ address: { $in: regex } })
                    //User.find({ address: ad1 })
                    .select({ username: 1, _id: 0, address: 1 })
                    .then(r => {
                        // //console.log(r)
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

        var result = req.app.locals.result;
        // //console.log(result)
        //var reldup = result;
        req.app.locals.result = null;
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
            ////console.log(ad1 + " " + ad2)
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
        ////console.log(result)
    }

    details().then(r => {
        ////console.log(r)
        res.json({ statusCode: 200, result: r })
    })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })

        });
}

exports.generateHTML = (req, res) => {
    logger.info(common.debugLine(''))
    var asset = req.app.locals.assetD[0]
    var history = req.app.locals.history
    var data = ''
    for (var i = 0; i < history.length; i++) {
        data = data.concat(`<tr><td> ${history[i]["date"]}</td><td>${history[i]["from"]}</td><td>${history[i]["to"]}</td></tr>`)
    }
    var html = `
    <html>

    <head>
        <link href="https://fonts.googleapis.com/css?family=Pacifico&display=swap" rel="stylesheet">
    </head>
    
    <body style="font-family: 'Pacifico', cursive;">
        <div align="right">
            <h4>Ticket ID : ${String(String(asset["_id"]).substr(String(asset["_id"]).length - 8)).toUpperCase()}</h4>
        </div>
        <div align="center">
            <h1>Government of Canada</h1>
            <h4>Government of Ontario</h4>
        </div>
        <div align="center">
            <h1 style="font-family: 'Pacifico', cursive;">Title History Document</h1>
        </div>
        <hr>
        <div align="center">
        <h4>Asset Details</h4>
    </div>
    <div style="overflow-x:auto;">
        <table>
            <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City,Province</th>
            <th>Postal</th>
            <th>Area (SqFt)</th>
            </tr>
            <tr>
            <td>${asset["name"]}</td>
            <td>${asset["address"]}</td>
            <td>${asset["city"]} , ${asset["province"]} </td>
            <td>${asset["postalcode"]}</td>
            <td>${asset["area"]}</td>
            </tr>
        </table>
        </div>
        <br>
        <div align="center">
        <h4>Transaction History</h4>
    </div>
    <table>
<tr>
<th> Date</th>
<th> From</th>
<th> To</th>
</tr>
{data}
    </table>
    </body>
    
    </html>
    `
    html = html.replace('{data}', data)
    //console.log(data)
   // console.log(html)
    //res.json({ statusCode: 200, result: req.app.locals.history, response: req.app.locals.assetD })
    res.json({ statusCode: 200, result: html})
}

exports.getUserNameFrmAddressDown = async (req, res, next) => {
    logger.info(common.debugLine(''))
    var fnlRes = [];
    var getData = (ad) => {
        return new Promise((resolve, reject) => {
            try {
                // //console.log(ad)
                regex = ad.map(function (e) { return new RegExp(e, "i"); });
                User.find({ address: { $in: regex } })
                    //User.find({ address: ad1 })
                    .select({ username: 1, _id: 0, address: 1 })
                    .then(r => {
                        // //console.log(r)
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

        var result = req.app.locals.result;
        // //console.log(result)
        //var reldup = result;
        req.app.locals.result = null;
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
            ////console.log(ad1 + " " + ad2)
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
        ////console.log(result)
    }

    details().then(r => {
        req.app.locals.history = r
        next()
        //res.json({ statusCode: 200, result: r })
    })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })

        });
}


//get asset details
exports.getAssetDetails = (req, res, next) => {
    logger.info(common.debugLine(''))
    ////console.log(req.params.id)
    var assetID = mongoose.Types.ObjectId(req.params.id)
    // //console.log(assetID)
    Asset.find({ _id: assetID, hidden: false })
        .then(r => {
            ////console.log(r)
            if (r != null || r != undefined) {
                req.app.locals.assetD = r;
                next();
            }
            else {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};

//get asset details
exports.getAssetDetailsTwo = (req, res, next) => {
    logger.info(common.debugLine(''))
    ////console.log(req.params.id)
    var assetID = mongoose.Types.ObjectId(req.body.assetID)
    // //console.log(assetID)
    Asset.find({ _id: assetID, hidden: false })
        .then(r => {
            ////console.log(r)
            if (r != null || r != undefined) {
                req.app.locals.assetD = r;
                next();
            }
            else {
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            }
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};
exports.toggleAsset = (req, res) => {
    logger.info(common.debugLine(''))
    var assetID = req.body.id
    var state = req.body.state
    state = (state == 1) ? "true" : "false";
    //console.log(state)
    Asset.updateOne({ _id: mongoose.Types.ObjectId(assetID) }, { $set: { hidden: state } })
        .then(r => {
            res.json({ statusCode: 200, result: true });
        })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({ statusCode: 500, result: false });
        })
}
exports.getUserAssets = (req, res) => {
    logger.info(common.debugLine(''))
    var tokenIDs = req.app.locals.tokenIDs
    Asset.find({ tokenID: { $in: tokenIDs } })
        .select({ picture: 1, name: 1, _id: 1 })
        .then(r => {
            res.json({ statusCode: 200, result: r })
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
}

exports.getUserAddress = (req, res, next) => {
    logger.info(common.debugLine(''))
    var id = req.params.id
    User.find({ _id: mongoose.Types.ObjectId(id) })
        .select({ address: 1, _id: 0 })
        .then(r => {
            req.app.locals.address = r[0];
            next();
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};

exports.getUserName = (req, res) => {
    logger.info(common.debugLine(''))
    var asset = req.app.locals.assetD[0];
    User.find({ address: asset["owner"] })
        .select({ username: 1, _id: 0, address: 1 })
        .then(r => {
            req.app.locals.assetD[0] = null;
            //asset = asset.toObject();
            delete asset.tokenID
            asset.owner = r[0].username;
            asset.ownerAdd = r[0].address;
            ////console.log(asset)
            res.json({ statusCode: 200, result: asset });
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};


exports.getAllProposalUsers = (req, res) => {
    logger.info(common.debugLine(''))
    var assets = req.app.locals.notassets;
    var users = [];
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    for (var asset of assets) {
        users.push(asset.owner)
        users.push(asset.proposalAddr)
    }
    users = users.filter(onlyUnique);
    User.find({ address: { $in: users } })
        .select({ username: 1, address: 1, _id: 0 })
        .then(r => {
            // //console.log(r)
            for (var asset of assets) {
                ////console.log(asset)
                for (var x of r) {
                    if (String(x["address"]).toLowerCase() == String(asset["owner"]).toLowerCase()) {
                        asset["owner_username"] = x["username"]
                    }
                    if (String(x["address"]).toLowerCase() == String(asset["proposalAddr"]).toLowerCase()) {
                        asset["proposalAddr_username"] = x["username"]
                    }
                }
            }
            res.json({ statusCode: 200, result: assets })
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });

};


exports.getAllUserProposals = (req, res, next) => {
    logger.info(common.debugLine(''))
    var usrAddress = req.params.id;

    Notification.aggregate([

        { $match: { $and: [{ "active": true }, { "owner": usrAddress }] } }
        ,
        {
            $lookup: {
                from: "Asset",
                localField: "assetId",
                foreignField: "_id",
                as: "asset_data"
            }
        }
        ,
        { $unwind: "$asset_data" }
        ,
        {
            $project: {
                proposedAmount: "$proposedAmount",
                _id: 1,
                assetId: "$assetId",
                propertyValue: "$propertyValue",
                owner: "$owner",
                proposalAddr: "$proposalAddr",
                name: "$asset_data.name",
                propertyAddr: "$asset_data.address"
            }
        }
    ])
        .then(r => {
            if (r.length > 0) {
                req.app.locals.notassets = r;
                next();
            }
            else {
                res.json({ statusCode: 300, result: "no records" })
            }

        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });

}

exports.rejectProposal = (req, res, next) => {
    logger.info(common.debugLine(''))
    var assetID = req.body.assetID;
    var notID = req.body.notID;
    req.app.locals.transferType = "[Rejected] Purchase Proposal"
    Notification.updateOne({ _id: mongoose.Types.ObjectId(notID) }, { $set: { active: false, deal: false } })
        .then(r => {
            next();
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};

exports.toggleNotification = (req, res, next) => {
    logger.info(common.debugLine(''))
    var data = req.app.locals.proposal;
    // Notification.updateMany({ assetId: mongoose.Types.ObjectId(data["assetId"]) }, { $set: { active: false, deal: false } })
    //     .then(r => {
    // //console.log(r)
    Notification.updateOne({ _id: mongoose.Types.ObjectId(data["_id"]) }, { $set: { deal: true, active: false } })
        .then(r => {
            ////console.log(r)
            //req.app.proposal = null;
            ////console.log(req.app)
            next();
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            //console.log(err)
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
    // })
    // .catch(err => {
    //     //console.log(err)
    //     res.json({
    //         statusCode: 500,
    //         result: dataConfig.GlobalErrMsg
    //     })
    // });
};
exports.getSearchedAssets = (req, res) => {
    logger.info(common.debugLine(''))
    var threshold = 0.25
    var q = req.body.value
    var ownedTokens = req.app.locals.tokenIDs
    Asset.find({ hidden: false, tokenID: { $nin: ownedTokens } })
        .select({ "name": 1, "_id": 1, "picture": 1, "address": 1, "postalcode": 1, "city": 1, province: 1 })
        .then(data => {
            var fnlJson = []
            ////console.log(data)
            data.forEach(d => {
                var temp = ['_id', 'picture']
                Object.keys(d.toObject()).forEach(function (key) {
                    // console.table('Key : ' + key + ', Value : ' + d[key])
                    if (!temp.includes(key)) {
                        if (dice(String(d[key]).toLowerCase(), String(q).toLowerCase()) >= threshold) {
                            fnlJson.push(d)
                        }
                    }
                })
                //return false
                ////console.log("next loop")
            })
            fnlJson = [...new Set(fnlJson)];
            ////console.log("ou loop")
            res.json({ statusCode: 200, result: fnlJson })
        })
        .catch(r => {
            logger.error(common.debugLine(r));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
};
exports.approveProposal = (req, res, next) => {
    logger.info(common.debugLine(''))
    //check whether any amount has been transferred to admin
    //console.log("approveProposal")

    //check whether the proposal expired or not
    //finally deactivate all other proposals on this asset
    var notID = req.body.notID;
    //console.log(notID)
    Notification.aggregate([
        { $match: { $and: [{ "active": true }, { _id: mongoose.Types.ObjectId(notID) }] } }
        //{ $match: { _id: mongoose.Types.ObjectId(notID) } }
        ,
        {
            $lookup: {
                from: "Asset",
                localField: "assetId",
                foreignField: "_id",
                as: "asset_data"
            }
        }
        ,
        { $unwind: "$asset_data" }
        ,
        {
            $project: {
                proposedAmount: "$proposedAmount",
                _id: 1,
                assetId: "$assetId",
                propertyValue: "$propertyValue",
                owner: "$owner",
                proposalAddr: "$proposalAddr",
                tokenID: "$asset_data.tokenID"
            }
        }
    ])
        .then(data => {
            ////console.log(data)
            if (data.length > 0) {

                req.app.locals.proposal = data[0];
                // req.body.to = data["proposalAddr"]
                // req.body.owner = data["owner"]
                // req.body.amount = data["proposedAmount"]
                req.app.locals.transferType = "[Approved] Purchase Proposal"
                req.app.locals.tokenID = data[0]["tokenID"]
                ////console.log(req.app.tokenID)
                //res.json(data);
                next()
            }
            else {

                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })

            }
            //res.json(data)
        })
        .catch(err => {
            logger.error(common.debugLine(err));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({
                statusCode: 500,
                result: dataConfig.GlobalErrMsg
            })
        });
    //res.json("Asd");
};