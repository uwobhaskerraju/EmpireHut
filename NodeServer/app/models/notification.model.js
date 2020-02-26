var mongoose = require('mongoose');
var moment = require('moment');
var hourFromNow = function(){
    return moment().add(1, 'hour');
};


var NotificationSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    assetId: { type: mongoose.Schema.ObjectId, required: true },
    proposedAmount: { type: Number, required: true },
    propertyValue: { type: Number, required: true },
    owner: { type: String, required: true },
    proposalAddr: { type: String, required: true },
    deal: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    datetime: { type: Date, default:hourFromNow}
}, {
    versionKey: false
});

module.exports = mongoose.model('Notification', NotificationSchema, 'Notification');