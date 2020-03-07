const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const tokenExpiry = "6h"
const errMsg = "something went wrong! try again"
const User = require('../models/user.model.js');

/*
https://github.com/ranisalt/node-argon2/wiki/Options

*/

exports.registerUser = (req, res) => {

    User.findOne({ email: req.body.email })
        .then(async data => {
            console.log('open registerUser')
            try {
                if (data) {
                    // table has user so end the request
                    return res.json({ statusCode: 300, result: "Username already exists. Try Logging in" })
                }
                else {
                    //register user
                    const hash = await argon2.hash(req.body.password);

                    var userObj = {
                        "username": req.body.username,
                        "password": hash,
                        "email": req.body.email,
                        "emailverified": false,
                        "usertype": req.app.user,
                        "address": req.app.usrAddress,
                        "signupmethod": "registration"
                    };
                    const user = new User(userObj);
                    user.save()
                        .then(data => {
                            var objToken = {
                                "email": userObj.email,
                                "address": data["address"],
                                "name": userObj.username,
                                //"emailverified": data["emailverified"],
                                "userType": data["usertype"]
                            }
                            req.app.usrAddress = null;
                            req.app.user = null;
                            let token = jwt.sign(objToken, req.secret, { expiresIn: tokenExpiry });
                            res.json({ statusCode: 200, result: objToken, "WWW-Authenticate": token });
                        })
                        .catch(err => {
                            res.json({
                                statusCode: 500,
                                result: err.message || errMsg
                            })
                        });
                }
            } catch (err) {
                res.json({
                    statusCode: 500,
                    result: err.message || errMsg
                })
            }
        })
        .catch(err => {
            res.json({
                statusCode: 500,
                result: err.message || errMsg
            })
        });

};


exports.validateLogin = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(async data => {
            try {
                if (!data) return res.json({ statusCode: 400, result: "Invalid Username / Password" })
                if (!data["active"]) return res.json({ statusCode: 400, result: "Contact Admin to re-activate your account" })

                if (await argon2.verify(data.password, req.body.password)) {

                    var objToken = {
                        "email": data.email,
                        "address": data["address"],
                        "name": data.username,
                        //"emailverified": data["emailverified"],
                        "userType": data["usertype"]
                    }
                    let token = jwt.sign(objToken, req.secret, { expiresIn: tokenExpiry });
                    res.json({ statusCode: 200, result: objToken, "WWW-Authenticate": token });

                } else {
                    // password did not match
                    return res.json({ statusCode: 400, result: "Invalid Username / Password" })
                }
            } catch (err) {
                // internal failure
                res.json({
                    statusCode: 500, result: err.message || errMsg
                })
            }

        })
        .catch(err => {
            res.json({
                statusCode: 500, result: err.message || errMsg
            })
        });
};


exports.testme = (req, res) => {
   // console.log(req.body);
   
   res.json({ statusCode: 200, s: "trt" })
};