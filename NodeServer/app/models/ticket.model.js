var mongoose = require('mongoose');

var TicketSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    subject: { type: String, maxLength:100,required: true },
    //description: { type: String, required: true },
    owner: { type: String, required: true },
    //createdDate: { type: Date, default: Date.now() },
    resolved: { type: Boolean, default: false }, 
    filePath: { type: String}
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Ticket', TicketSchema, 'Ticket');