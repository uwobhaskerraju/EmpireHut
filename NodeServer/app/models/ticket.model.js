var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateToronto = moment().startOf('day').tz('UTC')


var TicketSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    subject: { type: String, required: true },
    //description: { type: String, required: true },
    owner: { type: String, required: true },
    createdDate: { type: Date, default: dateToronto },
    status: { type: Boolean, default: 0 }, //0-open,1-resolved
    filePath: { type: String, require: true }
}, {
    versionKey: false
});

module.exports = mongoose.model('Ticket', TicketSchema, 'Ticket');