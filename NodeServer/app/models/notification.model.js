var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    assetId: { type: mongoose.Schema.ObjectId, required: true },
    proposedAmount: { type: Number, required: true },
    propertyValue: { type: Number, required: true},
    owner: { type: String, required: true },
    proposalAddr: { type: String, required: true },
    viewed: { type: Boolean, default: false }
}, {
    versionKey: false
});

module.exports = mongoose.model('Notification', NotificationSchema, 'Notification');