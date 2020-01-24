const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const tokenExpiry = "1h"
const errMsg = "something went wrong! try again"
const User = require('../models/user.model.js');

/*
https://github.com/ranisalt/node-argon2/wiki/Options

*/

exports.registerUser = (req, res) => {

    User.findOne({ email: req.body.email })
        .then(async data => {
            try {
                if (data) {
                    // table has user so end the request
                    return res.send({ statusCode: 300, result: "Username already exists. Try Logging in" })
                }
                else {
                    //register user
                    const hash = await argon2.hash(req.body.password);

                    var userObj = {
                        "username": req.body.username,
                        "password": hash,
                        "email": req.body.email,
                        "emailverified": false,
                        "usertype": "user",
                        "signupmethod": "registration"
                    };
                    const user = new User(userObj);
                    user.save()
                        .then(data => {
                            var objToken = {
                                "email": userObj.email,
                                "id": data["_id"],
                                "name": userObj.username,
                                "emailverified": data["emailverified"],
                                "userType": data["usertype"]
                            }
                            let token = jwt.sign(objToken, req.secret, { expiresIn: tokenExpiry });
                            res.send({ statusCode: 200, result: objToken, "WWW-Authenticate": token });
                        })
                        .catch(err => {
                            res.send({
                                statusCode: 500,
                                result: err.message || errMsg
                            })
                        });
                }
            } catch (err) {
                res.send({
                    statusCode: 500,
                    result: err.message || errMsg
                })
            }
        })
        .catch(err => {
            res.send({
                statusCode: 500,
                result: err.message || errMsg
            })
        });

};

exports.validateLogin = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(async data => {
            try {
                if (!data) return res.send({ statusCode: 400, result: "Invalid Username / Password" })
                if (!data["active"]) return res.send({ statusCode: 400, result: "Contact Admin to re-activate your account" })

                if (await argon2.verify(data.password, req.body.password)) {

                    var objToken = {
                        "email": data.email,
                        "id": data["_id"],
                        "name": data.username,
                        "emailverified": data["emailverified"],
                        "userType": data["usertype"]
                    }
                    let token = jwt.sign(objToken, req.secret, { expiresIn: tokenExpiry });
                    res.send({ statusCode: 200, result: objToken, "WWW-Authenticate": token });

                } else {
                    // password did not match
                    return res.send({ statusCode: 400, result: "Invalid Username / Password" })
                }
            } catch (err) {
                // internal failure
                res.send({
                    statusCode: 500, result: err.message || errMsg
                })
            }

        })
        .catch(err => {
            res.send({
                statusCode: 500, result: err.message || errMsg
            })
        });
};