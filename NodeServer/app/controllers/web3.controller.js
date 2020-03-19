try {

    const Web3 = require('web3')
    require('dotenv').config();
    const dataConfig = require('../config/data.config.js');
    const abiDecoder = require('abi-decoder');
    const assetDecoder = abiDecoder;
    const logger = require('../../logger');

    const rpcURL = process.env.blockURL
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL))

    //console.log(web3.version) //1.2.4
    // get count of contracts
    web3.eth.net.isListening().then((s) => {
        logger.info("web3.js connected to " + web3.currentProvider["host"]);
    }).catch((e) => {
        logger.error('Lost connection to the node, reconnecting');
        //web3.setProvider(your_provider_here);
        process.kill(process.pid, 'SIGTERM')
        //throw "Blockchain failed to connect. Exiting"
    })

    var adminAddr = null;
    web3.eth.getAccounts().then(r => { adminAddr = String(r[0]) })
    /************************ */
    // initialize contract variables
    const fs = require('fs');
    var path = require('path');
    var rootPath = path.join('.', 'build', 'contracts');
    var EMPTokenJSON = JSON.parse(fs.readFileSync(path.join(rootPath, 'EMPToken.json'), 'utf8'));
    var AssetToken = JSON.parse(fs.readFileSync(path.join(rootPath, 'AssetToken.json'), 'utf8'));

    if (EMPTokenJSON === undefined || AssetToken === undefined) {
        throw 'JSON files are missing'
    }

    const abi = EMPTokenJSON["abi"]
    const address = EMPTokenJSON["networks"][process.env.blockNetwork]["address"]
    const EMPContract = new web3.eth.Contract(abi, address)

    const asset_abi = AssetToken["abi"]
    const asset_address = AssetToken["networks"][process.env.blockNetwork]["address"]
    const assetcontract = new web3.eth.Contract(asset_abi, asset_address)


    abiDecoder.addABI(abi)
    assetDecoder.addABI(asset_abi);
    //track 10 ethereum accounts
    var usrID = [];
    function debugLine(message) {
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let fileName = frame.split(":")[1];
        fileName=fileName.split("\\")[fileName.split("\\").length-1];
        let lineNumber = frame.split(":")[2];
        let functionName = frame.split(" ")[5];
        return functionName + ":" +fileName  + ":" + lineNumber + " " + message;
    }
    /************************** */

    /**************************/
    // calls to EMPToken
    /**************************/

    exports.getOwner = (req, res) => {
        logger.info(debugLine());
        var admin = req.body.admin;
        EMPContract.methods.getOwner().call()
            .then(r => {
                console.log(r);
                if (r == admin) {
                    res.json({ statusCode: 200, result: true });
                }
                else {
                    res.json({ statusCode: 200, result: false });
                }
            })
            .catch(err => {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            });
    }

    exports.getBalance = async (req, res) => {
        try {
            var usrAddress = req.body.userID
            //var usrAddress = (await web3.eth.getAccounts())[3];
            //console.log(usrAddress);
            EMPContract.methods.balanceOf(usrAddress).call()
                .then(bal => {
                    //console.log(r);
                    res.json({ statusCode: 200, result: bal });
                })
                .catch(err => {
                    res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                });
        } catch (error) {
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }

    }

    exports.RegularTransfer = (req, res) => {
        console.log("RegularTransfer")
        try {
            //_from =user , _to=owner. it will be opposite in next()
            var _from = req.body.to;//(await web3.eth.getAccounts())[0];
            var _to = adminAddr;//(await web3.eth.getAccounts())[3];
            var value = req.body.amount;
            var type = req.app.transferType;
            console.log(_from + " " + _to + " " + value + " " + type)
            if (!web3.utils.isAddress(_from) || !web3.utils.isAddress(_to)) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            if (value <= 0) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            EMPContract.methods.transfer(_to, value, type).send({ from: _from, value: 1, gas: 1000000 })
                .then(bal => {
                    res.json({ statusCode: 200, result: bal });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                });
        } catch (error) {
            console.log(error);
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }

    };

    exports.RejectTransfer = (req, res) => {
        console.log("RejectTransfer")
        try {

            var _from = adminAddr;//(await web3.eth.getAccounts())[0];
            var _to = req.body.owner;//(await web3.eth.getAccounts())[3];
            var value = req.body.amount;
            var type = req.app.transferType;
            console.log(_from + " " + _to + " " + value + " " + type)
            if (!web3.utils.isAddress(_from) || !web3.utils.isAddress(_to)) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            if (value <= 0) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            EMPContract.methods.transfer(_to, value, type).send({ from: _from, value: 1, gas: 1000000 })
                .then(bal => {
                    res.json({ statusCode: 200, result: bal });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                });
        } catch (error) {
            console.log(error);
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }

    };

    exports.customTransferTo = (req, res, next) => {
        console.log("customTransferTo")
        try {

            var _from = adminAddr;//(await web3.eth.getAccounts())[0];
            var _to = req.body.owner;//(await web3.eth.getAccounts())[3];
            var value = req.body.amount;
            var type = req.app.transferType;

            if (!web3.utils.isAddress(_from) || !web3.utils.isAddress(_to)) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            if (value <= 0) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            console.log(_from + " " + _to + " " + value + " " + type)
            //next()
            EMPContract.methods.transfer(_to, value, type).send({ from: _from, value: 1, gas: 1000000 })
                .then(bal => {
                    //console.log(r);
                    // balance got deducted
                    console.log("next")
                    console.log(req.app.tokenID)
                    next();
                    //res.json({ statusCode: 200, data: { address: _to, balance: bal } });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                });
        } catch (error) {
            console.log(error);
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }
    }

    exports.transferTo = (req, res, next) => {
        console.log("transfer To")
        try {
            //_from =user , _to=owner. it will be opposite in next()
            var _from = req.body.to;//(await web3.eth.getAccounts())[0];
            var _to = req.body.owner;//(await web3.eth.getAccounts())[3];
            var value = req.body.amount;
            var type = req.app.transferType;

            if (!web3.utils.isAddress(_from) || !web3.utils.isAddress(_to)) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            if (value <= 0) {
                res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
            }
            EMPContract.methods.transfer(_to, value, type).send({ from: _from, value: 1, gas: 1000000 })
                .then(bal => {
                    //console.log(r);
                    // balance got deducted
                    console.log("next")
                    console.log(req.app.tokenID)
                    next();
                    //res.json({ statusCode: 200, data: { address: _to, balance: bal } });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                });
        } catch (error) {
            console.log(error);
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }

    };

    function randomNumber() {
        return Math.floor(Math.random() * 10);
    }
    exports.registerUser = async (req, res, next) => {
        try {
            var rndInt = null;
            //usrID.push(0)
            if (usrID.includes(0)) {
                while (true) {
                    rndInt = randomNumber();
                    if (usrID.includes(rndInt)) {
                        continue;
                    }
                    else {
                        usrID.push(rndInt)
                        req.app.locals.user = "user"
                        break;
                    }
                }
            }
            else {
                rndInt = 0;
                req.app.locals.user = "admin"
                usrID.push(rndInt)
            }
            //console.log(rndInt)
            var usrAddress = String((await web3.eth.getAccounts())[rndInt]);
            EMPContract.methods.registerUser(usrAddress).send({ from: usrAddress })
                .then(r => {
                    //res.json({ statusCode: 200, data: { address: usrAddress, result: dataConfig.UserRegistration } });
                    usrID.push(rndInt);
                    req.app.locals.usrAddress = usrAddress;
                    //console.log("next")
                    next();
                })
                .catch(err => {
                    logger.error(common.debugLine(err));
                    logger.error(common.debugLine(common.generateReq(req)));
                    var errMsg = null;
                    if (String(err.message).includes("revert User already Exists")) {
                        errMsg = "User Exists. Try to Login"
                    }
                    if (errMsg == null) {
                        errMsg = dataConfig.GlobalErrMsg;
                    }
                    res.json({ statusCode: 500, result: errMsg });
                });
        } catch (error) {
            logger.error(common.debugLine(error));
            logger.error(common.debugLine(common.generateReq(req)));
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }
    }

    exports.getUserDetails = (req, res) => {
        console.log("web3 getUserDetails")
        try {
            var user = req.app.user;
            // console.log(user)
            var usrAddress = user[0]["address"]
            //var usrAddress = (await web3.eth.getAccounts())[3];
            //console.log(usrAddress);
            if (web3.utils.isAddress(usrAddress)) {
                EMPContract.methods.balanceOf(usrAddress).call()
                    .then(bal => {
                        // console.log(bal);
                        user = user[0].toObject();
                        user.balance = bal;
                        req.app.user = null;
                        res.json({ statusCode: 200, result: user });
                    })
                    .catch(err => {
                        console.log(err)
                        res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                    });
            }
            else {
                throw "something";
            }

        } catch (error) {
            console.log(error)
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }
    };

    /**************************/
    // end to calls to EMPToken
    /**************************/

    /**************************/
    // calls to AssetToken
    /**************************/

    exports.transferAsset = (req, res) => {
        console.log("transfer asset")
        try {
            var _to = req.body.to;//(await web3.eth.getAccounts())[0];
            var _from = req.body.owner;//(await web3.eth.getAccounts())[3];
            var tokenID = req.app.tokenID;
            //console.log(req.body)
            //console.log(req.app)
            console.log(_from + " " + _to + " " + tokenID)
            //res.json("sdfdf")
            assetcontract.methods.transferAsset(_from, _to, tokenID).estimateGas({ from: _from, value: 50000 }, function (error, gas) {
                if (error) {
                    console.log(error)
                    res.json({ statusCode: 500, result: error });
                }
                // console.log("before")
                assetcontract.methods.transferAsset(_from, _to, tokenID).send({ from: _from, value: 50000, gas: gas })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        //console.log(receipt)
                        res.json({ statusCode: 200, result: receipt });
                    })
                    .on('error', function (error, receipt) {
                        console.log(error)
                        res.json({ statusCode: 500, result: error });
                    });

            });

        } catch (error) {
            console.log(error)
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }
    };
    // end of transferAsset

    //edit userID here
    exports.insertAssetweb3 = (req, res, next) => {
        //exports.insertAssetweb3 = (req, res) => {
        try {
            // var adminAddr = req.body.userID;

            var rndStr = String(web3.utils.soliditySha3(req.app.randomStr));
            console.log(rndStr);
            assetcontract.methods.createAsset(rndStr).send({ from: adminAddr, gas: 1000000 })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log("confirmation")
                    assetcontract.getPastEvents('Create', function (error, event) {
                        if (error) {
                            console.log(error)
                            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                        }
                        else {
                            console.log(event);
                            if (event.length > 0) {
                                req.app.tokenID = event[0]["returnValues"]["_tokenID"];
                                // console.log(req.app.tokenID);
                                // update mongoDB
                                next();
                            }
                            //res.json({ statusCode: 200, data: { address: adminAddr} });
                        }
                    });
                })
                .on('error', function (error, receipt) {
                    console.log(error)
                    res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                })

        } catch (error) {
            console.log(error)
            res.json({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }

    };

    exports.getUserTokenCount = (req, res) => {
        var adr = req.params.id;
        assetcontract.methods.tokenCount(adr).call()
            .then(r => {
                res.json({ statusCode: 200, result: r });
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });

    }

    exports.getTokenCount = (req, res) => {
        assetcontract.methods.tokenCount(adminAddr).call()
            .then(r => {
                res.json({ statusCode: 200, result: r });
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });

    }

    exports.getAssetDetails = (req, res, next) => {
        console.log("web3 getAssetDetails")
        //console.log(req.app.assetD);
        var tokenID = req.app.assetD[0]["tokenID"]
        var jsnObj = req.app.assetD[0];
        assetcontract.methods.ownerOf(tokenID).call()
            .then(r => {
                jsnObj = jsnObj.toObject();
                var a = Object.assign(jsnObj, { owner: r });
                req.app.assetD[0] = a;
                next();
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });
    };
    exports.getAllUserTokens = (req, res, next) => {
        // var user = adminAddr;
        // var user = req.body.userID;
        var ownedTokens = req.app.tokenIDs;
        console.log("getAllTokens")
        assetcontract.methods.getAllTokens().call()
            .then(r => {
                //res.json({ statusCode: 200, data: { address: adminAddr, result: r } });
                let difference = r.filter(x => !ownedTokens.includes(x));
                req.app.tokenIDs = difference;
                // console.log(r)
                next();
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });
    };
    exports.getAllTokens = (req, res, next) => {
        // var user = adminAddr;
        // var user = req.body.userID;
        // var ownedTokens=req.app.tokenIDs;
        console.log("getAllTokens")
        assetcontract.methods.getAllTokens().call()
            .then(r => {
                //res.json({ statusCode: 200, data: { address: adminAddr, result: r } });
                //let difference = r.filter(x => !ownedTokens.includes(x));
                req.app.tokenIDs = r;
                // console.log(r)
                next();
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });
    };
    exports.regularOwnedTokensOfUser = (req, res, next) => {
        var address = req.params.id
        // console.log(address);
        assetcontract.methods.ownedTokensOfUser(address).call()
            .then(r => {
                req.app.tokenIDs = r;
                next()
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });
    };
    exports.getTokensOfUser = (req, res, next) => {
        // var user = adminAddr;
        console.log("web3 getTokensOfUser")
        var user = req.body.userID;
        var tokenIDs = req.app.tokenIDs;
        var fnlTokens = []
        assetcontract.methods.ownedTokensOfUser(user).call()
            .then(r => {
                console.log("r " + r)
                //res.json({ statusCode: 200, data: { address: adminAddr, result: r } });
                if (r.length > 0) {
                    fnlTokens = tokenIDs.filter(x => !r.includes(x));
                    console.log(fnlTokens)
                    req.app.tokenIDs = fnlTokens;
                }
                next();
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });

    };

    exports.getUserAssetCount = (req, res, next) => {
        console.log("Get User Asset Count")
        // console.log(req.app.details)
        var resu = req.app.details[0];
        var address = resu["address"];
        assetcontract.methods.tokenCount(address).call()
            .then(r => {
                resu = resu.toObject();
                resu.ownedTokens = r;
                // res.json({ statusCode: 200, result: resu });
                assetcontract.methods.ownedTokensOfUser(address).call()
                    .then(data => {
                        resu.tokenIds = data
                        req.app.details = resu
                        next();
                    })
                    .catch(err => {
                        res.json({ statusCode: 500, result: err });
                    });
            })
            .catch(err => {
                res.json({ statusCode: 500, result: err });
            });

    };


    exports.getTransactions = async (req, res, next) => {
        var fnlResult = [];
        const loopTrans = (e, time, myaccount) => {
            return new Promise((resolve, reject) => {
                try {
                    //console.log(e)
                    var jsnData = {};
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    jsnData.date = (new Date(time)).toLocaleDateString("en-US", options)
                    //{from:,to:,amount:,date:,type:,description:}

                    //console.log(myaccount)
                    if (abiDecoder.decodeMethod(e.input)) {
                        //console.log(abiDecoder.decodeMethod(e.input))
                    }
                    else {
                        resolve([]);
                    }
                    // we are not looking for "e.to" bcoz "to" is always contract address
                    switch (abiDecoder.decodeMethod(e.input)["name"]) {
                        case "transfer":
                            // console.log(e.from)
                            // console.log(abiDecoder.decodeMethod(e.input))
                            jsnData.type = "Debit"
                            // _to
                            for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                    if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_to") {
                                        jsnData.to = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                    }
                                }
                            }
                            if (String(e.from).toLowerCase() == String(myaccount).toLowerCase()
                                || String(jsnData.to).toLowerCase() == String(myaccount).toLowerCase()) {
                                // if (e.from == myaccount) {
                                //console.log("inside")
                                jsnData.from = e.from;
                                //}
                                //_value
                                for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                    // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                    for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                        if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_value") {
                                            jsnData.amount = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                        }
                                    }
                                }
                                // //_desc
                                for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                    // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                    for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                        if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_desc") {
                                            jsnData.description = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                        }
                                    }

                                }
                                var temp = null;
                                for (x in abiDecoder.decodeMethod(e.input)["params"][2]) {
                                    if (x == "value") {
                                        temp = abiDecoder.decodeMethod(e.input)["params"][2][x]
                                    }
                                }
                                if (temp.includes("[Approved]")) {
                                    jsnData.type = "Credit"
                                    //jsnData.amount = "-"
                                }
                                if (temp.includes("[Rejected]") || temp.includes("[Expired]")) {
                                    jsnData.type = "Credit"
                                }
                            }
                            else {
                                jsnData = {};
                            }
                            break;
                        case "registerUser":
                            //console.log("e.from :" + e.from)
                            if (String(myaccount) == String(e.from)) {
                                //console.log("reg")
                                jsnData.from = "Canada Govt"
                                jsnData.to = e.from
                                jsnData.amount = 1000
                                jsnData.type = "Credit"
                                jsnData.description = "Registration"
                            }
                            break;
                        case "transferAsset":
                            // console.log("transferasset")
                            // _to
                            for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                    if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_to") {
                                        jsnData.to = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                    }
                                }
                            }
                            // _from
                            for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                    if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_from") {
                                        jsnData.from = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                    }
                                }
                            }
                            //console.log(jsnData)
                            if (String(jsnData.to).toLowerCase() == String(myaccount).toLowerCase()
                                || String(jsnData.from).toLowerCase() == String(myaccount).toLowerCase()) {
                                jsnData.amount = "-"
                                jsnData.type = "-"
                                jsnData.description = "Asset Transfer"
                            }

                            break;
                        default:
                            jsnData = {};
                            break;
                    }

                    //console.log(jsnData)
                    if (jsnData.hasOwnProperty('description')) {
                        // console.log("done")
                        resolve([jsnData]);
                    }
                    else {
                        resolve([]);
                    }

                } catch (error) {
                    reject(error);
                }

            });
        }
        const details = async () => {
            var myaccount = req.body.address;
            var endBlockNumber = await web3.eth.getBlockNumber();
            var startBlockNumber = 0;
            console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);

            for (var i = startBlockNumber; i <= endBlockNumber; i++) {
                if (i % 1000 == 0) {
                    console.log("Searching block " + i);
                }
                var block = await web3.eth.getBlock(i, true);
                // console.log(block)
                if (block != null && block.transactions != null) {
                    for (var trans of block.transactions) {
                        //console.log(trans)
                        var ret = await loopTrans(trans, block.timestamp, myaccount);
                        //console.log(ret.length)
                        if (ret.length > 0) {

                            var filtered = ret.filter(function () { return true });
                            fnlResult.push(filtered[0]);


                        }
                    }
                }
            }
        }
        details().then(r => {
            //req.app.tokenIDs = null;
            req.app.result = fnlResult;
            console.log("next")
            next();
            //res.json({ statusCode: 200, result: fnlResult })
        })
            .catch(r => {
                console.log(r)
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });

    };

    exports.revertTransactions = (req, res, next) => {
        console.log("revert transactions")
        const revert = (tran) => {
            return new Promise((resolve, reject) => {
                var fnlRes = [];
                EMPContract.methods.transfer(tran["_to"], tran["_value"], "[Expired] Purchase Proposal")
                    .send({ from: adminAddr, value: 1, gas: 1000000 })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        //console.log(receipt)
                        tran["done"] = true;
                        fnlRes.push(tran);
                        resolve(fnlRes)
                    })
                    .on('error', function (error, receipt) {
                        console.log(error)
                        tran["done"] = false;
                        fnlRes.push(tran);
                        reject(fnlRes);
                    })
            });

        }
        const details = async () => {
            var fnlRes = [];
            for (var tran of req.app.result) {
                console.log("inside")
                console.log(tran)
                var r = await revert(tran)
                console.log(r)
                fnlRes.push(r[0])
            }
            return fnlRes;
        }
        details()
            .then(r => {
                req.app.result = r;
                //console.log(r)
                next();
                // res.json({ statusCode: 200, result: req.app.result })
            })
            .catch(r => {
                console.log(r)
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });


    }

    exports.getAssetTransactions = (req, res, next) => {
        var fnlResult = [];
        const loopTrans = (e, time, tokenID) => {
            return new Promise((resolve, reject) => {
                try {
                    //console.log(e)
                    var jsnData = {};
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    jsnData.date = (new Date(time)).toLocaleDateString("en-US", options)
                    //{from:,to:,date:,description:}

                    //console.log(myaccount)
                    if (abiDecoder.decodeMethod(e.input)) {
                        // console.log(abiDecoder.decodeMethod(e.input))
                    }
                    else {
                        resolve([]);
                    }
                    // we are not looking for "e.to" bcoz "to" is always contract address
                    switch (abiDecoder.decodeMethod(e.input)["name"]) {
                        case "transferAsset":
                            // tokenID
                            var temp = null
                            for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                    if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "tokenID") {
                                        temp = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                    }
                                }
                            }
                            if (temp == tokenID) {
                                // _to
                                for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                    // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                    for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                        if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_to") {
                                            jsnData.to = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                        }
                                    }
                                }
                                // _from
                                for (var i = 0; i < abiDecoder.decodeMethod(e.input)["params"].length; i++) {
                                    // var x=abiDecoder.decodeMethod(e.input)["params"][i]
                                    for (x in abiDecoder.decodeMethod(e.input)["params"][i]) {
                                        if (abiDecoder.decodeMethod(e.input)["params"][i][x] == "_from") {
                                            jsnData.from = abiDecoder.decodeMethod(e.input)["params"][i]["value"]
                                        }
                                    }
                                }
                                jsnData.description = "Asset Transfer"
                            }
                            break;
                        // case "createAsset":
                        //     //var jsnData = {}
                        //     const loopTrans = () => {
                        //         return new Promise((resolve, reject) => {
                        //             assetcontract.getPastEvents('Create', {
                        //                 fromBlock: 0,
                        //                 toBlock: 'latest'
                        //             })
                        //                 .then(function (events) {
                        //                     var tempJsn = {}
                        //                     for (var event of events) {
                        //                        // console.log(event)
                        //                         var temp = event["returnValues"]["_tokenID"]
                        //                         //console.log(event["returnValues"])
                        //                         if (tokenID == temp) {
                        //                             // console.log("sd")
                        //                             tempJsn.from = 'Canada Govt'
                        //                             tempJsn.to = '-'
                        //                             tempJsn.description = 'Asset Creation'
                        //                             break;
                        //                         }
                        //                     }
                        //                     resolve(tempJsn);
                        //                     //res.json(events[0]["returnValues"]["_tokenID"])
                        //                 });
                        //         });
                        //     }
                        //     loopTrans().then(r => {
                        //         jsnData = r;
                        //     })
                        //         .catch(r => {
                        //             res.json({
                        //                 statusCode: 500,
                        //                 result: dataConfig.GlobalErrMsg
                        //             })
                        //         })
                        //         //console.log(jsnData)
                        //     break;
                        default:
                            jsnData = {};
                            break;
                    }

                    console.log(jsnData)
                    if (jsnData.hasOwnProperty('description')) {
                        // console.log("done")
                        resolve([jsnData]);
                    }
                    else {
                        resolve([]);
                    }

                } catch (error) {
                    reject(error);
                }

            });
        }
        const details = async () => {
            var tokenID = req.app.assetD[0]["tokenID"];
            var endBlockNumber = await web3.eth.getBlockNumber();
            var startBlockNumber = 0;
            console.log("Searching Transactions on tokenID : " + tokenID);

            for (var i = startBlockNumber; i <= endBlockNumber; i++) {
                if (i % 1000 == 0) {
                    console.log("Searching block " + i);
                }
                var block = await web3.eth.getBlock(i, true);
                // console.log(block)
                if (block != null && block.transactions != null) {
                    for (var trans of block.transactions) {
                        //console.log(trans)
                        var ret = await loopTrans(trans, block.timestamp, tokenID);
                        //console.log(ret.length)
                        if (ret.length > 0) {

                            var filtered = ret.filter(function () { return true });
                            fnlResult.push(filtered[0]);
                        }
                    }
                }
            }
            return fnlResult;
        }
        details().then(r => {
            //req.app.tokenIDs = null;
            req.app.result = r;
            // console.log(r)
            next();
            //res.json({ statusCode: 200, result: r })
        })
            .catch(r => {
                console.log(r)
                res.json({
                    statusCode: 500,
                    result: dataConfig.GlobalErrMsg
                })
            });
    };
    /**************************/
    // end to calls to AssetToken
    /**************************/
    /**************/
    //test
    /******************/


    exports.testGas = async (req, res) => {
        var _from = (await web3.eth.getAccounts())[0];
        var _to = (await web3.eth.getAccounts())[3];
        var tokenID = '103127725420421299009027266705421683310022189863692271989244868721091361824061';
        assetcontract.methods.transferAsset(_from, _to, tokenID).estimateGas({ gas: 5000000 }, function (error, gasAmount) {
            if (gasAmount == 5000000)
                console.log('Method ran out of gas');
            console.log(gasAmount)
            res.json("done")
        });
    }
    exports.testEvents = (req, res) => {
        try {

            assetcontract.getPastEvents('Create', {
                fromBlock: 0,
                toBlock: 'latest'
            })
                .then(function (events) {
                    console.log(events) // same results as the optional callback above
                    res.json(events)
                });
        } catch (error) {

        }
    };

    exports.testLogs = (req, res) => {
        web3.eth.getPastLogs({
            address: adminAddr
        })
            .then(r => {
                res.json(r)
            });
    }
    exports.testtransferLogic = async (req, res) => {
        try {
            var _from = (await web3.eth.getAccounts())[6];
            var _to = (await web3.eth.getAccounts())[0];
            var value = 10;//req.body.amount;

            EMPContract.methods.transfer(_to, value).send({ from: _from, value: 1 })
                .then(bal => {
                    //console.log(r);
                    //next();
                    res.json({ statusCode: 200, data: { address: _to, balance: bal } });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                });
        } catch (error) {
            console.log(error);
            res.json({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }
    };

    exports.testblocks = async (req, res) => {
        //console.log(arguments.callee.name)
        // var maxBlock = await web3.eth.getBlockNumber()
        // "transactions": [
        //     "0x49ebba10e98e89598fc4af4b11594d32720da419fb5fb71c3edec37a8cc52f5b"
        // ],
        // var a = [];

        web3.eth.getTransaction('0xa042a54e24f12b982fbc38db43e0ad7317012129b572d1ad7d246fbb5fb20cec')
            .then(r => {
                console.log(abiDecoder.decodeMethod(r.input))
                res.json(r);
            });
        // res.json("Asdsd")
        // assetcontract.testgetPastEvents('Create', function (error, event) {
        //     if (error) {
        //         res.json({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        //     }
        //     else {
        //         console.log(event);
        //         //req.app.tokenID = event[0]["returnValues"]["_tokenID"];
        //         // console.log(req.app.tokenID);
        //         // update mongoDB
        //         res.json("Asd")
        //         //res.json({ statusCode: 200, data: { address: adminAddr} });
        //     }
        // });

    };


} catch (error) {
    logger.error(debugLine(error))
    process.kill(process.pid, 'SIGTERM')
}
