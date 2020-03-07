const jwt = require('jsonwebtoken');
var validator = require("email-validator");
require('dotenv').config()

//References:
// 1. https://www.youtube.com/watch?v=mbsmsi7l3r4 - how to setup jwt secret key

const secret = process.env.secret_key;
if (typeof secret === 'undefined') {
    console.log("Key not found. Exiting the process");
    process.exit(1);
}

const errMsg = '[INVALID] Not a valid request'
var gblErrMsg = ''

// ************************* validation functions ******************************
function validateEmail(email) {
    if (validator.validate(email)) {

    }
    else {
        gblErrMsg = gblErrMsg.concat('Email is not in proper format||')
    }
    return true;
}
function validatePassword(pass) {

    if (Boolean(pass)) {

        if (pass.length > 7 && pass.length < 11) {

            // var regex = new Regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
            var letter = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
            if (!pass.match(letter)) {
                gblErrMsg = gblErrMsg.concat('Password must have one upper&lower case English letter,one digit and special character and minimum 8 in length||')
            }
        }
        else {
            gblErrMsg = gblErrMsg.concat('Password should be between 8 and 10||')
        }
    }
    else {
        gblErrMsg = gblErrMsg.concat('Password cannot be empty||')
    }
    return true
}
function validateUserName(uName) {
    if (Boolean(uName)) {
        //Expression can start or end only with a letter
        //Expression cannot contain consecutive spaces
        var letter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/
        if (!uName.match(letter)) {
            gblErrMsg = gblErrMsg.concat('Username can start or end only with a letter and cannot contain consecutive spaces||')
        }
    }
    else {
        gblErrMsg = gblErrMsg.concat('Username cannot be empty||')
    }
    return true
}


// ************************* end of validation functions ************************


function userRegistrationCheck(req, res, next) {
    gblErrMsg = '';
    // var inputs = sanitizeInputs(req);
    if (!req.body.email) return res.json({ statusCode: 500, result: errMsg })
    if (!req.body.username) return res.json({ statusCode: 500, result: errMsg })
    if (!req.body.password) return res.json({ statusCode: 500, result: errMsg })
    //write validation 
    //console.log(req.body)
    if (validateEmail(req.body.email)) {
        if (validatePassword(req.body.password)) {
            if (validateUserName(req.body.username)) {

            }
        }
    }

    if (Boolean(gblErrMsg)) {
        return res.json({ statusCode: 500, result: gblErrMsg })
    }
    else {
        req.secret = secret
        next();
    }
}

function userLoginCheck(req, res, next) {
    gblErrMsg = '';
    //console.log("userlogin check")
    //var inputs = sanitizeInputs(req);
    //console.log(req.body)
    if (!req.body.email) return res.json({ message: errMsg })
    if (!req.body.password) return res.json({ message: errMsg })

    //write validations & sanitize here
    if (validateEmail(req.body.email)) {

    }
    if (Boolean(gblErrMsg)) {
        console.log(gblErrMsg)
        return res.json({ statusCode: 500, result: gblErrMsg })
    }
    else {
        req.secret = secret
        next();
    }

}

function checkToken(req, res, next) {
    //console.log(req.headers)
    // console.log("inside checktoken")
    var bearerHeader = req.headers["authorization"]
    if (bearerHeader === undefined) {
        return res.json({ statusCode: 500, message: errMsg })
    }
    else {

        var reqToken = bearerHeader.split(' ')[1]
        jwt.verify(reqToken, secret, (err, decoded) => {
            if (err) return res.status(500).send({ message: errMsg })
            req.secret = secret;
            req.token = reqToken;
            next();
        });
    }
}

function decodetoken(req, res, next) {
    var bearerHeader = req.headers["authorization"]
    //console.log(bearerHeader)
    if (bearerHeader === undefined) {
        return res.json({ statusCode: 500, result: errMsg })
    }
    else {
        
        var role = ['user', 'admin']
        var reqToken = bearerHeader.split(' ')[1]
        //console.log(reqToken)
        jwt.verify(reqToken, secret, (err, decoded) => {
            //console.log(err)
            if (err) return res.json({ statusCode: 500, result: errMsg })
            if (role.includes(decoded["userType"])) {
                res.json({ statusCode: 200, result: decoded })
            }
            else return res.json({ statusCode: 500, result: errMsg })

        });
    }
}

function returndecodetoken(req, res, next) {
    var bearerHeader = req.headers["authorization"]
    //console.log(bearerHeader)
    if (bearerHeader === undefined) {
        return res.json(false)
    }
    else {
        //console.log("herer")
        var role = ['user', 'admin']
        var reqToken = bearerHeader.split(' ')[1]
        jwt.verify(reqToken, secret, (err, decoded) => {
            console.log(err)
            if (err) return res.json(false)
            if (role.includes(decoded["userType"])) {
                res.json(true)
            }
            else return res.json(false)

        });
    }
}

function checkRole(req, res, next) {
    //console.log("inside checkRole")
    var bearerHeader = req.headers["authorization"]
    if (bearerHeader === undefined) {
        return res.json({ statusCode: 500, message: errMsg })
    }
    else {
        var role = ['user', 'admin']
        var reqToken = bearerHeader.split(' ')[1]
        jwt.verify(reqToken, secret, (err, decoded) => {
            if (err) return res.status(500).send({ message: errMsg })
            //console.log(decoded);
            if (role.includes(decoded["userType"])) {
                switch (decoded["userType"]) {
                    case "user":
                        if (!(req.url.split('/')[1].toLowerCase() == "user")) {
                            return res.status(500).send({ message: errMsg })
                        }
                        break;
                    case "admin":
                        if (!(req.url.split('/')[1].toLowerCase() == "admin")) {
                            return res.status(500).send({ message: errMsg })
                        }
                        break;
                }
            }
            else return res.status(500).send({ message: errMsg })
            next();
        });
    }
}


module.exports = {
    CheckRegistration: userRegistrationCheck,
    CheckLogin: userLoginCheck,
    CheckToken: checkToken,
    CheckRole: checkRole,
    DecodeToken: decodetoken,
    returnToken: returndecodetoken
};