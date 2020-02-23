var mongoose = require('mongoose');

var AssetSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    tokenID: { type: String, required: true, unique: true },
    name: { type: String, required: true, minlength: 1, maxlength: 15 },
    address: { type: String, required: true, minlength: 1, maxlength: 15 },
    //owner: { type: String,  required: true },
    area: { type: Number, default: 0, min: 1, max: 1000 },
    price: { type: Number, default: 0 },
    latlong: { type: String },
    picture: { type: String, default: "1.jpg" },
    hidden: { type: Boolean, default: false }
}, {
    versionKey: false
});

module.exports = mongoose.model('Asset', AssetSchema, 'Asset');