try {

    const Web3 = require('web3')
    require('dotenv').config();
    const dataConfig = require('../config/data.config.js');
    const abiDecoder = require('abi-decoder');
    const assetDecoder = abiDecoder;

    const rpcURL = process.env.blockURL
    const web3 = new Web3(rpcURL)

    //console.log(web3.version) //1.2.4
    // get count of contracts
    console.log("web3.js connected to " + web3.currentProvider["host"]);
    var adminAddr = null;
    web3.eth.getAccounts().then(r => { adminAddr = r[0] })
    /************************ */
    // initialize contract variables
    const fs = require('fs');
    var path = require('path');
    var rootPath = path.join('.', 'build', 'contracts');
    var EMPTokenJSON = JSON.parse(fs.readFileSync(path.join(rootPath, 'EMPToken.json'), 'utf8'));
    var AssetToken = JSON.parse(fs.readFileSync(path.join(rootPath, 'AssetToken.json'), 'utf8'));

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
    /************************** */

    /**************************/
    // calls to EMPToken
    /**************************/

    exports.getOwner = (req, res) => {
        var admin = req.body.admin;
        EMPContract.methods.getOwner().call()
            .then(r => {
                console.log(r);
                if (r == admin) {
                    res.send({ statusCode: 200, result: true });
                }
                else {
                    res.send({ statusCode: 200, result: false });
                }
            })
            .catch(err => {
                res.send({ statusCode: 500, result: dataConfig.GlobalErrMsg });
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
                    res.send({ statusCode: 200, result: bal });
                })
                .catch(err => {
                    res.send({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                });
        } catch (error) {
            res.send({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }

    }

    exports.transferTo = (req, res, next) => {
        console.log("transfer To")
        try {
            var _from = req.body.from;//(await web3.eth.getAccounts())[0];
            var _to = req.body.owner;//(await web3.eth.getAccounts())[3];
            var value = req.body.amount;

            if (!web3.utils.isAddress(_from) || !web3.utils.isAddress(_to)) {
                res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
            }
            if (value <= 0) {
                res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
            }
            EMPContract.methods.transfer(_to, value).send({ from: _from, value: 1 })
                .then(bal => {
                    //console.log(r);
                    // balance got deducted
                    console.log("next")
                    next();
                    //res.send({ statusCode: 200, data: { address: _to, balance: bal } });
                })
                .catch(err => {
                    console.log(err);
                    res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                });
        } catch (error) {
            console.log(error);
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }

    };

    function randomNumber() {
        return Math.floor(Math.random() * 10);
    }
    exports.registerUser = async (req, res, next) => {
        console.log('web3 registerUser')
        try {

            var rndInt = null;
            usrID.push(0)
            if (usrID.includes(0)) {
                while (true) {
                    rndInt = randomNumber();
                    if (usrID.includes(rndInt)) {
                        continue;
                    }
                    else {
                        usrID.push(rndInt)
                        req.app.user = "user"
                        break;
                    }
                }
            }
            else {
                rndInt = 0;
                req.app.user = "admin"
            }
            console.log(rndInt)
            var usrAddress = (await web3.eth.getAccounts())[rndInt];
            EMPContract.methods.registerUser(usrAddress).send({ from: usrAddress })
                .then(r => {
                    //res.send({ statusCode: 200, data: { address: usrAddress, result: dataConfig.UserRegistration } });
                    usrID.push(rndInt);
                    req.app.usrAddress = usrAddress;
                    console.log("next")
                    next();
                })
                .catch(err => {
                    console.log(err.message)
                    var errMsg = null;
                    if (String(err.message).includes("revert User already Exists")) {
                        errMsg = "User Exists. Try to Login"
                    }
                    if (errMsg == null) {
                        errMsg = dataConfig.GlobalErrMsg;
                    }
                    res.send({ statusCode: 500, data: errMsg });
                });
        } catch (error) {
            console.log(error)
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }
    }

    exports.getUserDetails = (req, res) => {
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
                        res.send({ statusCode: 200, result: user });
                    })
                    .catch(err => {
                        console.log(err)
                        res.send({ statusCode: 500, result: dataConfig.GlobalErrMsg });
                    });
            }
            else {
                throw "something";
            }

        } catch (error) {
            console.log(error)
            res.send({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }
    };

    /**************************/
    // end to calls to EMPToken
    /**************************/

    /**************************/
    // calls to AssetToken
    /**************************/

    exports.transferAsset = (req, res) => {
        try {
            var _from = req.body.from;//(await web3.eth.getAccounts())[0];
            var _to = req.body.owner;//(await web3.eth.getAccounts())[3];
            var tokenID = req.app.tokenID;
            assetcontract.methods.transferAsset(_from, _to, tokenID).send({ from: _from, value: 1 })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log(receipt)
                    res.send({ statusCode: 200, result: receipt });
                })
                .on('error', function (error, receipt) {
                    console.log(error)
                    res.send({ statusCode: 500, result: error });
                });
        } catch (error) {
            res.send({ statusCode: 500, result: dataConfig.GlobalErrMsg });
        }
    };
    // end of transferAsset

    //edit userID here
    exports.insertAssetweb3 = (req, res, next) => {
        //exports.insertAssetweb3 = (req, res) => {
        try {
            // var adminAddr = req.body.userID;

            var rndStr = web3.utils.soliditySha3(req.app.randomStr);
            assetcontract.methods.createAsset(rndStr).send({ from: adminAddr, gas: 1000000 })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log("confirmation")
                    //console.log(receipt)
                    assetcontract.getPastEvents('Create', function (error, event) {
                        if (error) {
                            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                        }
                        else {
                            //console.log(event);
                            req.app.tokenID = event[0]["returnValues"]["_tokenID"];
                            // console.log(req.app.tokenID);
                            // update mongoDB
                            next();
                            //res.send({ statusCode: 200, data: { address: adminAddr} });
                        }
                    });
                })
                .on('error', function (error, receipt) {
                    res.send({ statusCode: 500, data: { error: error, message: receipt } });
                })

        } catch (error) {
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }

    };

    exports.getTokenCount = (req, res) => {
        assetcontract.methods.tokenCount(adminAddr).call()
            .then(r => {
                res.send({ statusCode: 200, result: r });
            })
            .catch(err => {
                res.send({ statusCode: 500, result: err });
            });

    }

    exports.getAssetDetails = (req, res, next) => {
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
                res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
            })
    };

    exports.getTokensOfUser = (req, res, next) => {
        var user = adminAddr;
        // var user = req.body.userID;
        assetcontract.methods.ownedTokensOfUser(user).call()
            .then(r => {
                //res.send({ statusCode: 200, data: { address: adminAddr, result: r } });
                req.app.tokenIDs = r;
                next();
            })
            .catch(err => {
                res.send({ statusCode: 500, data: { error: err } });
            });

    };

    exports.getUserAssetCount = (req, res) => {
        var resu = req.app.details[0];
        var address = resu["address"];
        assetcontract.methods.tokenCount(address).call()
            .then(r => {
                resu = resu.toObject();
                resu.ownedTokens = r;
                res.send({ statusCode: 200, result: resu });
            })
            .catch(err => {
                res.send({ statusCode: 500, result: err });
            });

    };


    exports.getTransactions = async (req, res, next) => {
        var fnlResult = [];
        const loopTrans = (e, time, myaccount) => {
            return new Promise((resolve, reject) => {
                try {
                    var jsnData = {};
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    jsnData.description = "Property Purchase"
                    jsnData.date = (new Date(time)).toLocaleDateString("en-US", options)
                    //{from:,to:,amount:,date:,type:,description:}
                    if (myaccount == e.to) {
                        jsnData.from = e.from
                        jsnData.to = e.to
                        jsnData.amount = abiDecoder.decodeMethod(e.input)
                        jsnData.type = "Credit"
                    }
                    if (myaccount == e.from) {
                        jsnData.from = e.from
                        jsnData.to = abiDecoder.decodeMethod(e.input)["params"][0]["value"]
                        for (x in abiDecoder.decodeMethod(e.input)["params"][1]) {
                            if (x == "value") {
                                jsnData.amount = abiDecoder.decodeMethod(e.input)["params"][1][x]
                            }
                        }
                        jsnData.type = "Debit"

                        if (abiDecoder.decodeMethod(e.input)["name"].includes("register")) {
                            jsnData.from = "Canada Govt"
                            jsnData.to = e.from
                            jsnData.amount = 1000
                            jsnData.type = "Credit"
                            jsnData.description = "Registration"
                        }
                    }
                    else {
                        jsnData = {};
                    }
                    if (jsnData.hasOwnProperty('description')) {
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
            next();
            //res.send({ statusCode: 200, result: fnlResult })
        })
            .catch(r => {
                console.log(r)
                res.send({
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


    exports.testEvents = (req, res) => {
        try {

            assetcontract.getPastEvents('Create', {
                fromBlock: 0,
                toBlock: 'latest'
            })
                .then(function (events) {
                    console.log(events) // same results as the optional callback above
                    res.send(events)
                });
        } catch (error) {

        }
    };

    exports.transferLogic = async (req, res) => {
        try {
            var _from = (await web3.eth.getAccounts())[6];
            var _to = (await web3.eth.getAccounts())[0];
            var value = 10;//req.body.amount;

            EMPContract.methods.transfer(_to, value).send({ from: _from, value: 1 })
                .then(bal => {
                    //console.log(r);
                    //next();
                    res.send({ statusCode: 200, data: { address: _to, balance: bal } });
                })
                .catch(err => {
                    console.log(err);
                    res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                });
        } catch (error) {
            console.log(error);
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }
    };

    exports.blocks = async (req, res) => {
        //console.log(arguments.callee.name)
        // var maxBlock = await web3.eth.getBlockNumber()
        // "transactions": [
        //     "0x49ebba10e98e89598fc4af4b11594d32720da419fb5fb71c3edec37a8cc52f5b"
        // ],
        // var a = [];

        web3.eth.getTransaction('0x4f7d93877945e5b2fdacb132e115c85fd54908912a546d69c538e4b18def1fe4')
            .then(r => {
                console.log(abiDecoder.decodeMethod(r.input))
                res.send(r);
            });
        // res.send("Asdsd")


    };

} catch (error) {
    console.log("in catch")
    process.kill(process.pid, 'SIGTERM')
}
