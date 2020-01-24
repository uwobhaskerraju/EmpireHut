var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailverified: { type: Boolean, default: false },
    active:{type:Boolean,default:true},
    usertype: { type: String, default: "user" },
    signupmethod: { type: String, required: true }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', UserSchema, 'User');