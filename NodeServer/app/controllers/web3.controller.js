const Web3 = require('web3')
require('dotenv').config();

const rpcURL = process.env.blockURL
const web3 = new Web3(rpcURL)

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
    var usrAddress = (await web3.eth.getAccounts())[2];
    EMPContract.methods.balanceOf(usrAddress).call().then(r => {
        //console.log(r);
        res.send({ statusCode: 200, data: { address: usrAddress, balance: r } });
    });
}

exports.registerUser = async (req, res) => {
    //adminAddr =(await web3.eth.getAccounts())[0]
    var usrAddress = (await web3.eth.getAccounts())[2];

    EMPContract.methods.registerUser(usrAddress).send({ from: adminAddr }).then(r => {

        res.send({ statusCode: 200, data: { address: usrAddress, result: "Registered User Successfully" } });
    });

}