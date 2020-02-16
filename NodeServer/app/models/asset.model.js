var mongoose = require('mongoose');

var AssetSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    tokenID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    //owner: { type: String,  required: true },
    area: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    latlong: { type: String },
    picture: { type: String, default: "asset.jpg" },
    hidden: { type: Boolean, default: false }
}, {
    versionKey: false
});

module.exports = mongoose.model('Asset', AssetSchema, 'Asset');