try {

    const Web3 = require('web3')
    require('dotenv').config();
    const dataConfig = require('../config/data.config.js');

    const rpcURL = process.env.blockURL
    const web3 = new Web3(rpcURL)

//console.log(web3.version) //1.2.4
    console.log("web3.js connected to " + web3.currentProvider["host"]);
    var adminAddr = null;
    web3.eth.getAccounts().then(r => { adminAddr = r[0] })
    /************************ */
    // initialize contract variables
    const fs = require('fs');
    var path = require('path');
    var rootPath = path.join('.', 'build', 'contracts');
    var EMPTokenJSON = JSON.parse(fs.readFileSync(path.join(rootPath, 'EMPToken.json'), 'utf8'));

    const abi = EMPTokenJSON["abi"]
    const address = EMPTokenJSON["networks"][process.env.blockNetwork]["address"]
    const EMPContract = new web3.eth.Contract(abi, address)
    /************************** */

    exports.getBalance = async (req, res) => {
        try {
            var usrAddress = (await web3.eth.getAccounts())[3];
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

    exports.transferTo = async (req, res) => {
        try {
            var _from = (await web3.eth.getAccounts())[0];
            var _to = (await web3.eth.getAccounts())[3];

            EMPContract.methods.transfer(_to, 4).send({ from: _from,value:2 })
                .then(bal => {
                    //console.log(r);
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

    exports.registerUser = async (req, res) => {
        try {
            var usrAddress = (await web3.eth.getAccounts())[2];

            EMPContract.methods.registerUser(usrAddress).send({ from: adminAddr })
                .then(r => {
                    res.send({ statusCode: 200, data: { address: usrAddress, result: dataConfig.UserRegistration } });
                })
                .catch(err => {
                    res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
                });
        } catch (error) {
            res.send({ statusCode: 500, data: { error: dataConfig.GlobalErrMsg } });
        }


    }

    exports.createAsset = (req,res) =>{
        console.log(req.app.randomStr);
        res.send("asd");
    }
} catch (error) {
    console.log("in catch")
    process.kill(process.pid, 'SIGTERM')
}
