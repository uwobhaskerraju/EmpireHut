try {

    const Web3 = require('web3')
    require('dotenv').config();
    const dataConfig = require('../config/data.config.js');
    const abiDecoder = require('abi-decoder');

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
                res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
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
                    res.send({ statusCode: 200, data: { address: usrAddress, balance: bal } });
                })
                .catch(err => {
                    res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                });
        } catch (error) {
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }

    }

    exports.transferTo = (req, res, next) => {
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
            if (usrID.includes(0)) {
                while (true) {
                    rndInt = randomNumber();
                    if (usrID.includes(rndInt)) {
                        continue;
                    }
                    else {
                        req.app.user="user"
                        break;
                    }
                }
            }
            else {
                rndInt = 0;
                req.app.user = "admin"
            }

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
                        res.send({ statusCode: 200, data: user });
                    })
                    .catch(err => {
                        console.log(err)
                        res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                    });
            }
            else {
                throw "something";
            }

        } catch (error) {
            console.log(error)
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
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

        } catch (error) {
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
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
                res.send({ statusCode: 200, data: { address: adminAddr, result: r } });
            })
            .catch(err => {
                res.send({ statusCode: 500, data: { error: err } });
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
    /**************************/
    // end to calls to AssetToken
    /**************************/
    /**************/
    //test
    /******************/

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
        console.log(arguments.callee.name)
        // var maxBlock = await web3.eth.getBlockNumber()
        // "transactions": [
        //     "0x49ebba10e98e89598fc4af4b11594d32720da419fb5fb71c3edec37a8cc52f5b"
        // ],
        // var a = [];

        // web3.eth.getTransaction('0x484c52eb41d0071fd631df44ef975d181bae93524c7e5acc4c24a5cb6b2e5161')
        //     .then(r => {
        //         console.log(abiDecoder.decodeMethod(r.input))
        //         res.send(r);
        //     });
        res.send("Asdsd")


    };

} catch (error) {
    console.log("in catch")
    process.kill(process.pid, 'SIGTERM')
}
