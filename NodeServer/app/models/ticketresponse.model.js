var mongoose = require('mongoose');

const moment = require('moment-timezone');
const dateToronto = moment().startOf('day').tz('UTC')


var TicketRespSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    ticketID: { type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: true },
    comment: { type: String,maxLength:1000, required: true },
    owner: { type: String, required: true },
    //createdOn: { type: Date, default:dateToronto},
    active: { type: Boolean, default: true }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('TicketResp', TicketRespSchema, 'TicketResp');