var mongoose = require('mongoose');

const moment = require('moment-timezone');
const dateToronto = moment().startOf('day').tz('UTC')


var NotificationSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    assetId: { type: mongoose.Schema.ObjectId, required: true },
    proposedAmount: { type: Number, required: true },
    propertyValue: { type: Number, required: true },
    owner: { type: String, required: true },
    proposalAddr: { type: String, required: true },
    deal: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    datetime: { type: Date, default:dateToronto}
}, {
    versionKey: false
});

module.exports = mongoose.model('Notification', NotificationSchema, 'Notification');